import axios from 'axios';
import moment from 'moment';
import { formReset, formError, formSubmitting } from 'actions/formActions';
import { objects } from 'utils';
import anomo from 'anomo';
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
export const ACTIVITY_COMMENT_APPEND       = 'ACTIVITY_COMMENT_APPEND';
export const ACTIVITY_COMMENT_DELETE       = 'ACTIVITY_COMMENT_DELETE';
export const ACTIVITY_POLL_SENDING         = 'ACTIVITY_POLL_SENDING';
export const ACTIVITY_FEED_NEW_NUMBER      = 'ACTIVITY_FEED_NEW_NUMBER';
export const ACTIVITY_FEED_FETCH           = 'ACTIVITY_FEED_FETCH';
export const ACTIVITY_FEED_PREPEND         = 'ACTIVITY_FEED_PREPEND';
export const ACTIVITY_DELETE               = 'ACTIVITY_DELETE';
export const ACTIVITY_DELETE_SENDING       = 'ACTIVITY_DELETE_SENDING';
export const ACTIVITY_SHARE                = 'ACTIVITY_SHARE';
export const ACTIVITY_REPORT               = 'ACTIVITY_REPORT';
export const ACTIVITY_TRENDING_HASHTAGS    = 'ACTIVITY_TRENDING_HASHTAGS';

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
 * @param {number} newNumber
 * @returns {{type: string, newNumber: *, feedType: *}}
 */
