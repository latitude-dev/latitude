import { type Parser } from "..";

const STRING_DELIMITERS_REGEX = /['"`]/;
function textInString(parser: Parser, char: string): string {
  let data = '';

  while (parser.index < parser.template.length) {
    if (parser.match(char) && !parser.match(char.repeat(2)) && !data.match(/(?<!\\)(\\\\)*\\/)) {
      break;
    }
    data += parser.template[parser.index++];
  }

  parser.index++
  return char + data + char;
}

const ENDS_WITH_ESCAPE_REGEX = /(?<!\\)(\\\\)*\\$/;
const RESERVED_DELIMITERS = ['{', '}', '--', '/*', '*/'];

export function text(parser: Parser) {
  const start = parser.index;
  let data = '';

  while (parser.index < parser.template.length) {
    const isEscaping = ENDS_WITH_ESCAPE_REGEX.test(data);

    console.log('Checking for coincident delimiters in text', parser.template.slice(parser.index, parser.index + 5));
    const areThereCoincidentDelimiters = RESERVED_DELIMITERS.some(sample => parser.match(sample));
    console.log('Are there coincident delimiters in text?', areThereCoincidentDelimiters);
    if (areThereCoincidentDelimiters) {
      if (!isEscaping) break
      data = data.slice(0, -1);
    }
    if (!isEscaping && parser.matchRegex(STRING_DELIMITERS_REGEX)) {
      data += textInString(parser, parser.template[parser.index++]!);
      continue;
    }
    data += parser.template[parser.index++];
  }

  const node = {
    start,
    end: parser.index,
    type: 'Text',
    raw: data,
    data: data.replace(/(?<!\\)\\{/g, '{').replace(/(?<!\\)\\}/g, '}')
  };

  parser.current().children!.push(node);
}