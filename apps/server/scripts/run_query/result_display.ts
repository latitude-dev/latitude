import QueryResult from '@latitude-data/query_result'
import { screen, text, box, listtable, type Widgets } from 'blessed'
import { CompileError } from '@latitude-data/sql-compiler'

const display: Widgets.Screen = screen({
  smartCSR: true, // Enable smart window resizing
  title: 'Results',
})

const header = text({
  top: 0,
  content: `Loading...`,
  tags: true,
  style: {
    fg: 'blue',
    bold: true,
  },
})

const footer = text({
  bottom: 0,
  content: '↑↓ ←→ to scroll, Esc / Ctrl+C / Q to exit',
  tags: true,
  style: {
    fg: 'blue',
    bold: true,
  },
})

const body = box({
  top: 1,
  bottom: 1,
  width: '100%',
  keys: true,
  mouse: true,
  border: {
    type: 'line',
  },
  style: {
    border: {
      fg: 'gray',
    },
    header: {
      fg: 'black',
      bg: 'blue',
    },
    cell: {
      fg: 'white',
      bg: 'black',
    },
  },
  align: 'center',
})
const bodyChildren: Widgets.BlessedElement[] = []

display.append(header)
display.append(body)
display.append(footer)

display.key(['escape', 'q', 'C-c'], () => process.exit(0))

export function render() {
  display.render()
}

function setBodyContent(content: Widgets.BlessedElement) {
  bodyChildren.forEach((child) => body.remove(child))
  bodyChildren.length = 0
  body.setContent('')

  bodyChildren.push(content)
  body.append(content)
}

function msToHuman(ms: number) {
  if (ms < 1000) return `${ms}ms`

  const secondsMod = (ms % 1000).toString().padStart(3, '0')
  const seconds = (ms / 1000 % 60).toFixed(0).padStart(2, '0')
  if (ms < 60 * 1000) return `${seconds}.${secondsMod}s`

  let minutes = (ms / 1000 / 60).toFixed(0).padStart(2, '0')
  if (ms < 60 * 60 * 1000) return `${minutes}:${seconds}.${secondsMod}`

  minutes = (ms / 1000 / 60 % 60).toFixed(0).padStart(2, '0')
  const hours = (ms / 1000 / 60 / 60).toFixed(0).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function displayResults(results: QueryResult, loadTime: number) {
  header.setContent(`Load time: ${msToHuman(loadTime)}, Rows: ${results.rowCount}`)
  const table: Widgets.ListTableElement = listtable({
    keys: true,
    mouse: true,
    border: {
      type: 'line',
    },
    style: {
      border: {
        fg: 'gray',
      },
      header: {
        fg: 'black',
        bg: 'blue',
      },
      cell: {
        fg: 'white',
        bg: 'black',
      },
    },
    align: 'center',
  });

  const tableData: string[][] = [
    results.fields.map((field) => field.name),
    ...results.rows.map((row) => row.map((cell) => String(cell))),
  ]

  let horizontalScrollOffset = 0
  function scrollTable(offset: number) {
    horizontalScrollOffset = Math.max(0, Math.min(horizontalScrollOffset + offset, tableData[0].length - 1))
    const vScroll = table.getScroll()
    table.setData(tableData.map((row) => row.slice(horizontalScrollOffset)))
    table.select(vScroll)
    render()
  }

  setBodyContent(table)

  table.key(['left', 'h'], () => scrollTable(-1))
  table.key(['right', 'l'], () => scrollTable(1))

  table.focus()
  scrollTable(0)
}

export function displayError(error: Error) {
  header.setContent('Error')
  let errorMsg = error.message
  if (error instanceof CompileError) {
    errorMsg = error.toString()
  }
  const errorBox = box({
    content: errorMsg,
    tags: true,
    style: {
      fg: 'red',
      bold: true,
    },
  })
  setBodyContent(errorBox)
  render()
}

export function exit() {
  display.destroy()
}