export function activityFeedNewNumber(feedType, newNumber) {
  return {
    type: ACTIVITY_FEED_NEW_NUMBER,
    newNumber,
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
  return (dispatch, getState, { endpoints, proxy, batch }) => {
    const { activity } = getState();

    if (buffered && refresh && feedBuffers[feedType].length > 0) {
      const activities = objects.clone(feedBuffers[feedType]);
      feedBuffers[feedType] = [];
      dispatch(batch(
        {
          type:    ACTIVITY_FEED_FETCH,
          prepend: true,
          activities,
          feedType
        },
        activityFeedNewNumber(feedType, 0)
      ));
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
    switch (feedType) {
      case 'recent':
        url = endpoints.create('activityFeedRecent', {
          lastActivityID: refresh ? 0 : activity.feeds.recent.lastActivityID
        });
        break;
      case 'popular':
        url = endpoints.create('activityFeedPopular', {
          lastActivityID: refresh ? 0 : activity.feeds.popular.lastActivityID
        });
        break;
      case 'following':
        url = endpoints.create('activityFeedFollowing', {
          lastActivityID: refresh ? 0 : activity.feeds.following.lastActivityID
        });
        break;
    }

    const config = {
      cancelToken: feedFetchSources[feedType].token
    };

    proxy.get(url, config)
      .then((data) => {
        if (data.code !== 'OK') {
          return null;
        }

        return anomo.activities.setImageDimensions(data.Activities)
          .then((activities) => {
            dispatch({
              type: ACTIVITY_FEED_FETCH,
              activities,
              feedType,
              refresh
            });
          });
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          throw err;
        }
      })
      .finally(() => {
        feedBuffers[feedType] = [];
        feedFetchSources[feedType] = null;
        dispatch(batch(
          activityFeedNewNumber(feedType, 0),
          activityIsFeedLoading(feedType, false)
        ));
        if (refresh) {
          dispatch(activityIsFeedRefreshing(feedType, false));
        }
      });
  };
}

/**
 * @param {string} hashtag
 * @param {boolean} refresh
 * @returns {function(*=, *, {endpoints: *, proxy: *})}
 */
export function activityFetchByHashtag(hashtag, refresh = false) {
  return (dispatch, getState, { endpoints, proxy }) => {
    const { activity } = getState();
    const feedType = 'hashtag';

    dispatch(activityIsFeedLoading(feedType, true));
    if (refresh) {
      dispatch(activityIsFeedRefreshing(feedType, true));
    }

    const url = endpoints.create('activityFeedHashtag', {
      page: activity.feeds.hashtag.page
    });
    const body = {
      'HashTag': hashtag
    };

    proxy.post(url, body)
      .then((data) => {
        if (data.code !== 'OK') {
          return null;
        }

        const hasMore = data.Page < data.TotalPage;

        return anomo.activities.setImageDimensions(data.Activities)
          .then((activities) => {
            dispatch({
              type: ACTIVITY_FEED_FETCH,
              feedType,
              activities,
              refresh,
              hasMore
            });
          });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        dispatch(activityIsFeedLoading(feedType, false));
        if (refresh) {
          dispatch(activityIsFeedRefreshing(feedType, false));
        }
      });
  };
}

/**
 * @returns {function(*, *, {endpoints: *, proxy: *})}
 */
export function activityTrendingHashtags() {
  return (dispatch, getState, { endpoints, proxy }) => {
    const url = endpoints.create('activityTrendingHashtags');
    proxy.get(url)
      .then((resp) => {
        const trendingHashtags = resp.ListTrending.map((h) => {
          return h.HashTag;
        });
        dispatch({
          type: ACTIVITY_TRENDING_HASHTAGS,
          trendingHashtags
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

/**
 * @param {boolean} refresh
 * @returns {function(*, *, {batch: *})}
 */
export function activityFeedFetchAll(refresh = false) {
  return (dispatch, getState, { batch }) => {
    dispatch(batch(
      activityFeedFetch('recent', refresh),
      activityFeedFetch('popular', refresh),
      activityFeedFetch('following', refresh)
    ));
  };
}

/**
 * @param {Array} activities
 * @returns {{type: string, activities: *}}
 */
export function activityFeedUpdate(activities) {
  return {
    type: ACTIVITY_FEED_UPDATE,
    activities
  };
}

/**
 * @param {string} feedType
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function activityFeedFetchNewNumber(feedType) {
  return (dispatch, getState, { endpoints, proxy, batch }) => {
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

    const config = {
      cancelToken: feedFetchNewNumberSources[feedType].token
    };

    let url = '';
    switch (feedType) {
      case 'recent':
        url = endpoints.create('activityFeedRecent', {
          lastActivityID: 0
        });
        break;
      case 'popular':
        url = endpoints.create('activityFeedPopular', {
          lastActivityID: 0
        });
        break;
      case 'following':
        url = endpoints.create('activityFeedFollowing', {
          lastActivityID: 0
        });
        break;
    }

    proxy.get(url, config)
      .then((data) => {
        if (data.code !== 'OK') {
          return null;
        }

        feedBuffers[feedType] = [];
        for (let i = 0; i < data.Activities.length; i++) {
          const a = data.Activities[i];
          if (hiddenActionTypes.indexOf(a.ActionType) === -1 && a.ActivityID > firstActivityID) {
            feedBuffers[feedType].push(a);
          }
        }

        return anomo.activities.setImageDimensions(feedBuffers[feedType])
          .then(() => {
            dispatch(batch(
              activityFeedNewNumber(feedType, feedBuffers[feedType].length),
              activityFeedUpdate(data.Activities)
            ));
          });
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
 * @returns {function(*, *, {batch: *})}
 */
export function activityFeedFetchAllNewNumbers() {
  return (dispatch, getState, { batch }) => {
    dispatch(batch(
      activityFeedFetchNewNumber('recent'),
      // activityFeedFetchNewNumber('popular'),
      activityFeedFetchNewNumber('following')
    ));
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
  return (dispatch, getState, { proxy, endpoints, activities, batch }) => {
    dispatch(batch(
      activityIsSubmitting(true),
      formSubmitting(formName, true)
    ));

    let url  = '';
    let body = {};
    if (photo || video) {
      url  = endpoints.create('userPicture');
      body = new FormData();
      body.append('PictureCaption', activities.createMessage(message));
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

      url  = endpoints.create('userStatus');
      body = {
        'ProfileStatus': activities.createMessage(message),
        'IsAnonymous':   0,
        'TopicID':       1
      };
    }

    proxy.post(url, body)
      .then((resp) => {
        if (resp.code === 'OK') {
          dispatch(batch(
            formReset(formName),
            activityFeedFetch('recent', true, false)
          ));
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
  return (dispatch, getState, { endpoints, proxy }) => {
    dispatch(activityIsLikeListLoading(true));

    const url = endpoints.create('activityLikeList', {
      actionType,
      refID
    });
    proxy.get(url)
      .then((data) => {
        dispatch({
          type:  ACTIVITY_LIKE_LIST,
          likes: data.likes || [],
          actionType,
          refID
        });
      })
      .catch((error) => {
        console.error(error);
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
  return (dispatch, getState, { endpoints, proxy, batch }) => {
    dispatch(batch(
      activityReset(),
      activityIsLikeListLoading(true)
    ));

    const urlGet = endpoints.create('activityGet', {
      actionType,
      refID
    });
    const urlLikes = endpoints.create('activityLikeList', {
      actionType,
      refID
    });

    const promises = [proxy.get(urlGet), proxy.get(urlLikes)];
    Promise.all(promises)
      .then((responses) => {
        const activity    = responses[0].Activity;
        activity.LikeList = responses[1].likes;
        dispatch(activitySet(activity));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        dispatch(batch(
          activityIsActivityLoading(false),
          activityIsCommentsLoading(false),
          activityIsLikeListLoading(false)
        ));
      });
  };
}

/**
 * @param {number} activityID
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function activityDelete(activityID) {
  return (dispatch, getState, { endpoints, proxy }) => {
    dispatch(activityIsDeleteSending(true, activityID));

    const url = endpoints.create('activityDelete', {
      activityID
    });
    proxy.get(url)
      .then(() => {
        dispatch({
          type: ACTIVITY_DELETE,
          activityID
        });
      })
      .catch((error) => {
        console.error(error);
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
  return (dispatch, getState, { endpoints, proxy, batch }) => {
    dispatch(batch(
      activityIsLikeLoading(true, refID),
      {
        type: ACTIVITY_LIKE,
        refID
      }
    ));
    setTimeout(() => {
      dispatch(activityIsLikeLoading(false, refID));
    }, 1000);

    const url = endpoints.create('activityLike', {
      actionType,
      refID
    });
    proxy.get(url)
      .then(() => {
        dispatch(activityGet(refID, actionType));
      })
      .catch((error) => {
        console.error(error);
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
  return (dispatch, getState, { endpoints, proxy, batch }) => {
    dispatch(batch(
      activityIsLikeCommentLoading(true, commentID),
      {
        type: ACTIVITY_LIKE_COMMENT,
        actionType,
        commentID,
        refID
      }
    ));
    setTimeout(() => {
      dispatch(activityIsLikeCommentLoading(false, commentID));
    }, 1000);

    const url = endpoints.create('activityCommentLike', {
      actionType,
      commentID
    });
    proxy.get(url)
      .then(() => {
        dispatch(activityGet(refID, actionType));
      })
      .catch((error) => {
        console.error(error);
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
 * @param {*} options
 * @returns {function(*, *, {endpoints: *})}
 */
export function activitySubmitComment(options) {
  return (dispatch, getState, { proxy, endpoints, batch }) => {
    const values = objects.merge({
      formName:    '',
      message:     '',
      reply:       '0',
      refID:       '',
      actionType:  '',
      isAnonymous: 0
    }, options);

    if (!values.formName || !values.message || !values.refID || !values.actionType) {
      dispatch(formError(values.formName || 'comment', 'Missing values.'));
      return;
    }

    const type    = values.reply === '1' ? ACTIVITY_COMMENT_APPEND : ACTIVITY_COMMENT_PREPEND;
    const comment = objects.merge(getState().user, {
      'ID':          10,
      'CreatedDate': moment().format(''),
      'Content':     values.message
    });
    dispatch(batch(
      formReset(values.formName),
      formSubmitting(values.formName, true),
      {
        type,
        comment
      }
    ));

    const url = endpoints.create('activityComment', {
      actionType: values.actionType,
      refID:      values.refID
    });
    proxy.post(url, {
      'Content':     values.message,
      'IsAnonymous': values.isAnonymous
    }).then((resp) => {
      if (resp.code !== 'OK') {
        dispatch(formError(values.formName, 'There was an error.'));
      }
    }).finally(() => {
      dispatch(formSubmitting(values.formName, false));
    });
  };
}

/**
 * @param {number} commentID
 * @returns {function(*, *, {user: *, proxy: *, endpoints: *})}
 */
export function activityDeleteComment(commentID) {
  return (dispatch, getState, { proxy, endpoints }) => {
    dispatch({
      type: ACTIVITY_COMMENT_DELETE,
      commentID
    });

    const url = endpoints.create('activityCommentDelete', {
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
  return (dispatch, getState, { proxy, endpoints }) => {
    const url = endpoints.create('activityCommentStopNotify', {
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
  return (dispatch, getState, { proxy, endpoints }) => {
    dispatch(activityIsPollSending(true));

    const url = endpoints.create('activityAnswerPoll', {
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
 * @param {number} refID
 * @param {string} actionType
 * @param {*} stateActivity
 * @returns {function(*, *, {batch: *})}
 */
export function activitySetupActivityPage(refID, actionType, stateActivity = null) {
  return (dispatch, getState, { batch }) => {
    if (stateActivity !== null) {
      const actions = [];
      if (stateActivity.Comment !== '0') {
        actions.push(activityIsCommentsLoading(true));
      }
      actions.push(activityGet(stateActivity.RefID, stateActivity.ActionType));
      dispatch(batch(actions));
    } else {
      dispatch(batch(
        activityReset(),
        activityIsActivityLoading(true),
        activityIsCommentsLoading(true),
        activityGet(refID, actionType)
      ));
    }
  };
}

/**
 * @returns {function(*)}
 */
export function activityIntervalStart() {
  return (dispatch) => {
    setInterval(() => {
      dispatch(activityFeedFetchAllNewNumbers());
      dispatch(activityTrendingHashtags());
    }, 30000);
  };
}
