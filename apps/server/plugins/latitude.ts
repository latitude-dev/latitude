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
    ['**/node_modules/**', '**/.git/**', '**/.svelte-kit/**', '**/.svelte/**'],
  )

  return {
    name: 'latitude',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!filter(id)) return

      let generatedCode = code
      generatedCode = extractReactiveFunction(generatedCode, 'runQuery')
      generatedCode = extractReactiveFunction(generatedCode, 'param')

      return {
        code: generatedCode,
      }
    },
  }
}

let varCount = 0
/**
 * Generates a unique name for a variable from a provided fnName.
 */
function generateVarName(fnName: string) {
  varCount++
  return `__${fnName}_${varCount}`
}

/**
 * Transforms Svelte file code by finding 'runQuery' function calls and replacing them with variables.
 * If 'runQuery' calls are found, it generates a variable for each unique call, replaces the call
 * with the variable, and adds a declaration for this variable at the end of the script tag or creates
 * a new script tag with the declaration if a script tag doesn't exist.
 */
function extractReactiveFunction(code: string, fnName: string) {
  const ast = parse(code)
  const declarations = findFunctionDeclarations({ ast, fnName })
  const ncode = replaceDeclarations({ code, declarations })

  return ncode
}

type FunctionInstance = {
  fnName: string
  fnParams: string
  varName: string
}

/**
 * Walks through the abstract syntax tree (AST) of the provided code to find 'runQuery'
 * function calls within 'AwaitBlock' nodes. For each unique call, it collects necessary
 * information for replacing the call with a variable and for injecting a corresponding
 * declaration into the script section of the Svelte file.
 */
// @ts-expect-error - TS does not pick up the AwaitBlock node type
function findFunctionDeclarations({ ast, fnName }) {
  if (!ast?.html) return []
  const declarations: FunctionInstance[] = []

  function traverse(node: TemplateNode) {
    if (
      node.expression?.type === 'CallExpression' &&
      node.expression.callee?.name === fnName
    ) {
      const fnParamsValues = node.expression.arguments.map(
        (arg: TemplateNode, index: number) => {
          if (index === 0) return arg.raw
          if (arg.type === 'ObjectExpression' && arg.properties) {
            return serializeObjectExpressionNode(arg)
          }
        },
      )
      const fnParams = fnParamsValues.filter(Boolean).join(', ')
      const instance = {
        fnName,
        fnParams,
        varName: generateVarName(fnName),
      }

      if (!declarations.some((d) => d.fnParams === instance.fnParams)) {
        declarations.push(instance)
      }
    }

    if (node.children) {
      node.children.forEach((child: TemplateNode) => {
        traverse(child)
      })
    }
  }

  traverse(ast.html)

  return declarations
}

/**
 * Iterates over provided declarations of 'runQuery' calls, replacing each occurrence in the Svelte file code
 * with a generated variable reference. Additionally, injects variable declarations into the script tag of the
 * Svelte file, creating a new script tag if necessary.
 */
function replaceDeclarations({
  code,
  declarations,
}: {
  code: string
  declarations: FunctionInstance[]
}) {
  if (!declarations.length) return code

  let ncode = code
  declarations.forEach(({ fnName, fnParams, varName }) => {
    while (ncode.includes(`${fnName}(${fnParams})`)) {
      ncode = ncode.replace(`${fnName}(${fnParams})`, `$${varName}`)
    }

    // Append the declaration to just before the </script> tag if any (add one if there is none)
    const declaration = `let ${varName} = ${fnName}(${fnParams})\n`
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
