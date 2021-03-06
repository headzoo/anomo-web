import axios from 'axios';
import moment from 'moment';
import { uiUpdateActivity } from 'actions/uiActions';
import { formReset, formError, formSubmitting } from 'actions/formActions';
import { profileIsLikeLoading, profileLikeToggle } from 'actions/profileActions';
import { objects, redux } from 'utils';
import anomo from 'anomo';
import api from 'api';
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
export const ACTIVITY_COMMENT_LIST_LOADING = 'ACTIVITY_COMMENT_LIST_LOADING';
export const ACTIVITY_COMMENT_LIKE_LIST    = 'ACTIVITY_COMMENT_LIKE_LIST';
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

const activityCache = {};

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

const hiddenActionTypes = [constants.ACTION_TYPE_JOIN];

/**
 * @param {string} feedType
 * @returns {{cancelToken: string | string | *}}
 */
function getFeedFetchConfig(feedType) {
  if (feedFetchSources[feedType]) {
    feedFetchSources[feedType].cancel();
  }
  feedFetchSources[feedType] = CancelToken.source();

  return {
    cancelToken: feedFetchSources[feedType].token
  };
}

/**
 * @returns {{type: string}}
 */
export function activityReset() {
  return {
    type: ACTIVITY_RESET
  };
}

/**
 * @param {string} feedType
 * @returns {{type: string, feedType: *}}
 */
