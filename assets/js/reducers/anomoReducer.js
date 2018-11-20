import * as types from 'actions/anomoActions';
import { redux } from 'utils';

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

export default redux.createReducer({
  [types.ANOMO_TAGS]:            tags,
  [types.ANOMO_INTENTS]:         intents,
  [types.ANOMO_TAGS_LOADING]:    tagsLoading,
  [types.ANOMO_INTENTS_LOADING]: intentsLoading
});
