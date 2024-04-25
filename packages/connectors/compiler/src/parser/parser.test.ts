import { describe, it, expect } from 'vitest'
import parse from '.'
import CompileError from '../error/error'

const getExpectedError = <T>(
  action: () => void,
  errorClass: new () => T,
): T => {
  try {
    action()
  } catch (err) {
    expect(err).toBeInstanceOf(errorClass)
    return err as T
  }
  throw new Error('Expected an error to be thrown')
}

describe('Fragment', () => {
  it('parses any string as a fragment', () => {
    const fragment = parse('hello world')
    expect(fragment.type).toBe('Fragment')
  })
})

describe('Text Block', () => {
  it('parses any regular string as a text block', () => {
    const text = 'hello world'
    const fragment = parse(text)
    expect(fragment.children.length).toBe(1)

    const textBlock = fragment.children[0]!
    expect(textBlock.type).toBe('Text')
    expect(textBlock.data).toBe(text)
  })

  it('keeps line breaks', () => {
    const text = 'hello\nworld'
    const fragment = parse(text)
    expect(fragment.children.length).toBe(1)

    const textBlock = fragment.children[0]!
    expect(textBlock.type).toBe('Text')
    expect(textBlock.data).toBe(text)
  })

  it('parses escaped brackets as text', () => {
    const text = 'hello \\{ world'
    const expected = 'hello { world'
    const fragment = parse(text)
    expect(fragment.children.length).toBe(1)

    const textBlock = fragment.children[0]!
    expect(textBlock.type).toBe('Text')
    expect(textBlock.data).toBe(expected)
  })

  it('ignores brackets within a string', () => {
    const stringCharacters = ['"', "'", '`']
    stringCharacters.forEach((char) => {
      const text = `hello ${char}{${char} world`
      const fragment = parse(text)
      expect(fragment.children.length).toBe(1)

      const textBlock = fragment.children[0]!
      expect(textBlock.type).toBe('Text')
      expect(textBlock.data).toBe(text)
    })
  })

  it('does not ignore brackets within an escaped string', () => {
    const stringCharacters = ['"', "'", '`']
    stringCharacters.forEach((char) => {
      const text = `hello \\${char}{foo}\\${char} world`
      const fragment = parse(text)
      expect(fragment.children.length).toBe(3)

      const textBlock1 = fragment.children[0]!
      expect(textBlock1.type).toBe('Text')
      expect(textBlock1.data).toBe(`hello ${char}`)

      const mustacheTag = fragment.children[1]!
      expect(mustacheTag.type).toBe('MustacheTag')

      const textBlock2 = fragment.children[2]!
      expect(textBlock2.type).toBe('Text')
      expect(textBlock2.data).toBe(`${char} world`)
    })
  })

  it('ignores comments within a string', () => {
    const text = "hello '--' world"
    const fragment = parse(text)
    expect(fragment.children.length).toBe(1)

    const textBlock = fragment.children[0]!
    expect(textBlock.type).toBe('Text')
    expect(textBlock.data).toBe(text)
  })
})

