/**
 * @param {*} meals
 * @param {*} entryId
 * @returns {null|{ entry: *, meal: * }}
 */
export function entriesFindById(meals, entryId) {
  for (let i = 0; i < meals.length; i++) {
    const { entries } = meals[i];
    for (let y = 0; y < entries.length; y++) {
      if (entries[y].id === entryId) {
        return {
          entry: entries[y],
          meal:  meals[i]
        };
      }
    }
  }

  return null;
}

export default {
  findById: entriesFindById
};
