import axios from 'axios';
import moment from 'moment';
import { formReset, formError, formSubmitting } from 'actions/formActions';
import { objects } from 'utils';
import * as constants from 'anomo/constants';

export const ACTIVITY_RESET                = 'ACTIVITY_RESET';
export const ACTIVITY_SET                  = 'ACTIVITY_SET';
export const ACTIVITY_SUBMITTING           = 'ACTIVITY_SUBMITTING';
export const ACTIVITY_ACTIVITY_LOADING     = 'ACTIVITY_ACTIVITY_LOADING';
export const ACTIVITY_FEED_LOADING         = 'ACTIVITY_FEED_LOADING';
export const ACTIVITY_FEED_UPDATE          = 'ACTIVITY_FEED_UPDATE';
export const ACTIVITY_FEED_REFRESHING      = 'ACTIVITY_FEED_REFRESHING';
export const ACTIVITY_LIKE                 = 'ACTIVITY_LIKE';
export const ACTIVITY_LIKE_COMMENT         = 'ACTIVITY_LIKE_COMMENT';
export const ACTIVITY_LIKE_LOADING         = 'ACTIVITY_LIKE_LOADING';
export const ACTIVITY_LIKE_LIST            = 'ACTIVITY_LIKE_LIST';
export const ACTIVITY_LIKE_LIST_LOADING    = 'ACTIVITY_LIKE_LIST_LOADING';
export const ACTIVITY_LIKE_COMMENT_LOADING = 'ACTIVITY_LIKE_COMMENT_LOADING';
export const ACTIVITY_COMMENTS_LOADING     = 'ACTIVITY_COMMENTS_LOADING';
export const ACTIVITY_COMMENT_SENDING      = 'ACTIVITY_COMMENT_SENDING';
export const ACTIVITY_COMMENT_PREPEND      = 'ACTIVITY_COMMENT_PREPEND';
export const ACTIVITY_COMMENT_DELETE       = 'ACTIVITY_COMMENT_DELETE';
export const ACTIVITY_POLL_SENDING         = 'ACTIVITY_POLL_SENDING';
export const ACTIVITY_FEED_NEW_NUMBER      = 'ACTIVITY_FEED_NEW_NUMBER';
export const ACTIVITY_FEED_FETCH           = 'ACTIVITY_FEED_FETCH';
export const ACTIVITY_FEED_PREPEND         = 'ACTIVITY_FEED_PREPEND';
export const ACTIVITY_DELETE               = 'ACTIVITY_DELETE';
export const ACTIVITY_DELETE_SENDING       = 'ACTIVITY_DELETE_SENDING';
export const ACTIVITY_SHARE                = 'ACTIVITY_SHARE';
export const ACTIVITY_REPORT               = 'ACTIVITY_REPORT';

const { CancelToken } = axios;

const feedBuffers = {
  recent:    [],
  popular:   [],
  following: []
};

const feedFetchSources = {
  recent:    null,
  popular:   null,
  following: null
};

const feedFetchNewNumberSources = {
  recent:    null,
  popular:   null,
  following: null
};

const hiddenActionTypes = [constants.ACTION_TYPE_JOIN];

/**
 * @returns {{type: string}}
 */
export function activityReset() {
  return {
    type: ACTIVITY_RESET
  };
}

/**
 * @param {boolean} isLoading
 * @param {number} refID
 * @returns {{type: string, isLoading: *}}
 */
export function activityIsLikeLoading(isLoading, refID) {
  return {
    type: ACTIVITY_LIKE_LOADING,
    isLoading,
    refID
  };
}

/**
 * @param {boolean} isLikeListLoading
 * @returns {{type: string, isLikeListLoading: *}}
 */
export function activityIsLikeListLoading(isLikeListLoading) {
  return {
    type: ACTIVITY_LIKE_LIST_LOADING,
    isLikeListLoading
  };
}

/**
 * @param {boolean} isActivityLoading
 * @returns {{type: string, isActivityLoading: *}}
 */
export function activityIsActivityLoading(isActivityLoading) {
  return {
    type: ACTIVITY_ACTIVITY_LOADING,
    isActivityLoading
  };
}

/**
 * @param {boolean} isLoading
 * @param {number} commentID
 * @returns {{type: string, isLoading: *}}
 */
export function activityIsLikeCommentLoading(isLoading, commentID) {
  return {
    type: ACTIVITY_LIKE_COMMENT_LOADING,
    isLoading,
    commentID
  };
}

