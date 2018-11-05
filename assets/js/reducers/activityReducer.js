import * as types from 'actions/activityActions';
import objects from 'utils/objects';

/**
 * @param {string} str
 * @returns {string}
 */
function escapeString(str) {
  return str
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

/**
 * @param {string} message
 * @returns {string}
 */
function escapeUnicode(message) {
  return JSON.parse(`"${escapeString(message)}"`);
}

/**
 * @param {string|*} message
 * @returns {string}
 */
function filterMessage(message) {
  message = JSON.parse(message);
  if (message.message) {
    message.message = escapeUnicode(message.message);
  }

  return message;
}

/**
 * @param {*} activity
 * @returns {*}
 */
function sanitizeActivity(activity) {
  const a = objects.clone(activity);

  a.LikeIsLoading = false;
  if (a.Message) {
    a.Message = filterMessage(a.Message);
  }
  if (a.ListComment) {
    a.ListComment = a.ListComment.map((comment) => {
      comment.Content = escapeUnicode(comment.Content);
      return comment;
    });
  }

  return a;
}

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
function get(state, action) {
  const activities = action.activities.slice(0).map((a) => {
    return sanitizeActivity(a);
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
  const activity = sanitizeActivity(action.activity);

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
    case types.ACTIVITY_GET:
      return get(state, action);
    case types.ACTIVITY_SET:
      return set(state, action);
    case types.ACTIVITY_RESET:
      return reset(state);
    default: return state;
  }
}
