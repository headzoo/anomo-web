import * as types from 'actions/activityActions';
import { objects, feeds as feedUtils } from 'utils';
import anomo from 'anomo';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function feedLoading(state, action) {
  const feeds = objects.clone(state.feeds);
  const feed  = feeds[action.feedType];

  feed.isLoading = action.isLoading;

  return {
    ...state,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function feedRefreshing(state, action) {
  const feeds = objects.clone(state.feeds);
  const feed  = feeds[action.feedType];

  feed.isRefreshing = action.isRefreshing;

  return {
    ...state,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function likeLoading(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  if (activity && activity.RefID === action.refID) {
    activity.LikeIsLoading = action.isLoading;
  }
  feedUtils.traverseForRefID(feeds, action.refID, (a) => {
    a.LikeIsLoading = action.isLoading;
  });

  return {
    ...state,
    activity,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function likeCommentLoading(state, action) {
  const activity = objects.clone(state.activity);

  if (activity.ListComment) {
    for (let i = 0; i < activity.ListComment.length; i++) {
      if (activity.ListComment[i].ID === action.commentID) {
        activity.ListComment[i].LikeIsLoading = action.isLoading;
        break;
      }
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
function pollSending(state, action) {
  return {
    ...state,
    isPollSending: action.isPollSending
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function commentPrepend(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  if (!activity.ListComment) {
    activity.ListComment = [];
  }
  activity.ListComment.unshift(action.comment);
  activity.Comment = parseInt(activity.Comment || 0, 10) + 1;

  feedUtils.traverseForActivityID(feeds, activity.ActivityID, (a) => {
    a.Comment = activity.Comment;
  });

  return {
    ...state,
    activity,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function like(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  if (activity.RefID === action.refID) {
    if (!activity.IsLike || activity.IsLike === '0') {
      activity.IsLike = '1';
      activity.Like   = parseInt(activity.Like || 0, 10) + 1;
    } else {
      activity.IsLike = '0';
      activity.Like   = parseInt(activity.Like || 0, 10) - 1;
    }
  }
  feedUtils.traverseForRefID(feeds, action.refID, (a) => {
    if (!a.IsLike || a.IsLike === '0') {
      a.IsLike = '1';
      a.Like   = parseInt(a.Like || 0, 10) + 1;
    } else {
      a.IsLike = '0';
      a.Like   = parseInt(a.Like || 0, 10) - 1;
    }
  });

  return {
    ...state,
    activity,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function likeComment(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  if (activity.RefID === action.refID) {
    if (!activity.ListComment) {
      return;
    }

    for (let i = 0; i < activity.ListComment.length; i++) {
      const comment = activity.ListComment[i];
      if (comment.ID === action.commentID) {
        if (!comment.IsLike || comment.IsLike === '0') {
          comment.IsLike = '1';
          comment.Like   = parseInt(comment.Like || 0, 10) + 1;
        } else {
          comment.IsLike = '0';
          comment.Like   = parseInt(comment.Like || 0, 10) - 1;
        }
      }
    }
  }

  feedUtils.traverseForRefID(feeds, action.refID, (a) => {
    if (!a.ListComment) {
      return;
    }

    for (let i = 0; i < a.ListComment.length; i++) {
      const comment = a.ListComment[i];
      if (comment.ID === action.commentID) {
        if (!comment.IsLike || comment.IsLike === '0') {
          comment.IsLike = '1';
          comment.Like   = parseInt(comment.Like || 0, 10) + 1;
        } else {
          comment.IsLike = '0';
          comment.Like   = parseInt(comment.Like || 0, 10) - 1;
        }
      }
    }
  });

  return {
    ...state,
    activity,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function activityLoading(state, action) {
  return {
    ...state,
    isActivityLoading: action.isActivityLoading
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function feedNewNumber(state, action) {
  const feeds = objects.clone(state.feeds);
  const feed  = feeds[action.feedType];

  feed.newNumber = action.newNumber;

  return {
    ...state,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function feedFetch(state, action) {
  const feeds = objects.clone(state.feeds);
  const feed  = feeds[action.feedType];

  const newActivities = action.activities.slice(0).map((a) => {
    return anomo.activities.sanitizeActivity(a);
  });

  if (action.refresh) {
    feed.activities = newActivities;
  } else {
    feed.activities = objects.clone(feed.activities).concat(newActivities);
  }

  const lastActivity = feed.activities[feed.activities.length - 1];
  if (lastActivity) {
    feed.lastActivityID = lastActivity.ActivityID;
  }

  const firstActivity = feed.activities[0];
  if (firstActivity) {
    feed.firstActivityID = firstActivity.ActivityID;
  }

  feed.newNumber = 0;

  return {
    ...state,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function feedUpdate(state, action) {
  const feeds = objects.clone(state.feeds);

  for (let i = 0; i < action.activities.length; i++) {
    const activity = action.activities[i];
    feedUtils.traverseForActivityID(feeds, activity.ActivityID, (a) => {
      a.Like       = activity.Like || '0';
      a.Comment    = activity.Comment || '0';
      a.IsFavorite = activity.IsFavorite || '0';
    });
  }

  return {
    ...state,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function set(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = anomo.activities.sanitizeActivity(action.activity);

  feedUtils.traverseForActivityID(feeds, activity.ActivityID, () => {
    return objects.clone(activity);
  });
/*  objects.forEach(feeds, (feed) => {
    for (let i = 0; i < feed.activities.length; i++) {
      if (feed.activities[i].ActivityID === activity.ActivityID) {
        feed.activities[i] = objects.clone(activity);
        break;
      }
    }
  });*/

  return {
    ...state,
    activity,
    feeds
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
function deleteActivity(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  if (activity && activity.ActivityID === action.activityID) {
    activity.IsDeleted = true;
  }
  feedUtils.traverseForActivityID(feeds, action.activityID, (a) => {
    a.IsDeleted = true;
  });

  return {
    ...state,
    activity,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function deleteIsSending(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  if (activity && activity.ActivityID === action.activityID) {
    activity.DeleteIsSending = action.isSending;
  }
  feedUtils.traverseForActivityID(feeds, action.activityID, (a) => {
    a.DeleteIsSending = action.isSending;
  });

  return {
    ...state,
    activity,
    feeds
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function activityReducer(state = {}, action = {}) {
  switch (action.type) {
    case types.ACTIVITY_RESET:
      return reset(state);
    case types.ACTIVITY_SET:
      return set(state, action);
    case types.ACTIVITY_FEED_LOADING:
      return feedLoading(state, action);
    case types.ACTIVITY_FEED_REFRESHING:
      return feedRefreshing(state, action);
    case types.ACTIVITY_FEED_UPDATE:
      return feedUpdate(state, action);
    case types.ACTIVITY_LIKE:
      return like(state, action);
    case types.ACTIVITY_LIKE_COMMENT:
      return likeComment(state, action);
    case types.ACTIVITY_LIKE_LOADING:
      return likeLoading(state, action);
    case types.ACTIVITY_LIKE_COMMENT_LOADING:
      return likeCommentLoading(state, action);
    case types.ACTIVITY_COMMENTS_LOADING:
      return commentsLoading(state, action);
    case types.ACTIVITY_COMMENT_SENDING:
      return commentSending(state, action);
    case types.ACTIVITY_COMMENT_PREPEND:
      return commentPrepend(state, action);
    case types.ACTIVITY_POLL_SENDING:
      return pollSending(state, action);
    case types.ACTIVITY_ACTIVITY_LOADING:
      return activityLoading(state, action);
    case types.ACTIVITY_FEED_NEW_NUMBER:
      return feedNewNumber(state, action);
    case types.ACTIVITY_FEED_FETCH:
      return feedFetch(state, action);
    case types.ACTIVITY_DELETE:
      return deleteActivity(state, action);
    case types.ACTIVITY_DELETE_SENDING:
      return deleteIsSending(state, action);
    default: return state;
  }
}
