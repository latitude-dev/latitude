import { createFilter } from '@rollup/pluginutils'
import { parse } from 'svelte/compiler'
import path from 'path'
import type { Ast, TemplateNode } from 'svelte/types/compiler/interfaces'
import * as cheerio from 'cheerio'

export const VIEWS_PATH = path.resolve(__dirname, '../../src/routes')
let varCount = 0

/**
 * Generates a unique name for a variable from a provided fnName.
 */
function generateVarName(fnName: string) {
  varCount++
  return `__${fnName}_${varCount}`
}

type FunctionInstance = {
  expression: string
  startIndex: number
  endIndex: number
  varName: string
}

/**
 * Walks through the abstract syntax tree (AST) of the provided code to find the fnName
 * function calls. For each unique call, it collects necessary information for replacing
 * the call with a variable and for injecting a corresponding declaration into the script
 * section of the Svelte file.
 */
function findFunctionDeclarations({
  code,
  ast,
  fnName,
}: {
  code: string
  ast: Ast
  fnName: string
}) {
  if (!ast?.html) return []
  const declarations: FunctionInstance[] = []

  function traverse(node: TemplateNode) {
    if (
      node.expression?.type === 'CallExpression' &&
      node.expression.callee?.name === fnName
    ) {
      const start = node.expression.start
      const end = node.expression.end

      const fullExpression = code.slice(start, end)

      const instance = {
        expression: fullExpression,
        startIndex: start,
        endIndex: end,
        varName: generateVarName(fnName),
      }

      declarations.push(instance)
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
 * Finds the position of the script tag in the provided HTML code. If there is no script tag, it creates one
 * at the end of the file. The main <script> tag must not be inside the <svelte:head> tag, nor be of type="module".
 * Returns the updated HTML code, if a script tag was created, and the position in the code where code can be injected.
 */
function findOrCreateScriptTag(html: string): [string, number] {
  const $ = cheerio.load(html, {
    xmlMode: true,
    withStartIndices: true,
    withEndIndices: true,
  })

  // Find all script tags
  const scripts = $('script')
    .filter((_, el) => $(el).attr('type') !== 'module') // that are not of type="module"
    .filter((_, el) => $(el).parents('svelte\\:head').length === 0) // that are not inside a <svelte:head> tag

  if (scripts.length) {
    const lastScript = scripts.last()
    const startIndex = lastScript.get(0)!.startIndex
    const position = html.indexOf('</script>', startIndex!)
    return [html, position]
  }

  // If no script tag was found, create one at the end of the file
  const scriptTag = '\n<script></script>'
  const position = html.length + '\n<script>'.length
  return [html + scriptTag, position]
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

  // Find the main <script> tag. If there is none, add one at the end of the file.
  let [ncode, scriptPos] = findOrCreateScriptTag(code)

  const replaceCode = (
    replacement: string,
    startIndex: number,
    endIndex?: number,
  ) => {
    const diff = replacement.length - ((endIndex ?? startIndex) - startIndex)
    ncode =
      ncode.slice(0, startIndex) +
      replacement +
      ncode.slice(endIndex ?? startIndex)

    // Fix positions of all declarations after the replaced code
    declarations.forEach((declaration) => {
      if (declaration.startIndex > startIndex) {
        declaration.startIndex += diff
      }
      if (declaration.endIndex > startIndex) {
        declaration.endIndex += diff
      }
    })

    if (scriptPos > startIndex) {
      scriptPos += diff
    }
  }

  declarations.forEach(({ expression, startIndex, endIndex, varName }) => {
    replaceCode(`$${varName}`, startIndex, endIndex)
    replaceCode(`\nconst ${varName} = ${expression}\n`, scriptPos)
  })

  return ncode
}

/**
 * Transforms Svelte file code by finding 'runQuery' function calls and replacing them with variables.
 * If 'runQuery' calls are found, it generates a variable for each unique call, replaces the call
 * with the variable, and adds a declaration for this variable at the end of the script tag or creates
 * a new script tag with the declaration if a script tag doesn't exist.
 */
function extractReactiveFunction(code: string, fnName: string) {
  const ast = parse(code)
  const declarations = findFunctionDeclarations({ code, ast, fnName })
  const ncode = replaceDeclarations({ code, declarations })

  return ncode
}

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
