import * as types from 'actions/anomoActions';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function tagsLoading(state, action) {
  return {
    ...state,
    isTagsLoading: action.isTagsLoading
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function intentsLoading(state, action) {
  return {
    ...state,
    isIntentsLoading: action.isIntentsLoading
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function tags(state, action) {
  return {
    ...state,
    tags: action.tags.slice(0)
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function intents(state, action) {
  return {
    ...state,
    intents: action.intents.slice(0)
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function anomoReducer(state = {}, action = {}) {
  switch (action.type) {
    case types.ANOMO_TAGS_LOADING:
      return tagsLoading(state, action);
    case types.ANOMO_INTENTS_LOADING:
      return intentsLoading(state, action);
    case types.ANOMO_TAGS:
      return tags(state, action);
    case types.ANOMO_INTENTS:
      return intents(state, action);
    default: return state;
  }
}
