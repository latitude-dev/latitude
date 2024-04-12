import QueryResult from '@latitude-data/query_result'
import { screen, text, box, listtable, type Widgets } from 'blessed'
import { CompileError } from '@latitude-data/sql-compiler'
import { type CompiledQuery } from '@latitude-data/base-connector'

export default class QueryDisplay {
  private static instance: QueryDisplay

  private display: Widgets.Screen
  private header: Widgets.TextElement
  private footer: Widgets.TextElement
  private body: Widgets.BoxElement
  private bodyChildren: Widgets.BlessedElement[]

  private constructor() {
    this.display = screen({
      smartCSR: true,
      title: 'Results',
    })

    this.header = text({
      top: 0,
      content: `Loading...`,
      tags: true,
      style: {
        fg: 'blue',
        bold: true,
      },
    })

    this.footer = text({
      bottom: 0,
      content: '↑↓ ←→ to scroll, Esc / Ctrl+C / Q to exit',
      tags: true,
      style: {
        fg: 'blue',
        bold: true,
      },
    })

    this.body = box({
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
    this.bodyChildren = []

    this.display.append(this.header)
    this.display.append(this.body)
    this.display.append(this.footer)

    this.display.key(['escape', 'q', 'C-c'], () => process.exit(0))
  }

  public render() {
    this.display.render()
  }

  public setBodyContent(content: Widgets.BlessedElement) {
    this.bodyChildren.forEach((child) => this.body.remove(child))
    this.bodyChildren.length = 0
    this.body.setContent('')

    this.bodyChildren.push(content)
    this.body.append(content)
  }

  static msToHuman(ms: number) {
    if (ms < 1000) return `${ms}ms`

    const secondsMod = (ms % 1000).toString().padStart(3, '0')
    const seconds = ((ms / 1000) % 60).toFixed(0).padStart(2, '0')
    if (ms < 60 * 1000) return `${seconds}.${secondsMod}s`

    let minutes = (ms / 1000 / 60).toFixed(0).padStart(2, '0')
    if (ms < 60 * 60 * 1000) return `${minutes}:${seconds}.${secondsMod}`

    minutes = ((ms / 1000 / 60) % 60).toFixed(0).padStart(2, '0')
    const hours = (ms / 1000 / 60 / 60).toFixed(0).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  public displayResults(results: QueryResult, loadTime: number) {
    this.header.setContent(
      `Load time: ${QueryDisplay.msToHuman(loadTime)}, Rows: ${
        results.rowCount
      }`,
    )
    const table: Widgets.ListTableElement = listtable({
      top: 0,
      bottom: 0,
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
      align: 'left',
    })

    const tableData: string[][] = [
      results.fields.map((field) => field.name),
      ...results.rows.map((row) => row.map((cell) => String(cell))),
    ]

    let horizontalScrollOffset = 0
    const scrollTable = (offset: number) => {
      horizontalScrollOffset = Math.max(
        0,
        Math.min(horizontalScrollOffset + offset, tableData[0].length - 1),
      )
      const vScroll = table.getScroll()
      table.setData(tableData.map((row) => row.slice(horizontalScrollOffset)))
      table.select(vScroll)
      this.render()
    }

    this.setBodyContent(table)

    table.key(['left', 'h'], () => scrollTable(-1))
    table.key(['right', 'l'], () => scrollTable(1))

    table.focus()
    scrollTable(0)
  }

  public displayCompiledQuery(compiledQuery: CompiledQuery) {
    this.header.setContent('Compiled Query and parameters')
    const queryContent = compiledQuery.sql
    const paramsContent = compiledQuery.params
      .map((param) => `${param.resolvedAs} = ${JSON.stringify(param.value)}`)
      .join('\n')

    const queryLines = queryContent.split('\n').length
    const paramsLines = paramsContent.split('\n').length

    const queryTitle = text({
      content: 'Query',
      tags: true,
      style: {
        fg: 'blue',
        bold: true,
      },
      top: 0,
      height: 1,
    })
    const queryBox = box({
      content: queryContent,
      tags: true,
      top: 1,
      height: 1 + queryLines,
      left: 1,
      right: 2,
    })
    const paramsTitle = text({
      content: 'Parameters',
      tags: true,
      style: {
        fg: 'blue',
        bold: true,
      },
      top: 1 + queryLines + 2,
      height: 1,
    })
    const paramsBox = box({
      content: paramsContent,
      tags: true,
      top: 1 + queryLines + 2 + 1,
      height: paramsLines + 2,
      left: 1,
      right: 2,
    })

    const scrollableContainer = box({
      scrollable: true,
      scrollbar: {
        ch: ' ',
        track: {
          bg: 'grey',
        },
        style: {
          inverse: true,
        },
      },
      tags: true,
      top: 0,
      bottom: 0,
      keys: true,
      mouse: true,
    })

    scrollableContainer.key(['up', 'k'], () => {
      scrollableContainer.scroll(-1)
    })
    scrollableContainer.key(['down', 'j'], () => {
      scrollableContainer.scroll(1)
    })

    scrollableContainer.append(queryBox)
    scrollableContainer.append(paramsBox)
    scrollableContainer.append(queryTitle)
    scrollableContainer.append(paramsTitle)

    this.setBodyContent(scrollableContainer)
    scrollableContainer.focus()
    this.render()
  }

  public displayError(error: Error) {
    this.header.setContent('Error')
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
    this.setBodyContent(errorBox)
    this.render()
  }

  public exit() {
    this.display.destroy()
  }

  public static getInstance(): QueryDisplay {
    if (!QueryDisplay.instance) {
      QueryDisplay.instance = new QueryDisplay()
    }
    return QueryDisplay.instance
  }

  public static render() {
    QueryDisplay.getInstance().render()
  }

  public static displayResults(results: QueryResult, loadTime: number) {
    QueryDisplay.getInstance().displayResults(results, loadTime)
  }

  public static displayCompiledQuery(compiledQuery: CompiledQuery) {
    QueryDisplay.getInstance().displayCompiledQuery(compiledQuery)
  }

  public static displayError(error: Error) {
    QueryDisplay.getInstance().displayError(error)
  }

  public static exit() {
    QueryDisplay.getInstance().exit()
  }
}
