/**
 * Utility type to ignore specific properties from a base interface or type.
 * 
 * This type takes a base interface or type `T` and a set of keys `K` to omit from `T`.
 *
 * Note: Although the word "type" is used to refer to `T`, 
 * this applies to both type aliases and interfaces.
 *
 * @template T The base interface or type from which properties should be omitted.
 * @template K The keys of the properties to be omitted from `T`.
 *
 * @example
 * interface ICar { wheels: number; color: string; electric: boolean; }
 * 
 * type IGasCar = IgnoreProperties<ICar, 'electric'>
 * 
 * // Result of IGasCar: { wheels: number; color: string; }
 */
export type IgnoreProperties<T, K extends keyof T> = Omit<T, K>;
