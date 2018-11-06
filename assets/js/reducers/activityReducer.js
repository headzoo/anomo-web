import * as types from 'actions/activityActions';
import objects from 'utils/objects';
import anomo from 'anomo';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function loading(state, action) {
  return {
    ...state,
    isLoading: action.isLoading
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function likeLoading(state, action) {
  const activity = objects.merge(state.activity, {
    LikeIsLoading: action.isLoading
  });

  return {
    ...state,
    activity
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function commentsLoading(state, action) {
  return {
    ...state,
    isCommentsLoading: action.isCommentsLoading
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function commentSending(state, action) {
  return {
    ...state,
    isCommentSending: action.isCommentSending
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function get(state, action) {
  const activities = action.activities.slice(0).map((a) => {
    return anomo.activities.sanitizeActivity(a);
  });

  return {
    ...state,
    activities,
    page:       action.page,
    totalPages: action.totalPages,
    radius:     action.radius
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function set(state, action) {
  const activity = anomo.activities.sanitizeActivity(action.activity);

  return {
    ...state,
    activity
  };
}

/**
 * @param {*} state
 * @returns {*}
 */
function reset(state) {
  return {
    ...state,
    activity: {}
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function activityReducer(state = {}, action = {}) {
  switch (action.type) {
    case types.ACTIVITY_LOADING:
      return loading(state, action);
    case types.ACTIVITY_LIKE_LOADING:
      return likeLoading(state, action);
    case types.ACTIVITY_COMMENTS_LOADING:
      return commentsLoading(state, action);
    case types.ACTIVITY_COMMENT_SENDING:
      return commentSending(state, action);
    case types.ACTIVITY_GET:
      return get(state, action);
    case types.ACTIVITY_SET:
      return set(state, action);
    case types.ACTIVITY_RESET:
      return reset(state);
    default: return state;
  }
}