/**
 * @param {boolean} isCommentsLoading
 * @returns {{type: string, isLoading: *}}
 */
export function activityIsCommentsLoading(isCommentsLoading) {
  return {
    type: ACTIVITY_COMMENTS_LOADING,
    isCommentsLoading
  };
}

/**
 * @param {boolean} isCommentSending
 * @returns {{type: string, isLoading: *}}
 */
export function activityIsCommentSending(isCommentSending) {
  return {
    type: ACTIVITY_COMMENT_SENDING,
    isCommentSending
  };
}

/**
 * @param {boolean} isSubmitting
 * @returns {{type, isSending: *}}
 */
export function activityIsSubmitting(isSubmitting) {
  return {
    type: ACTIVITY_SUBMITTING,
    isSubmitting
  };
}


/**
 * @param {boolean} isPollSending
 * @returns {{type: string, isLoading: *}}
 */
export function activityIsPollSending(isPollSending) {
  return {
    type: ACTIVITY_POLL_SENDING,
    isPollSending
  };
}

/**
 * @param {boolean} isSending
 * @param {number} activityID
 * @returns {{type: string, isSending: *}}
 */
export function activityIsDeleteSending(isSending, activityID) {
  return {
    type: ACTIVITY_DELETE_SENDING,
    activityID,
    isSending
  };
}

/**
 * @param {string} feedType
 * @param {boolean} isLoading
 * @returns {{type, isLoading: *}}
 */
export function activityIsFeedLoading(feedType, isLoading) {
  return {
    type: ACTIVITY_FEED_LOADING,
    isLoading,
    feedType
  };
}

/**
 * @param {string} feedType
 * @param {boolean} isRefreshing
 * @returns {{type, isLoading: *}}
 */
export function activityIsFeedRefreshing(feedType, isRefreshing) {
  return {
    type: ACTIVITY_FEED_REFRESHING,
    isRefreshing,
    feedType
  };
}

/**
 * @param {string} feedType
 * @param {boolean} refresh
 * @param {boolean} buffered
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function activityFeedFetch(feedType, refresh = false, buffered = true) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const { activity } = getState();

    if (buffered && refresh && feedBuffers[feedType].length > 0) {
      const activities = objects.clone(feedBuffers[feedType]);
      feedBuffers[feedType] = [];
      dispatch({
        type:    ACTIVITY_FEED_FETCH,
        prepend: true,
        activities,
        feedType
      });
      return;
    }

    dispatch(activityIsFeedLoading(feedType, true));
    if (refresh) {
      dispatch(activityIsFeedRefreshing(feedType, true));
    }

    if (feedFetchSources[feedType]) {
      feedFetchSources[feedType].cancel();
    }
    feedFetchSources[feedType] = CancelToken.source();

    let url = '';
    const token = user.getToken();
    switch (feedType) {
      case 'recent':
        url = endpoints.create('activityFeedRecent', {
          lastActivityID: refresh ? 0 : activity.feeds.recent.lastActivityID,
          token
        });
        break;
      case 'popular':
        url = endpoints.create('activityFeedPopular', {
          lastActivityID: refresh ? 0 : activity.feeds.popular.lastActivityID,
          token
        });
        break;
      case 'following':
        url = endpoints.create('activityFeedFollowing', {
          lastActivityID: refresh ? 0 : activity.feeds.following.lastActivityID,
          token
        });
        break;
    }

    const config = {
      cancelToken: feedFetchSources[feedType].token
    };

    proxy.get(url, config)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:       ACTIVITY_FEED_FETCH,
            activities: data.Activities,
            feedType,
            refresh
          });
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          throw err;
        }
      })
      .finally(() => {
        feedBuffers[feedType] = [];
        feedFetchSources[feedType] = null;
        dispatch(activityIsFeedLoading(feedType, false));
        if (refresh) {
          dispatch(activityIsFeedRefreshing(feedType, false));
        }
      });
  };
}

/**
 * @param {boolean} refresh
 * @returns {function(*)}
 */
export function activityFeedFetchAll(refresh = false) {
  return (dispatch) => {
    dispatch(activityFeedFetch('recent', refresh));
    dispatch(activityFeedFetch('popular', refresh));
    dispatch(activityFeedFetch('following', refresh));
  };
}

