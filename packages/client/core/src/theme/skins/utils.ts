/**
 * Recursively merges the partial object with the default object.
 * The default object is used as a fallback for missing attributes in the partial object.
 */
export function defaultsDeep<T extends Record<string, unknown>>(
  partialObject: Partial<T>,
  defaultObject: T,
): T {
  return Object.keys({ ...partialObject, ...defaultObject }).reduce(
    (acc, key) => {
      const defaultValue = defaultObject[key]
      const partialValue = partialObject[key]

      // Get the value from the partial object if exists, otherwise use the default value
      let value = partialValue ?? defaultValue

      // If the default value is an object, we need to merge it recursively instead
      const isObject =
        typeof defaultValue === 'object' && !Array.isArray(defaultValue)
      if (isObject) {
        value = defaultsDeep(
          partialObject[key] || {},
          defaultObject[key] as Record<string, unknown>,
        )
      }

      return { ...acc, [key]: value }
    },
    {} as T,
  )
}

/**
 * Removes undefined values from the object.
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === undefined) return acc
    return { ...acc, [key]: value }
  }, {} as T)
}