export function activityFeedReset(feedType) {
  return {
    type: ACTIVITY_RESET,
    feedType
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
 * @param {boolean} isCommentListLoading
 * @param {number} refID
 * @param {number} commentID
 * @returns {{type: string, isLoading: *}}
 */
export function activityIsCommentListLoading(isCommentListLoading, refID, commentID) {
  return {
    type: ACTIVITY_COMMENT_LIST_LOADING,
    isCommentListLoading,
    commentID,
    refID
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
 * @returns {function(*, *, {batch: function})}
 */
export function activityFeedFetch(feedType, refresh = false, buffered = true) {
  return (dispatch, getState, { batch }) => {
    if (buffered && refresh && feedBuffers[feedType].length > 0) {
      const activities = objects.clone(feedBuffers[feedType]);
      feedBuffers[feedType] = [];

      return dispatch(batch(
        {
          type:    ACTIVITY_FEED_FETCH,
          prepend: true,
          activities,
          feedType
        },
        activityFeedNewNumber(feedType, 0)
      ));
    }

    dispatch(activityIsFeedLoading(feedType, true));
    if (refresh) {
      dispatch(activityIsFeedRefreshing(feedType, true));
    }

    const lastActivityID = refresh ? 0 : getState().activity.feeds[feedType].lastActivityID;
    return api.request('api_feeds_fetch', {
      name: feedType,
      lastActivityID
    })
      .send(getFeedFetchConfig(feedType))
      .then((resp) => {
        return anomo.activities.setImageDimensions(resp.Activities)
          .then((activities) => {
            activities.forEach((a) => {
              activityCache[a.RefID] = a;
            });
            dispatch({
              type: ACTIVITY_FEED_FETCH,
              activities,
              feedType,
              refresh
            });
            dispatch(uiUpdateActivity(activities));
          });
      })
      .catch(redux.actionCatch)
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
 * @returns {function(*=, *)}
 */
export function activityFetchByHashtag(hashtag, refresh = false) {
  return (dispatch, getState) => {
    const { activity } = getState();
    const feedType = 'hashtag';

    dispatch(activityIsFeedLoading(feedType, true));
    if (refresh) {
      dispatch(activityIsFeedRefreshing(feedType, true));
    }

    api.request('api_feeds_hashtag', {
      page: activity.feeds.hashtag.page,
      hashtag
    })
      .send()
      .then((resp) => {
        const hasMore = resp.Page < resp.TotalPage;
        return anomo.activities.setImageDimensions(resp.Activities)
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
      .catch(redux.actionCatch)
      .finally(() => {
        dispatch(activityIsFeedLoading(feedType, false));
        if (refresh) {
          dispatch(activityIsFeedRefreshing(feedType, false));
        }
      });
  };
}

/**
 * @returns {function(*)}
 */
export function activityTrendingHashtags() {
  return (dispatch) => {
    api.request('api_feeds_hashtags_trending')
      .send()
      .then((resp) => {
        const trendingHashtags = resp.ListTrending.map((h) => {
          return h.HashTag;
        });
        dispatch({
          type: ACTIVITY_TRENDING_HASHTAGS,
          trendingHashtags
        });
      })
      .catch(redux.actionCatch);
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
 * @returns {function(*=, *, {batch?: *})}
 */
export function activityFeedFetchNewNumber(feedType) {
  return (dispatch, getState, { batch }) => {
    const { activity } = getState();
    const { firstActivityID } = activity.feeds[feedType];

    if (firstActivityID === 0) {
      return dispatch({
        type:      ACTIVITY_FEED_NEW_NUMBER,
        newNumber: 0,
        feedType
      });
    }

    return api.request('api_feeds_fetch', {
      name:           feedType,
      lastActivityID: 0
    })
      .send(getFeedFetchConfig(feedType))
      .then((data) => {
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
              activityFeedUpdate(data.Activities),
              uiUpdateActivity(data.Activities)
            ));
          });
      })
      .catch(redux.actionCatch)
      .finally(() => {
        feedFetchSources[feedType] = null;
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
 * @returns {function(*, *, {activities: *, batch: *})}
 */
export function activitySubmit(formName, message, photo = '', video = '') {
  return (dispatch, getState, { activities, batch }) => {
    dispatch(batch(
      formSubmitting(formName, true),
      activityIsSubmitting(true)
    ));

    let body = {};
    if (photo || video) {
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
      body = {
        'ProfileStatus': activities.createMessage(message),
        'IsAnonymous':   0,
        'TopicID':       1
      };
    }

    api.request('api_activities_submit')
      .send(body)
      .then(() => {
        dispatch(batch(
          formReset(formName),
          activityIsSubmitting(false),
          activityFeedFetch('recent', true, false)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(batch(
          formError(formName, 'There was an error.'),
          activityIsSubmitting(false)
        ));
      });
  };
}

/**
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*)}
 */
export function activityLikeList(refID, actionType) {
  return (dispatch) => {
    dispatch(activityIsLikeListLoading(true));

    api.request('api_activities_likes', { refID, actionType })
      .send()
      .then((resp) => {
        dispatch({
          type:  ACTIVITY_LIKE_LIST,
          likes: resp.likes || [],
          actionType,
          refID
        });
      })
      .catch(redux.actionCatch)
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
 * @returns {function(*=, *, {batch?: *})}
 */
export function activityGet(refID, actionType) {
  return (dispatch, getState, { batch }) => {
    dispatch(batch(
      activityReset(),
      activityIsLikeListLoading(true)
    ));

    // Pre-load the cached activity, but continue fetching it from
    // anomo to get any changes to likes, comments, etc.
    if (activityCache[refID]) {
      dispatch(batch(
        activityIsActivityLoading(false),
        activitySet(activityCache[refID])
      ));
    }

    const reqFetch = api.request('api_activities_fetch', { refID, actionType });
    const reqLikes = api.request('api_activities_likes', { refID, actionType });
    const promises = [reqFetch.send(), reqLikes.send()];

    Promise.all(promises)
      .then((responses) => {
        const activity    = responses[0].Activity;
        activity.LikeList = responses[1].likes;

        anomo.activities.setImageDimensions([activity])
          .then((activities) => {
            activityCache[refID] = activities[0]; // eslint-disable-line
            dispatch(batch(
              activitySet(activities[0]),
              uiUpdateActivity(activities[0]),
              activityIsActivityLoading(false),
              activityIsCommentsLoading(false),
              activityIsLikeListLoading(false)
            ));
          });
      })
      .catch((error) => {
        redux.actionCatch(error);
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
 * @returns {function(*, *, {batch: *})}
 */
export function activityDelete(activityID) {
  return (dispatch, getState, { batch }) => {
    dispatch(activityIsDeleteSending(true, activityID));

    api.request('api_activities_delete', { activityID })
      .send()
      .then(() => {
        dispatch(batch(
          {
            type: ACTIVITY_DELETE,
            activityID
          },
          activityIsDeleteSending(false, activityID)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(activityIsDeleteSending(false, activityID));
      });
  };
}

/**
 * @param {number} refID
 * @returns {{type: string, refID: *}}
 */
export function activityLikeToggle(refID) {
  return {
    type: ACTIVITY_LIKE,
    refID
  };
}

/**
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*, *, {batch: *})}
 */
export function activityLike(refID, actionType) {
  return (dispatch, getState, { batch }) => {
    dispatch(batch(
      activityIsLikeLoading(true, refID),
      profileIsLikeLoading(true, refID),
      activityLikeToggle(refID),
      profileLikeToggle(refID)
    ));

    api.request('api_activities_like', { refID, actionType })
      .send()
      .then(() => {
        dispatch(batch(
          activityLikeList(refID, actionType),
          activityIsLikeLoading(false, refID),
          profileIsLikeLoading(false, refID)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(batch(
          activityLikeToggle(refID),
          profileLikeToggle(refID),
          activityIsLikeLoading(false, refID),
          profileIsLikeLoading(false, refID)
        ));
      });
  };
}

/**
 * @param {number} commentID
 * @param {number} refID
 * @returns {{type: string, commentID: *, refID: *}}
 */
export function activityLikeCommentToggle(commentID, refID) {
  return {
    type: ACTIVITY_LIKE_COMMENT,
    commentID,
    refID
  };
}

/**
 * @param {number} commentID
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*, *, {batch: *})}
 */
export function activityLikeComment(commentID, refID, actionType) {
  return (dispatch, getState, { batch }) => {
    dispatch(batch(
      activityIsLikeCommentLoading(true, commentID),
      activityLikeCommentToggle(commentID, refID)
    ));

    api.request('api_comments_like', { commentID, actionType })
      .send()
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(activityLikeCommentToggle(commentID, refID));
      })
      .finally(() => {
        dispatch(activityIsLikeCommentLoading(false, commentID));
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
 * @returns {function(*, *, {batch: *})}
 */
export function activitySubmitComment(options) {
  return (dispatch, getState, { batch }) => {
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

    api.request('api_comments_submit')
      .send({
        'RefID':       values.refID,
        'ActionType':  values.actionType,
        'Content':     values.message,
        'IsAnonymous': values.isAnonymous
      })
      .finally(() => {
        dispatch(formSubmitting(values.formName, false));
      });
  };
}

/**
 * @param {number} commentID
 * @returns {function(*)}
 */
export function activityDeleteComment(commentID) {
  return (dispatch) => {
    dispatch({
      type: ACTIVITY_COMMENT_DELETE,
      commentID
    });

    api.request('api_comments_delete', { commentID })
      .send();
  };
}

/**
 * @param {number} refID
 * @param {string} actionType
 * @returns {function(*)}
 */
export function activityCommentStopNotify(refID, actionType) {
  return (dispatch) => {
    api.request('api_activities_stop_notify', { refID, actionType })
      .send();
  };
}

/**
 * @param {number} commentID
 * @param {number} refID
 * @param {string} actionType
 * @returns {function(*, *, {batch: *})}
 */
export function activityCommentLikeList(commentID, refID, actionType) {
  return (dispatch, getState, { batch }) => {
    dispatch(activityIsCommentListLoading(true, refID, commentID));

    api.request('api_comments_likes', { commentID, actionType })
      .send()
      .then((resp) => {
        dispatch(batch(
          {
            type:  ACTIVITY_COMMENT_LIKE_LIST,
            likes: resp.likes,
            refID,
            commentID,
            actionType
          },
          activityIsCommentListLoading(false, refID, commentID)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(activityIsCommentListLoading(false, refID, commentID));
      });
  };
}

/**
 * @param {number} pollID
 * @param {number} answerID
 * @returns {function(*)}
 */
export function activityAnswerPoll(pollID, answerID) {
  return (dispatch) => {
    dispatch(activityIsPollSending(true));

    api.request('api_activities_polls_answer', { pollID, answerID })
      .send()
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
