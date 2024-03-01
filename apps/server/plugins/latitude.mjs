import { createFilter } from '@rollup/pluginutils'
import { parse, walk } from 'svelte/compiler'
import path from 'path'

const VIEWS_PATH = path.resolve(__dirname, '../src/routes')

/**
 * Plugin for transforming Svelte files by substituting runQuery calls with variable references.
 * It targets files under a specific directory, processing each to find and replace
 * 'runQuery' function calls with predetermined query results variables,
 * also injecting necessary declarations into the script tag of the Svelte files.
 *
 * @returns {Object} An object representing the plugin with a name, enforce option, and a transform method.
 */
export default function transformCodePlugin() {
  const filter = createFilter(
    [`${VIEWS_PATH}/**/*.svelte`],
    ['**/node_modules/**', '**/.git/**', '**/.svelte-kit/**', '**/.svelte/**']
  )

  return {
    name: 'latitude',
    enforce: 'pre',
    transform(code, id) {
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
 *
 * @param {string} code - The code of the Svelte file to transform.
 * @returns {string} The transformed code with 'runQuery' calls replaced by variable references and appended declarations.
 */
function transformRunQuery(code) {
  const ast = parse(code)
  const declarations = findRunQueries({ ast })
  const ncode = replaceRunQueries({ code, declarations })

  return ncode
}

/**
 * Walks through the abstract syntax tree (AST) of the provided code to find 'runQuery'
 * function calls within 'AwaitBlock' nodes. For each unique call, it collects necessary
 * information for replacing the call with a variable and for injecting a corresponding
 * declaration into the script section of the Svelte file.
 *
 * @param {Object} params - An object containing the AST and original code string.
 * @param {Object} params.ast - The abstract syntax tree of the code.
 * @returns {Array<Object>} An array of objects, each representing a 'runQuery' call to be transformed.
 * Each object contains the query, a generated variable name for the query, and the declaration string.
 */
function findRunQueries({ ast }) {
  if (!ast?.html) return []

  let encountered = {},
    queryCounter = 0,
    declarations = []

  walk(ast.html, {
    enter(node) {
      if (
        node.type === 'AwaitBlock' &&
        node.expression?.type === 'CallExpression' &&
        node.expression.callee?.name === 'runQuery'
      ) {
        const query = node.expression.arguments[0].value
        if (encountered[query]) return

        const queryVarName = `query_${++queryCounter}`
        encountered[query] = queryVarName

        // Transform the AwaitBlock expression to use the `$` prefix
        node.expression.name = queryVarName

        // Prepend `let` to addToScriptTag string
        const queryParams = node.expression.arguments
          .map((arg) => JSON.stringify(arg.value))
          .join(', ')

        const dev = {
          query,
          queryVarName,
          declaration: `let ${queryVarName} = runQuery(${queryParams});\n`,
        }

        declarations.push(dev)
      }
    },
  })

  return declarations
}

/**
 * Iterates over provided declarations of 'runQuery' calls, replacing each occurrence in the Svelte file code
 * with a generated variable reference. Additionally, injects variable declarations into the script tag of the
 * Svelte file, creating a new script tag if necessary.
 * 
 * @param {Object} params - An object containing the original code string and an array of declarations.
 * @param {string} params.code - The original code of the Svelte file.
 * @param {Array<Object>} params.declarations - An array of objects, each object represents a declaration to be appended.
 * Every declaration object consists of the original 'runQuery' call's query, its corresponding variable name, and
 * the variable declaration string.
 * @returns {string} The transformed code with all 'runQuery' occurrences replaced by their corresponding variable references,
 * and new declarations injected appropriately.
 */
function replaceRunQueries({ code, declarations }) {
  if (!declarations.length) return code

  let ncode = code
  declarations.forEach(({ query, queryVarName, declaration }) => {
    ncode = ncode.replace(
      new RegExp(`runQuery\\(('|")${query}('|")\\)`, 'g'),
      `$${queryVarName}`
    )

    // Append the declaration to just before the </script> tag if any (add one if there is none)
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