describe('Comment block', () => {
  it('parses a dash comment block', () => {
    const fragment = parse('--hello world')
    expect(fragment.children.length).toBe(1)

    const commentBlock = fragment.children[0]!
    expect(commentBlock.type).toBe('Comment')
    expect(commentBlock.data).toBe('hello world')
    expect(commentBlock.raw).toBe('--hello world')
  })

  it('parses a multi line comment block', () => {
    const fragment = parse('/* hello\nworld */')
    expect(fragment.children.length).toBe(1)

    const commentBlock = fragment.children[0]!
    expect(commentBlock.type).toBe('Comment')
    expect(commentBlock.data).toBe(' hello\nworld ')
    expect(commentBlock.raw).toBe('/* hello\nworld */')
  })

  it('parses dash comments from the dash to the end of the line', () => {
    const fragment = parse('hello -- world\nfoo')
    expect(fragment.children.length).toBe(3)

    const textBlock1 = fragment.children[0]!
    expect(textBlock1.type).toBe('Text')
    expect(textBlock1.data).toBe('hello ')

    const commentBlock = fragment.children[1]!
    expect(commentBlock.type).toBe('Comment')
    expect(commentBlock.data).toBe(' world')

    const textBlock2 = fragment.children[2]!
    expect(textBlock2.type).toBe('Text')
    expect(textBlock2.data).toBe('\nfoo')
  })

  it('parses multi line comments from the start to the end of the comment', () => {
    const fragment = parse('hello /* world\nfoo */ bar')
    expect(fragment.children.length).toBe(3)

    const textBlock1 = fragment.children[0]!
    expect(textBlock1.type).toBe('Text')
    expect(textBlock1.data).toBe('hello ')

    const commentBlock = fragment.children[1]!
    expect(commentBlock.type).toBe('Comment')
    expect(commentBlock.data).toBe(' world\nfoo ')

    const textBlock2 = fragment.children[2]!
    expect(textBlock2.type).toBe('Text')
    expect(textBlock2.data).toBe(' bar')
  })

  it('ignores brackets within dash comments', () => {
    const fragment = parse('hello world -- {foo}')
    expect(fragment.children.length).toBe(2)

    const textBlock = fragment.children[0]!
    expect(textBlock.type).toBe('Text')
    expect(textBlock.data).toBe('hello world ')

    const commentBlock = fragment.children[1]!
    expect(commentBlock.type).toBe('Comment')
    expect(commentBlock.data).toBe(' {foo}')
  })

  it('ignores brackets within multi-line comments', () => {
    const fragment = parse('hello /* {foo} */ world')
    expect(fragment.children.length).toBe(3)

    const textBlock1 = fragment.children[0]!
    expect(textBlock1.type).toBe('Text')
    expect(textBlock1.data).toBe('hello ')

    const commentBlock = fragment.children[1]!
    expect(commentBlock.type).toBe('Comment')
    expect(commentBlock.data).toBe(' {foo} ')

    const textBlock2 = fragment.children[2]!
    expect(textBlock2.type).toBe('Text')
    expect(textBlock2.data).toBe(' world')
  })
})

describe('If block', () => {
  it('parses any if condition as an IfBlock', () => {
    const fragment = parse('{#if condition}{/if}')
    expect(fragment.children.length).toBe(1)

    const ifBlock = fragment.children[0]!
    expect(ifBlock.type).toBe('IfBlock')
  })

  it('fails if the if block is not closed', () => {
    const action = () => parse('{#if condition}')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unclosed-block')
  })

  it('fails if the if block is not opened', () => {
    const action = () => parse('{/if}')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unexpected-block-close')
  })

  it('parses the if condition', () => {
    const fragment = parse('{#if condition}then{/if}')
    const ifBlock = fragment.children[0]!
    expect(ifBlock.type).toBe('IfBlock')
    expect(ifBlock.expression).toBeTruthy()
    expect(ifBlock.children?.length).toBe(1)

    const child = ifBlock.children![0]!
    expect(child.type).toBe('Text')
    expect(child.data).toBe('then')
  })

  it('fails if a condition is not provided', () => {
    const action1 = () => parse('{#if}then{/if}')
    const action2 = () => parse('{#if }then{/if}')
    const error1 = getExpectedError(action1, CompileError)
    const error2 = getExpectedError(action2, CompileError)
    expect(error1.code).toBe('missing-whitespace')
    expect(error2.code).toBe('parse-error')
  })
})

describe('Else block', () => {
  it('parses an else block', () => {
    const fragment = parse('{#if condition}then{:else}else{/if}')
    expect(fragment.children.length).toBe(1)

    const ifBlock = fragment.children[0]!
    expect(ifBlock.type).toBe('IfBlock')
    expect(ifBlock.else).toBeTruthy()

    const elseBlock = ifBlock.else!
    expect(elseBlock.type).toBe('ElseBlock')
  })

  it('parses an else if block', () => {
    const fragment = parse(
      '{#if condition}then1{:else if condition}then2{:else}then3{/if}',
    )
    expect(fragment.children.length).toBe(1)

    const ifBlock = fragment.children[0]!
    expect(ifBlock.type).toBe('IfBlock')
    expect(ifBlock.children?.length).toBe(1)
    expect(ifBlock.children![0]!.type).toBe('Text')
    expect(ifBlock.children![0]!.data).toBe('then1')
    expect(ifBlock.else).toBeTruthy()

    const elseBlock = ifBlock.else!
    expect(elseBlock.type).toBe('ElseBlock')
    expect(elseBlock.children?.length).toBe(1)
    expect(elseBlock.children![0]!.type).toBe('IfBlock')

    const elseIfBlock = elseBlock.children![0]!
    expect(elseIfBlock.type).toBe('IfBlock')
    expect(elseIfBlock.children?.length).toBe(1)
    expect(elseIfBlock.children![0]!.type).toBe('Text')
    expect(elseIfBlock.children![0]!.data).toBe('then2')
    expect(elseIfBlock.else).toBeTruthy()

    const elseBlock2 = elseIfBlock.else!
    expect(elseBlock2.type).toBe('ElseBlock')
    expect(elseBlock2.children?.length).toBe(1)
    expect(elseBlock2.children![0]!.type).toBe('Text')
    expect(elseBlock2.children![0]!.data).toBe('then3')
  })

  it('fails if the else does not have a matching if', () => {
    const action = () => parse('{:else}else{/if}')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('invalid-else-placement')
  })

  it('fails if the else if does not have a matching if', () => {
    const action = () => parse('{:else if condition}then{/if}')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('invalid-elseif-placement')
  })

  it('fails if the else block is not closed', () => {
    const action = () => parse('{#if condition}then{:else}else')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unclosed-block')
  })

  it('fails if the else block is not opened', () => {
    const action = () => parse('{#if condition}then{/else}')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unexpected-token')
  })
})

