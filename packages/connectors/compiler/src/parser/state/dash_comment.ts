import { Parser } from '..'

export function dashComment(parser: Parser) {
  const start = parser.index

  let data = ''

  while (parser.index < parser.template.length) {
    if (parser.matchRegex(/\n/)) {
      break
    }
    data += parser.template[parser.index++]
  }

  const node = {
    start,
    end: parser.index,
    type: 'Comment',
    raw: data,
    data: data.substring(2),
  }

  parser.current().children!.push(node)
}
