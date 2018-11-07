import * as types from 'actions/activityActions';
import objects from 'utils/objects';
import anomo from 'anomo';
import { ACTIVITY_LIKE_COMMENT_LOADING } from '../actions/activityActions';

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
function refreshing(state, action) {
  return {
    ...state,
    isRefreshing: action.isRefreshing
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

  const activities = objects.clone(state.activities);
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].RefID === action.refID) {
      activities[i].LikeIsLoading = action.isLoading;
      break;
    }
  }

  return {
    ...state,
    activities,
    activity
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function likeCommentLoading(state, action) {
  const activity = objects.clone(state.activity);

  for (let i = 0; i < activity.ListComment.length; i++) {
    if (activity.ListComment[i].ID === action.commentID) {
      activity.ListComment[i].LikeIsLoading = action.isLoading;
      break;
    }
  }

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
function newNumber(state, action) {
  return {
    ...state,
    newNumber: action.newNumber
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function fetch(state, action) {
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

  let firstActivityID = 0;
  const firstActivity = activities[0];
  if (firstActivity) {
    firstActivityID = firstActivity.ActivityID;
  }

  return {
    ...state,
    newNumber: 0,
    activities,
    lastActivityID,
    firstActivityID
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function set(state, action) {
  const activities = objects.clone(state.activities);
  const activity = anomo.activities.sanitizeActivity(action.activity);

  for (let i = 0; i < activities.length; i++) {
    if (activities[i].ActivityID === activity.ActivityID) {
      activities[i] = objects.clone(activity);
      break;
    }
  }

  return {
    ...state,
    activities,
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
    case types.ACTIVITY_REFRESHING:
      return refreshing(state, action);
    case types.ACTIVITY_LIKE_LOADING:
      return likeLoading(state, action);
    case types.ACTIVITY_LIKE_COMMENT_LOADING:
      return likeCommentLoading(state, action);
    case types.ACTIVITY_COMMENTS_LOADING:
      return commentsLoading(state, action);
    case types.ACTIVITY_COMMENT_SENDING:
      return commentSending(state, action);
    case types.ACTIVITY_NEW_NUMBER:
      return newNumber(state, action);
    case types.ACTIVITY_FETCH:
      return fetch(state, action);
    case types.ACTIVITY_SET:
      return set(state, action);
    case types.ACTIVITY_RESET:
      return reset(state);
    default: return state;
  }
}