/**
 * @param {string} feedType
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function activityFeedFetchNewNumber(feedType) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const { activity } = getState();
    const { firstActivityID } = activity.feeds[feedType];

    if (firstActivityID === 0) {
      dispatch({
        type:      ACTIVITY_FEED_NEW_NUMBER,
        newNumber: 0,
        feedType
      });
      return;
    }

    if (feedFetchNewNumberSources[feedType]) {
      feedFetchNewNumberSources[feedType].cancel();
    }
    feedFetchNewNumberSources[feedType] = CancelToken.source();

    let url = '';
    const token = user.getToken();
    switch (feedType) {
      case 'recent':
        url = endpoints.create('activityFeedRecent', {
          lastActivityID: 0,
          token
        });
        break;
      case 'popular':
        url = endpoints.create('activityFeedPopular', {
          lastActivityID: 0,
          token
        });
        break;
      case 'following':
        url = endpoints.create('activityFeedFollowing', {
          lastActivityID: 0,
          token
        });
        break;
    }

    const config = {
      cancelToken: feedFetchNewNumberSources[feedType].token
    };

    proxy.get(url, config)
      .then((data) => {
        if (data.code === 'OK') {
          feedBuffers[feedType] = [];
          for (let i = 0; i < data.Activities.length; i++) {
            const a = data.Activities[i];
            if (hiddenActionTypes.indexOf(a.ActionType) === -1 && a.ActivityID > firstActivityID) {
              feedBuffers[feedType].push(a);
            }
          }

          dispatch({
            type:      ACTIVITY_FEED_NEW_NUMBER,
            newNumber: feedBuffers[feedType].length,
            feedType
          });
          dispatch({
            type:       ACTIVITY_FEED_UPDATE,
            activities: data.Activities
          });
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          throw err;
        }
      })
      .finally(() => {
        feedFetchNewNumberSources[feedType] = null;
      });
  };
}

/**
 * @returns {function(*)}
 */
export function activityFeedFetchAllNewNumbers() {
  return (dispatch) => {
    dispatch(activityFeedFetchNewNumber('recent'));
    // dispatch(activityFeedFetchNewNumber('popular'));
    dispatch(activityFeedFetchNewNumber('following'));
  };
}

/**
 * @param {string} feedType
 * @param {*} activity
 * @returns {{type: string, activity: *, feedType: *}}
 */
export function activityFeedPrepend(feedType, activity) {
  return {
    type: ACTIVITY_FEED_PREPEND,
    activity,
    feedType
  };
}

/**
 * @param {string} formName
 * @param {string} message
 * @param {*} photo
 * @param {*} video
 * @returns {function(*, *, {endpoints: *})}
 */
export function activitySubmit(formName, message, photo = '', video = '') {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    dispatch(activityIsSubmitting(true));
    dispatch(formSubmitting(formName, true));

    let url  = '';
    let body = {};
    if (photo || video) {
      url = endpoints.create('userPicture', {
        token: user.getToken()
      });
      body = new FormData();
      body.append('PictureCaption', JSON.stringify({
        message,
        message_tags: []
      }));

      if (video) {
        body.append('Photo', photo, 'poster.png');
        body.append('Video', video);
      } else {
        body.append('Photo', photo);
      }
    } else {
      if (message === '') {
        dispatch(formError(formName, 'There was an error.'));
        return;
      }

      url = endpoints.create('userStatus', {
        token: user.getToken()
      });
      body = {
        'ProfileStatus': JSON.stringify({ message, message_tags: [] }),
        'IsAnonymous':   0,
        'TopicID':       1
      };
    }

    proxy.post(url, body)
      .then((resp) => {
        if (resp.code === 'OK') {
          dispatch(formReset(formName));
          dispatch(activityFeedFetch('recent', true, false));
        } else {
          dispatch(formError(formName, 'There was an error.'));
        }
      }).finally(() => {
        dispatch(activityIsSubmitting(false));
      });
  };
}

/**
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function activityLikeList(refID, actionType) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityIsLikeListLoading(true));

    const url = endpoints.create('activityLikeList', {
      token: user.getToken(),
      actionType,
      refID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:  ACTIVITY_LIKE_LIST,
            likes: data.likes || [],
            actionType,
            refID
          });
        }
      })
      .finally(() => {
        dispatch(activityIsLikeListLoading(false));
      });
  };
}

/**
 * @param {*} activity
 * @returns {{type: string, activity: *}}
 */
export function activitySet(activity) {
  return {
    type: ACTIVITY_SET,
    activity
  };
}

/**
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*, *, {anomo: *})}
 */
