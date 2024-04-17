import { describe, it, expect } from 'vitest'
import transformCodePlugin, { VIEWS_PATH } from '.'

const SCRIPT_TAG_REGEX = /<script[\s\S]*?>([\s\S]*?)<\/script>/g

describe('Latitude plugin', () => {
  const plugin = transformCodePlugin()
  const fn = plugin.transform

  it('Only transforms Svelte files from VIEWS_PATH', () => {
    const code = 'console.log("Hello")'

    expect(fn(code, 'file.ts')).toBeUndefined()
    expect(fn(code, 'file.svelte')).toBeUndefined()
    expect(fn(code, `${VIEWS_PATH}/file.ts`)).toBeUndefined()
    expect(fn(code, `${VIEWS_PATH}/file.svelte`)).toBeDefined()
  })

  it('When a reactive function is not found, it returns the same code', () => {
    const code1 = '<div></div>'
    const result1 = fn(code1, `${VIEWS_PATH}/file.svelte`)!
    expect(result1.code).toBe(code1)

    const code2 = '<div></div><script>console.log("Hello")</script>'
    const result2 = fn(code2, `${VIEWS_PATH}/file.svelte`)!
    expect(result2.code).toBe(code2)
  })

  describe('When a reactive function is found', () => {
    it('replaces the function call with a variable', () => {
      const code = '<div>{param("param_name")}</div>'
      const result = fn(code, `${VIEWS_PATH}/file.svelte`)!
      const varRegex = /__param_\d+/

      expect(result.code).not.toBe(code)
      expect(result.code).toMatch(varRegex)
    })

    it('creates a main script tag with the declaration if it does not exist', () => {
      const code = '<div>{param("param_name")}</div>'
      const result = fn(code, `${VIEWS_PATH}/file.svelte`)!
      const scriptTag = result.code.match(SCRIPT_TAG_REGEX)

      expect(scriptTag).not.toBeNull()
    })

    it('does not create a new main script tag if one already exists', () => {
      const code = `
        <script>
          console.log("Hello")
        </script>
        <div>{param("param_name")}</div>
      `
      const result = fn(code, `${VIEWS_PATH}/file.svelte`)!
      const scriptTags = result.code.match(SCRIPT_TAG_REGEX)

      expect(scriptTags).toHaveLength(1)
    })

    it('creates a main script tag even if there are other script tags inside a <svelte:head>', () => {
      const code = `
        <svelte:head>
          <script>console.log("Hello")</script>
        </svelte:head>
        <div>{param("param_name")}</div>
      `
      const result = fn(code, `${VIEWS_PATH}/file.svelte`)!
      const scriptTag = result.code.match(SCRIPT_TAG_REGEX)

      expect(scriptTag?.length).toBe(2)
    })

    it('creates a main script tag even if there is another script tag with type="module"', () => {
      const code = `
        <script type="module">
          console.log("Hello")
        </script>
        <div>{param("param_name")}</div>
      `
      const result = fn(code, `${VIEWS_PATH}/file.svelte`)!
      const scriptTag = result.code.match(SCRIPT_TAG_REGEX)

      expect(scriptTag).toHaveLength(2)
    })

    it('correctly replaces each reactive function call with a different variable when there is no main script', () => {
      const functions = [
        'param("param_name")',
        'param("another_param", "some_other_param")',
        `runQuery("query_name", "another_param", {
          multiple_params: "value"
        })`,
      ]
      const code = functions.map((fn) => `<div>{${fn}}</div>`).join('\n')

      const result = fn(code, `${VIEWS_PATH}/file.svelte`)!
      expect(result.code).not.toBe(code)

      const scriptTags = result.code.match(SCRIPT_TAG_REGEX)
      expect(scriptTags).toHaveLength(1)

      const scriptTag = scriptTags![0]
      functions.forEach((fn) => expect(scriptTag).toContain(fn))

      // Expressions have been replaced with the variable.
      // This ensures the position is valid because it must respect the start and end '{}' characters.
      const varRegex = /{\$__\w+_\d+}/g
      expect(result.code.match(varRegex)).toHaveLength(3)
    })

    it('correctly replaces the reactive function call with the variable in the main script tag without removing other code', () => {
      const functions = [
        'param("param_name")',
        'param("another_param", "some_other_param")',
        `runQuery("query_name", "another_param", {
          multiple_params: "value"
        })`,
      ]
      const code = `
        <script>
          console.log("Hello")
        </script>
        ${functions.map((fn) => `<div>{${fn}}</div>`).join('\n')}
      `
      const result = fn(code, `${VIEWS_PATH}/file.svelte`)!
      expect(result.code).not.toBe(code)

      const scriptTags = result.code.match(SCRIPT_TAG_REGEX)
      expect(scriptTags).toHaveLength(1)

      const scriptTag = scriptTags![0]
      expect(scriptTag).toContain('console.log("Hello")') // Original code is still there
      functions.forEach((fn) => expect(scriptTag).toContain(fn))

      // Expressions have been replaced with the variable.
      // This ensures the position is valid because it must respect the start and end '{}' characters.
      const varRegex = /{\$__\w+_\d+}/g
      expect(result.code).toMatch(varRegex)
    })
  })
})
