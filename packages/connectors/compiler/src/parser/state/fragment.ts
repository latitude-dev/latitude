import { Parser } from '..'
import { dashComment } from './dash_comment'
import { multiLineComment } from './multi_line_comment'
import { mustache } from './mustache'
import { text } from './text'

export default function fragment(parser: Parser): (parser: Parser) => void {
  if (parser.match('{') || parser.match('}')) {
    return mustache
  }
  if (parser.match('/*') || parser.match('*/')) {
    return multiLineComment
  }
  if (parser.match('--')) {
    return dashComment
  }

  return text
}
