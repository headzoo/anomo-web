import * as types from 'actions/userActions';
import * as defaultState from 'store/defaultState';
import { objects, redux } from 'utils';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function error(state, action) {
  return {
    ...state,
    errorMessage: action.errorMessage
  };
}

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
function settingsSending(state, action) {
  return {
    ...state,
    isSettingSending: action.isSettingSending
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function searchSending(state, action) {
  return {
    ...state,
    isSearchSending: action.isSearchSending
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function set(state, action) {
  return objects.merge(state, action.user);
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function login(state, action) {
  return objects.merge(state, action.user, {
    isAuthenticated: true
  });
}

/**
 * @returns {*}
 */
function logout() {
  return objects.clone(defaultState.defaultUser);
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function followers(state, action) {
  let newFollowers = [];
  if (action.page === 1) {
    newFollowers = action.followers.slice(0);
  } else {
    newFollowers = state.followers.slice(0).concat(action.followers.slice(0));
  }

  const followerUserNames = newFollowers.map(u => u.UserName);

  return {
    ...state,
    followers: newFollowers,
    followerUserNames
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function following(state, action) {
  let newFollowing = [];
  if (action.page === 1) {
    newFollowing = action.following.slice(0);
  } else {
    newFollowing = state.following.slice(0).concat(action.following.slice(0));
  }

  const followingUserNames = newFollowing.map(u => u.UserName);

  return {
    ...state,
    following: newFollowing,
    followingUserNames
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function blocked(state, action) {
  return {
    ...state,
    blocked: action.blocked.slice(0)
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function searchResults(state, action) {
  return {
    ...state,
    searchResults: action.searchResults.slice(0)
  };
}

export default redux.createReducer({
  [types.USER_ERROR]:            error,
  [types.USER_LOGIN]:            login,
  [types.USER_LOGOUT]:           logout,
  [types.USER_SET]:              set,
  [types.USER_FOLLOWERS]:        followers,
  [types.USER_FOLLOWING]:        following,
  [types.USER_BLOCKED]:          blocked,
  [types.USER_SENDING]:          sending,
  [types.USER_SETTINGS_SENDING]: settingsSending,
  [types.USER_SEARCH_SENDING]:   searchSending,
  [types.USER_SEARCH_RESULTS]:   searchResults
});
