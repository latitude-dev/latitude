import { createFilter } from '@rollup/pluginutils'
import { parse } from 'svelte/compiler'
import path from 'path'
import { TemplateNode } from 'svelte/types/compiler/interfaces'

const VIEWS_PATH = path.resolve(__dirname, '../src/routes')

/**
 * Plugin for transforming Svelte files by substituting runQuery calls with variable references.
 * It targets files under a specific directory, processing each to find and replace
 * 'runQuery' function calls with predetermined query results variables,
 * also injecting necessary declarations into the script tag of the Svelte files.
 */
export default function transformCodePlugin() {
  const filter = createFilter(
    [`${VIEWS_PATH}/**/*.svelte`],
    ['**/node_modules/**', '**/.git/**', '**/.svelte-kit/**', '**/.svelte/**']
  )

  return {
    name: 'latitude',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!filter(id)) return

      const generatedCode = transformRunQuery(code)

      return {
        code: generatedCode,
      }
    },
  }
}

/**
 * Transforms Svelte file code by finding 'runQuery' function calls and replacing them with variables.
 * If 'runQuery' calls are found, it generates a variable for each unique call, replaces the call
 * with the variable, and adds a declaration for this variable at the end of the script tag or creates
 * a new script tag with the declaration if a script tag doesn't exist.
 */
function transformRunQuery(code: string) {
  const ast = parse(code)
  const declarations = findRunQueries({ ast })
  const ncode = replaceRunQueries({ code, declarations })

  return ncode
}

type RunQueryInstance = {
  queryVarName: string
  queryParams: string
}

/**
 * Walks through the abstract syntax tree (AST) of the provided code to find 'runQuery'
 * function calls within 'AwaitBlock' nodes. For each unique call, it collects necessary
 * information for replacing the call with a variable and for injecting a corresponding
 * declaration into the script section of the Svelte file.
 */
// @ts-expect-error - TS does not pick up the AwaitBlock node type
function findRunQueries({ ast }) {
  if (!ast?.html) return []

  let queryCounter = 0
  const declarations: RunQueryInstance[] = []

  ast.html.children
    .filter(
      (node: TemplateNode) =>
        node.type === 'AwaitBlock' &&
        node.expression?.type === 'CallExpression' &&
        node.expression.callee?.name === 'runQuery'
    )
    .forEach((node: TemplateNode) => {
      const queryParamsValues = node.expression.arguments.map(
        (arg: TemplateNode, index: number) => {
          if (index === 0) return arg.raw
          if (arg.type === 'ObjectExpression' && arg.properties) {
            return serializeObjectExpressionNode(arg)
          }
        }
      )
      const queryParams = queryParamsValues.filter(Boolean).join(', ')
      const instance = {
        queryVarName: `query_${++queryCounter}`,
        queryParams,
      }

      if (!declarations.some((d) => d.queryParams === instance.queryParams)) {
        declarations.push(instance)
      }
    })

  return declarations
}

/**
 * Iterates over provided declarations of 'runQuery' calls, replacing each occurrence in the Svelte file code
 * with a generated variable reference. Additionally, injects variable declarations into the script tag of the
 * Svelte file, creating a new script tag if necessary.
 */
function replaceRunQueries({
  code,
  declarations,
}: {
  code: string
  declarations: RunQueryInstance[]
}) {
  if (!declarations.length) return code

  let ncode = code
  declarations.forEach(({ queryParams, queryVarName }) => {
    while (ncode.includes(`runQuery(${queryParams})`)) {
      ncode = ncode.replace(`runQuery(${queryParams})`, `$${queryVarName}`)
    }

    // Append the declaration to just before the </script> tag if any (add one if there is none)
    const declaration = `let ${queryVarName} = runQuery(${queryParams})\n`
    const scriptTagIndex = ncode.lastIndexOf('</script>')
    if (scriptTagIndex === -1) {
      ncode += `\n<script>\n${declaration}\n</script>`
    } else {
      ncode =
        ncode.slice(0, scriptTagIndex) +
        declaration +
        ncode.slice(scriptTagIndex)
    }
  })

  return ncode
}

function serializeObjectExpressionNode(node: TemplateNode): string {
  if (!node.properties) return '{}'

  const properties = node.properties
    .map((prop: { key: TemplateNode; value: TemplateNode }) => {
      const key = prop.key.name
      const valueNode = prop.value

      if (valueNode.type === 'Identifier') {
        return `${key}: ${valueNode.raw}`
      } else if (valueNode.type === 'Literal') {
        return `${key}: ${valueNode.value}`
      } else if (valueNode.type === 'ObjectExpression') {
        return `${key}: ${serializeObjectExpressionNode(valueNode)}`
      } else if (valueNode.type === 'CallExpression') {
        return `${key}: ${serializeCallExpressionNode(valueNode)}`
      }
    })
    .filter(Boolean)
    .join(', ')

  return `{ ${properties} }`
}

function serializeCallExpressionNode(node: TemplateNode): string {
  const args = node.arguments
    .map((arg: TemplateNode) => {
      if (arg.type === 'Identifier' || arg.type === 'Literal') {
        return arg.raw
      } else if (arg.type === 'ObjectExpression') {
        return serializeObjectExpressionNode(arg)
      }
    })
    .join(', ')

  return `${node.callee.name}(${args})`
}
