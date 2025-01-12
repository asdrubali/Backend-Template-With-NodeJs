/**
 * Utility type to overwrite properties of a base interface or type.
 *
 * This type takes a base interface or type `T` and an overwrite type `U`.
 * The resulting type will have properties from `T` unless they are
 * specifically overwritten by properties in `U`.
 *
 * Note: Although the word "type" is used to refer to `T` and `U`,
 * this applies to both type aliases and interfaces.
 *
 * @template T The base interface or type to be overwritten.
 * @template U The type that contains properties to overwrite those in `T`.
 *
 * @example
 * interface ICar { wheels: number; color: string; electric: boolean; }
 *
 * export interface IElectricCar extends OverrideProperties<
 *   ICar,
 *   {
 *     electric: true;
 *     batteryLife: number;
 *   }
 * > {}
 *
 * // Result of IElectricCar: { wheels: number; color: string; electric: true; batteryLife: number; }
 */
export type OverrideProperties<T, U extends Partial<Record<keyof T, any>>> = U & 
  Omit<T, keyof U>;

