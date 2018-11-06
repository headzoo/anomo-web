import * as types from 'actions/profileActions';
import { objects } from 'utils';
import anomo from 'anomo';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function sending(state, action) {
  return {
    ...state,
    isSending: action.isSending
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function fetch(state, action) {
  const profile = objects.merge(state, action.profile);
  profile.AboutMe = anomo.activities.unescapeUnicode(profile.AboutMe);

  return profile;
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function profileReducer(state = {}, action = {}) {
  switch (action.type) {
    case types.PROFILE_SENDING:
      return sending(state, action);
    case types.PROFILE_FETCH:
      return fetch(state, action);
    default: return state;
  }
}
