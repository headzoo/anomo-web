import * as types from 'actions/profileActions';
import { objects } from 'utils';
import anomo from 'anomo';
import { PROFILE_POSTS_FETCH, PROFILE_POSTS_RESET } from '../actions/profileActions';

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
function postsLoading(state, action) {
  return {
    ...state,
    isPostsLoading: action.isPostsLoading
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
function postsFetch(state, action) {
  const newActivities = action.activities.slice(0).map((a) => {
    return anomo.activities.sanitizeActivity(a);
  });

  let activities = [];
  if (action.refresh) {
    activities = newActivities;
  } else {
    activities = objects.clone(state.activities).concat(newActivities);
  }

  let lastActivityID = 0;
  const lastActivity = activities[activities.length - 1];
  if (lastActivity) {
    lastActivityID = lastActivity.ActivityID;
  }

  return {
    ...state,
    activities,
    lastActivityID
  };
}

/**
 * @param {*} state
 * @returns {*}
 */
function postsReset(state) {
  return {
    ...state,
    activities:     [],
    lastActivityID: 0
  };
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
    case types.PROFILE_POSTS_LOADING:
      return postsLoading(state, action);
    case types.PROFILE_FETCH:
      return fetch(state, action);
    case types.PROFILE_POSTS_FETCH:
      return postsFetch(state, action);
    case types.PROFILE_POSTS_RESET:
      return postsReset(state);
    default: return state;
  }
}
