/**
 * Randomizes the given array
 *
 * @param {Array} array
 * @returns {Array}
 */
export function arrayShuffle(array) {
  const newArray = array.slice(0);
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

export default {
  shuffle: arrayShuffle
};
