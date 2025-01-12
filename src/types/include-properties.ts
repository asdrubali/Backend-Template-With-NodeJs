/**
 * Utility type to include only specific properties from a base interface or type.
 * 
 * This type takes a base interface or type `T` and a set of keys `K` to include from `T`.
 *
 * Note: Although the word "type" is used to refer to `T`, 
 * this applies to both type aliases and interfaces.
 *
 * @template T The base interface or type from which properties should be included.
 * @template K The keys of the properties to be included from `T`.
 *
 * @example
 * interface ICar { wheels: number; color: string; electric: boolean; }
 * 
 * type IGasCar = IncludeProperties<ICar, 'wheels' | 'color'>
 * 
 * // Result of IGasCar: { wheels: number; color: string; }
 */
export type IncludeProperties<T, K extends keyof T> = Pick<T, K>;