export function activityGet(refID, actionType) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityReset());

    const url = endpoints.create('activityGet', {
      token: user.getToken(),
      actionType,
      refID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch(activitySet(data.Activity));
          dispatch(activityLikeList(refID, actionType));
        }
      })
      .finally(() => {
        dispatch(activityIsActivityLoading(false));
        dispatch(activityIsCommentsLoading(false));
      });
  };
}

/**
 * @param {number} activityID
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function activityDelete(activityID) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityIsDeleteSending(true, activityID));

    const url = endpoints.create('activityDelete', {
      token: user.getToken(),
      activityID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type: ACTIVITY_DELETE,
            activityID
          });
        }
      })
      .finally(() => {
        dispatch(activityIsDeleteSending(false, activityID));
      });
  };
}

/**
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*, *, {anomo: *})}
 */
export function activityLike(refID, actionType) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityIsLikeLoading(true, refID));
    dispatch({
      type: ACTIVITY_LIKE,
      refID
    });
    setTimeout(() => {
      dispatch(activityIsLikeLoading(false, refID));
    }, 1000);

    const url = endpoints.create('activityLike', {
      token: user.getToken(),
      actionType,
      refID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch(activityGet(refID, actionType));
        }
      });
  };
}

/**
 * @param {number} commentID
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function activityLikeComment(commentID, refID, actionType) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityIsLikeCommentLoading(true, commentID));
    dispatch({
      type: ACTIVITY_LIKE_COMMENT,
      commentID,
      refID,
      actionType
    });
    setTimeout(() => {
      dispatch(activityIsLikeCommentLoading(false, commentID));
    }, 1000);

    const url = endpoints.create('activityCommentLike', {
      token: user.getToken(),
      commentID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch(activityGet(refID, actionType));
        }
      });
  };
}

export function activityShare(refID, actionType) {
  return (dispatch, getState) => {

  };
}

export function activityReport(refID, actionType) {
  return (dispatch, getState) => {

  };
}

/**
 * @param {string} formName
 * @param {string} message
 * @param {number} refID
 * @param {number} actionType
 * @param {number} topicID
 * @param {number} isAnonymous
 * @returns {function(*, *, {endpoints: *})}
 */
export function activitySubmitComment(formName, message, refID, actionType, topicID, isAnonymous = 0) {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    const comment = objects.merge(getState().user, {
      'ID':          10,
      'CreatedDate': moment().format(''),
      'Content':     message
    });
    dispatch(formReset(formName));
    dispatch({
      type: ACTIVITY_COMMENT_PREPEND,
      comment
    });

    dispatch(formSubmitting(formName, true));

    const url = endpoints.create('activityComment', {
      token: user.getToken(),
      actionType,
      refID
    });
    proxy.post(url, {
      'Content':     message,
      'IsAnonymous': isAnonymous
    }).then((resp) => {
      if (resp.code !== 'OK') {
        dispatch(formError(formName, 'There was an error.'));
      }
    }).finally(() => {
      dispatch(formSubmitting(formName, false));
    });
  };
}

/**
 * @param {number} commentID
 * @returns {function(*, *, {user: *, proxy: *, endpoints: *})}
 */
export function activityDeleteComment(commentID) {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    dispatch({
      type: ACTIVITY_COMMENT_DELETE,
      commentID
    });

    const url = endpoints.create('activityCommentDelete', {
      token: user.getToken(),
      commentID
    });
    proxy.get(url);
  };
}

/**
 * @param {number} refID
 * @param {string} actionType
 * @returns {function(*, *, {user: *, proxy: *, endpoints: *})}
 */
export function activityCommentStopNotify(refID, actionType) {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    const url = endpoints.create('activityCommentStopNotify', {
      token: user.getToken(),
      actionType,
      refID
    });
    proxy.get(url);
  };
}

/**
 * @param {number} pollID
 * @param {number} answerID
 * @returns {function(*, *, {user: *, proxy: *, endpoints: *})}
 */
export function activityAnswerPoll(pollID, answerID) {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    dispatch(activityIsPollSending(true));

    const url = endpoints.create('activityAnswerPoll', {
      token: user.getToken(),
      answerID,
      pollID
    });
    proxy.get(url)
      .finally(() => {
        dispatch(activityIsPollSending(false));
      });
  };
}

/**
 * @returns {function(*)}
 */
export function activityIntervalStart() {
  return (dispatch) => {
    setInterval(() => {
      dispatch(activityFeedFetchAllNewNumbers());
    }, 30000);
  };
}
