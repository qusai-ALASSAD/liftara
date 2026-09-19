import type { UnitSystem } from '@/types';

export const KG_PER_LB = 0.45359237;
export const kgToLb = (kg: number) => kg / KG_PER_LB;
export const lbToKg = (lb: number) => lb * KG_PER_LB;
export const cmToIn = (cm: number) => cm / 2.54;
export const inToCm = (i: number) => i * 2.54;

export const weightUnit = (u: UnitSystem) => (u === 'metric' ? 'kg' : 'lb');
export const lengthUnit = (u: UnitSystem) => (u === 'metric' ? 'cm' : 'in');

/** Anzeige-Wert: intern wird immer in kg gerechnet. */
export function displayWeight(kg: number, u: UnitSystem, digits = 1): number {
  const v = u === 'metric' ? kg : kgToLb(kg);
  return Math.round(v * 10 ** digits) / 10 ** digits;
}
export function toKg(value: number, u: UnitSystem): number {
  return u === 'metric' ? value : lbToKg(value);
}
export function displayLength(cm: number, u: UnitSystem): number {
  return Math.round((u === 'metric' ? cm : cmToIn(cm)) * 10) / 10;
}
export const round = (v: number, step: number) => Math.round(v / step) * step;
export const formatNumber = (v: number, digits = 0) =>
  new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(v);
