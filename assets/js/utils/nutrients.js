import { numbers } from 'utils';

/**
 * @param {{ unit:  number, amount: number, nutrients: * }} entry
 * @returns {number}
 */
export function getEntryCalories({ unit, amount, nutrients }) {
  if (!nutrients[unit]) {
    console.error('kcal not found in nutrients.');
    return 0;
  }
  return numbers.toPrecision(nutrients[unit].kcal * amount, 2);
}

export default {
  getEntryCalories
};