describe('Each block', () => {
  it('parses an each block', () => {
    const fragment = parse('{#each list as item}item{/each}')
    expect(fragment.children.length).toBe(1)

    const eachBlock = fragment.children[0]!
    expect(eachBlock.type).toBe('EachBlock')
    expect(eachBlock.expression).toBeTruthy()
    expect(eachBlock.context).toBeTruthy()
    expect(eachBlock.children?.length).toBe(1)

    const child = eachBlock.children![0]!
    expect(child.type).toBe('Text')
    expect(child.data).toBe('item')
  })

  it('allows for an else block', () => {
    const fragment = parse('{#each list as item}item{:else}empty{/each}')
    expect(fragment.children.length).toBe(1)

    const eachBlock = fragment.children[0]!
    expect(eachBlock.type).toBe('EachBlock')
    expect(eachBlock.expression).toBeTruthy()
    expect(eachBlock.context).toBeTruthy()
    expect(eachBlock.children?.length).toBe(1)

    const child = eachBlock.children![0]!
    expect(child.type).toBe('Text')
    expect(child.data).toBe('item')

    expect(eachBlock.else).toBeTruthy()
    expect(eachBlock.else!.type).toBe('ElseBlock')
  })

  it('fails if the each block is not closed', () => {
    const action = () => parse('{#each list as item}item')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unclosed-block')
  })

  it('fails if the each block is not opened', () => {
    const action = () => parse('{/each}')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unexpected-block-close')
  })
})

describe('Const tag', () => {
  it('parses a const tag', () => {
    const fragment = parse('{@const name = "value"}')
    expect(fragment.children.length).toBe(1)

    const constTag = fragment.children[0]!
    expect(constTag.type).toBe('ConstTag')
    expect(constTag.expression).toBeTruthy()
  })

  it('fails if the const tag is not closed', () => {
    const action = () => parse('{@const name = "value"')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unexpected-eof')
  })

  it('fails if the const keyword is not present', () => {
    const action1 = () => parse('{@name = "value"}')
    const action2 = () => parse('{@ name = "value"}')
    const error1 = getExpectedError(action1, CompileError)
    const error2 = getExpectedError(action2, CompileError)
    expect(error1.code).toBe('parse-error')
    expect(error2.code).toBe('parse-error')
  })
})

describe('Config tag', () => {
  it('parses a config tag', () => {
    const fragment = parse('{@config name = "value"}')
    expect(fragment.children.length).toBe(1)

    const configTag = fragment.children[0]!
    expect(configTag.type).toBe('ConfigTag')
    expect(configTag.expression).toBeTruthy()
  })

  it('fails if the config tag is not closed', () => {
    const action = () => parse('{@config name = "value"')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unexpected-eof')
  })
})

describe('Mustache tags', () => {
  it('parses a mustache tag', () => {
    const fragment = parse('{expression}')
    expect(fragment.children.length).toBe(1)

    const mustacheTag = fragment.children[0]!
    expect(mustacheTag.type).toBe('MustacheTag')
    expect(mustacheTag.expression).toBeTruthy()
  })

  it('parses an escaped mustache tag as text', () => {
    const fragment = parse('\\{expression\\}')
    expect(fragment.children.length).toBe(1)

    const textBlock = fragment.children[0]!
    expect(textBlock.type).toBe('Text')
    expect(textBlock.data).toBe('{expression}')
  })

  it('fails if the mustache tag is not closed', () => {
    const action = () => parse('{expression')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unexpected-eof')
  })

  it('fails if the mustache tag is not opened', () => {
    const action = () => parse('expression}')
    const error = getExpectedError(action, CompileError)
    expect(error.code).toBe('unexpected-mustache-close-tag')
  })
})
