/**
 * @param {*} state
 * @param {*} action
 * @param {*} reducers
 * @returns {*}
 */
function reduce(state = {}, action, reducers) {
  const reducer = reducers[action.type];
  if (reducer !== undefined) {
    return reducer(state, action);
  }
  return state;
}

/**
 * @param {*} reducers
 * @returns {function(*=, *=)}
 */
function createReducer(reducers) {
  return (state = {}, action) => {
    return reduce(state, action, reducers);
  };
}

export default {
  reduce,
  createReducer
};
