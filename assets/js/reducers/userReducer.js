import * as types from 'actions/userActions';
import * as defaultState from 'store/defaultState';
import { objects } from 'utils';
import { USER_FOLLOWERS, USER_FOLLOWING } from '../actions/userActions';

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
function statusSending(state, action) {
  return {
    ...state,
    isStatusSending: action.isStatusSending
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

  return {
    ...state,
    followers: newFollowers
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

  return {
    ...state,
    following: newFollowing
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
export default function userReducer(state = {}, action = {}) {
  switch (action.type) {
    case types.USER_ERROR:
      return error(state, action);
    case types.USER_SENDING:
      return sending(state, action);
    case types.USER_STATUS_SENDING:
      return statusSending(state, action);
    case types.USER_SETTINGS_SENDING:
      return settingsSending(state, action);
    case types.USER_LOGIN:
      return login(state, action);
    case types.USER_LOGOUT:
      return logout();
    case types.USER_SET:
      return set(state, action);
    case types.USER_FOLLOWERS:
      return followers(state, action);
    case types.USER_FOLLOWING:
      return following(state, action);
    case types.USER_BLOCKED:
      return blocked(state, action);
    default: return state;
  }
}
