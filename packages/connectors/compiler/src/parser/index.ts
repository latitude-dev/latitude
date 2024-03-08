import type CompileError from '../error/error'
import { error } from '../error/error'
import { type Fragment, type TemplateNode } from './interfaces'
import PARSER_ERRORS from '../error/errors'
import fullCharCodeAt from './utils/full_char_code_at'
import { reserved } from '../utils/names'
// @ts-expect-error - no types
import { isIdentifierStart, isIdentifierChar } from 'acorn'
import fragment from './state/fragment'

export default function parse(template: string) {
  return new Parser(template).parse()
}

type ParserState = (parser: Parser) => void | ParserState

export class Parser {
  index: number = 0
  stack: TemplateNode[] = []

  constructor(public template: string) {}

  parse(): Fragment {
    const template: Fragment = {
      start: 0,
      end: this.template.length,
      type: 'Fragment',
      children: [],
    }
    this.stack.push(template)

    let state: ParserState = fragment
    while (this.index < this.template.length) {
      state = state(this) || fragment
    }
    if (this.stack.length > 1) {
      const current = this.current()
      this.error(
        {
          code: `unclosed-block`,
          message: `Block was left open`,
        },
        current.start!,
      )
    }
    if (state !== fragment) {
      this.error({
        code: `unexpected-eof`,
        message: `Unexpected end of input`,
      })
    }
    if (template.children.length) {
      let start = template.children[0]!.start!
      while (/\s/.test(template[start])) start += 1
      let end = template.children[template.children.length - 1]!.end!
      while (/\s/.test(template[end - 1])) end -= 1
      template.start = start
      template.end = end
    } else {
      template.start = template.end = null
    }

    return template
  }

  current(): TemplateNode {
    return this.stack[this.stack.length - 1]!
  }

  match(str: string) {
    return this.template.slice(this.index, this.index + str.length) === str
  }

  allowWhitespace() {
    while (
      this.index < this.template.length &&
      /\s/.test(this.template[this.index] || '')
    ) {
      this.index++
    }
  }

  requireWhitespace() {
    if (!/\s/.test(this.template[this.index]!)) {
      this.error({
        code: 'missing-whitespace',
        message: 'Expected whitespace',
      })
    }
    this.allowWhitespace()
  }

  eat(
    str: string,
    required: boolean = false,
    error?: { code: string; message: string },
  ) {
    if (this.match(str)) {
      this.index += str.length
      return true
    }
    if (required) {
      this.error(
        error ||
          (this.index === this.template.length
            ? PARSER_ERRORS.unexpectedEofToken(str)
            : PARSER_ERRORS.unexpectedToken(str)),
      )
    }
    return false
  }

  error(
    { code, message }: { code: string; message: string },
    index = this.index,
  ) {
    error(message, {
      name: 'ParseError',
      code,
      source: this.template,
      start: index - 1,
    })
  }

  acornError(err: CompileError) {
    this.error(
      {
        code: 'parse-error',
        message: err.message.replace(/ \(\d+:\d+\)$/, ''),
      },
      err.pos,
    )
  }

  matchRegex(pattern: RegExp) {
    const match = pattern.exec(this.template.slice(this.index))
    if (!match || match.index !== 0) return null
    return match[0]
  }

  read(pattern: RegExp) {
    const result = this.matchRegex(pattern)
    if (result) this.index += result.length
    return result
  }

  readIdentifier(allowReserved: boolean = false) {
    const start = this.index
    let i = this.index
    const code = fullCharCodeAt(this.template, i)
    if (!isIdentifierStart(code, true)) return null
    i += code <= 0xffff ? 1 : 2
    while (i < this.template.length) {
      const code = fullCharCodeAt(this.template, i)
      if (!isIdentifierChar(code, true)) break
      i += code <= 0xffff ? 1 : 2
    }
    const identifier = this.template.slice(this.index, (this.index = i))
    if (!allowReserved && reserved.has(identifier)) {
      this.error(
        {
          code: 'unexpected-reserved-word',
          message: `'${identifier}' is a reserved word in JavaScript and cannot be used here`,
        },
        start,
      )
    }
    return identifier
  }
}
