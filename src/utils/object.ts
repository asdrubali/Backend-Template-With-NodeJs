/**
 * Filters an array of objects and returns an array of unique objects based on the given property.
 * @template T
 * @param {T[]} arr - Array of objects to filter.
 * @param {keyof T} prop - Property of the objects to use for uniqueness.
 * @param {Set<any>} [track = new Set()] - Set to track unique properties. It is initialized as an empty set.
 * @returns {T[]} - Array of objects where each object has a unique property.
 */
function uniqueArrayObjectsUsingProp<T>(
  arr: T[],
  prop: keyof T,
  track: Set<any> = new Set()
): T[] {
  return arr.filter((obj) =>
    !track.has(obj[prop]) ? track.add(obj[prop]) : false
  );
}

/**
 * Creates a new object by selecting specific properties from the provided object.
 *
 * @template T - The type of the source object.
 * @template K - The type of the keys to select from the source object.
 * 
 * @param {T} obj - The source object from which the properties will be selected.
 * @param {...K[]} keys - An array of keys indicating which properties to select from the source object.
 * 
 * @returns {Pick<T, K>} A new object containing only the selected properties.
 * 
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * const selected = pick(obj, 'a', 'c'); // { a: 1, c: 3 }
 */
function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce((o, k) => {
    if (obj?.hasOwnProperty(k)) {
      (o as any)[k] = obj[k];
    }
    return o;
  }, {} as Pick<T, K>);
}

/**
 * Flattens a multidimensional object.
 *
 * @example
 *   flattenObject({ a: 1, b: { c: 2 } })
 * Returns:
 *   { a: 1, c: 2 }
 * 
 * @param obj - An object that may have nested properties.
 * @returns A flattened object with the properties.
 */
const flattenObject = (obj: Record<string, any>): Record<string, any> => {
  const flattened: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value));
    } else {
      flattened[key] = value;
    }
  });

  return flattened;
}

/**
 * Excludes elements from an array.
 * 
 * @param originalArray - The original array.
 * @param elementsToExclude - Set of elements to exclude.
 * @returns A new array with the excluded elements removed.
 */
function excludeElementsFromArray<T>(originalArray: T[], elementsToExclude: Set<T>): T[] {
  return originalArray.filter(element => !elementsToExclude.has(element));
}

/**
 * Creates a dummy object with a proxy to return undefined for missing properties.
 * 
 * @returns A new dummy object with dynamic property access.
 */
function createDummyObject<T extends Record<string, any>>(): T {
  const baseObject: Record<string, any> = {};
  return new Proxy(baseObject, {
    get: (target, prop: string) => {
      return target[prop] || undefined;
    }
  }) as T;
}

/**
 * Checks if a string is valid (non-null, non-undefined, and non-empty).
 * 
 * @param str - The string to check.
 * @returns A boolean indicating whether the string is valid.
 */
function isValidString(str: string | null | undefined): boolean {
  return str !== null && str !== undefined && str.trim() !== "";
}

export { uniqueArrayObjectsUsingProp, pick, excludeElementsFromArray, createDummyObject, flattenObject, isValidString };
