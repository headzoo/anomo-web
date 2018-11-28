import * as types from 'actions/activityActions';
import { objects, numbers, redux, feeds as feedUtils } from 'utils';
import anomo from 'anomo';
import { defaultActivity } from 'store/defaultState';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reset(state, action) {
  if (action.feedType) {
    const feeds = objects.clone(state.feeds);
    feeds[action.feedType] = objects.clone(defaultActivity.feeds[action.feedType]);

    return {
      ...state,
      feeds
    };
  }

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
function submitting(state, action) {
  return {
    ...state,
    isSubmitting: action.isSubmitting
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function likeListLoading(state, action) {
  return {
    ...state,
    isLikeListLoading: action.isLikeListLoading
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
function trendingHashtags(state, action) {
  return {
    ...state,
    trendingHashtags: action.trendingHashtags
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function feedLoading(state, action) {
  const feeds = objects.clone(state.feeds);
  feeds[action.feedType].isLoading = action.isLoading;

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
  feeds[action.feedType].isRefreshing = action.isRefreshing;

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

  feedUtils.traverseActivityCommentsForID(activity, action.commentID, (c) => {
    return objects.merge(c, {
      LikeIsLoading: action.isLoading
    });
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
function commentListLoading(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  feedUtils.traverseActivityCommentsForID(activity, action.commentID, (c) => {
    return objects.merge(c, {
      isCommentListLoading: action.isCommentListLoading
    });
  });
  feedUtils.traverseFeedCommentsForID(feeds, action.commentID, (c) => {
    return objects.merge(c, {
      isCommentListLoading: action.isCommentListLoading
    });
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
function commentLikeList(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  feedUtils.traverseActivityCommentsForID(activity, action.commentID, (c) => {
    return objects.merge(c, {
      LikeList: action.likes
    });
  });
  feedUtils.traverseFeedCommentsForID(feeds, action.commentID, (c) => {
    return objects.merge(c, {
      LikeList: action.likes
    });
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
function commentPrepend(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  activity.ListComment.unshift(action.comment);
  activity.Comment = numbers.parseAny(activity.Comment) + 1;

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
function commentAppend(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  activity.ListComment.push(action.comment);
  activity.Comment = numbers.parseAny(activity.Comment) + 1;

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
    feedUtils.toggleActivityLike(activity);
  }
  feedUtils.traverseForRefID(feeds, action.refID, (a) => {
    return feedUtils.toggleActivityLike(a);
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

  feedUtils.traverseActivityCommentsForID(activity, action.commentID, (c) => {
    return feedUtils.toggleCommentLike(c);
  });
  feedUtils.traverseFeedCommentsForID(feeds, action.commentID, (c) => {
    return feedUtils.toggleCommentLike(c);
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
function likeList(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  if (activity.RefID === action.refID) {
    activity.LikeList = action.likes;
  }
  feedUtils.traverseForRefID(feeds, action.refID, (a) => {
    a.LikeList = action.likes;
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
function feedNewNumber(state, action) {
  const feeds = objects.clone(state.feeds);
  feeds[action.feedType].newNumber = action.newNumber;

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

  const newActivities = action.activities.map((a) => {
    return anomo.activities.sanitizeActivity(a);
  });

  if (action.refresh) {
    feed.activities = newActivities;
  } else if (action.prepend) {
    feed.activities = newActivities.concat(objects.clone(feed.activities));
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

  if (feed.page !== undefined) {
    if (action.refresh) {
      feed.page = 1;
    } else {
      feed.page += 1;
    }
  }
  if (feed.hasMore !== undefined && action.hasMore !== undefined) {
    feed.hasMore = action.hasMore;
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
function feedPrepend(state, action) {
  const feeds    = objects.clone(state.feeds);
  const feed     = feeds[action.feedType];
  const activity = anomo.activities.sanitizeActivity(action.activity);

  feed.activities = feed.activities.unshift(activity);

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
function deleteComment(state, action) {
  const feeds    = objects.clone(state.feeds);
  const activity = objects.clone(state.activity);

  if (activity.ListComment) {
    activity.ListComment = activity.ListComment.filter(c => c.ID !== action.commentID);
    activity.Comment     = activity.ListComment.length;
  }
  feedUtils.traverseActivities(feeds, (a) => {
    if (a.ListComment) {
      a.ListComment = a.ListComment.filter(c => c.ID !== action.commentID);
      a.Comment     = a.ListComment.length;
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

export default redux.createReducer({
  [types.ACTIVITY_RESET]:                reset,
  [types.ACTIVITY_SET]:                  set,
  [types.ACTIVITY_LIKE]:                 like,
  [types.ACTIVITY_LIKE_LIST]:            likeList,
  [types.ACTIVITY_DELETE]:               deleteActivity,
  [types.ACTIVITY_COMMENT_DELETE]:       deleteComment,
  [types.ACTIVITY_LIKE_COMMENT]:         likeComment,
  [types.ACTIVITY_SUBMITTING]:           submitting,
  [types.ACTIVITY_FEED_LOADING]:         feedLoading,
  [types.ACTIVITY_FEED_REFRESHING]:      feedRefreshing,
  [types.ACTIVITY_FEED_UPDATE]:          feedUpdate,
  [types.ACTIVITY_FEED_PREPEND]:         feedPrepend,
  [types.ACTIVITY_LIKE_LOADING]:         likeLoading,
  [types.ACTIVITY_POLL_SENDING]:         pollSending,
  [types.ACTIVITY_FEED_FETCH]:           feedFetch,
  [types.ACTIVITY_FEED_NEW_NUMBER]:      feedNewNumber,
  [types.ACTIVITY_ACTIVITY_LOADING]:     activityLoading,
  [types.ACTIVITY_DELETE_SENDING]:       deleteIsSending,
  [types.ACTIVITY_COMMENTS_LOADING]:     commentsLoading,
  [types.ACTIVITY_COMMENT_SENDING]:      commentSending,
  [types.ACTIVITY_COMMENT_PREPEND]:      commentPrepend,
  [types.ACTIVITY_COMMENT_APPEND]:       commentAppend,
  [types.ACTIVITY_COMMENT_LIKE_LIST]:    commentLikeList,
  [types.ACTIVITY_COMMENT_LIST_LOADING]: commentListLoading,
  [types.ACTIVITY_LIKE_LIST_LOADING]:    likeListLoading,
  [types.ACTIVITY_LIKE_COMMENT_LOADING]: likeCommentLoading,
  [types.ACTIVITY_TRENDING_HASHTAGS]:    trendingHashtags
});
