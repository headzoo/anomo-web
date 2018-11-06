import { formReset, formError, formSubmitting } from 'actions/formActions';

export const ACTIVITY_LOADING          = 'ACTIVITY_LOADING';
export const ACTIVITY_LIKE_LOADING     = 'ACTIVITY_LIKE_LOADING';
export const ACTIVITY_COMMENTS_LOADING = 'ACTIVITY_COMMENTS_LOADING';
export const ACTIVITY_COMMENT_SENDING  = 'ACTIVITY_COMMENT_SENDING';
export const ACTIVITY_FETCH            = 'ACTIVITY_FETCH';
export const ACTIVITY_SET              = 'ACTIVITY_SET';
export const ACTIVITY_RESET            = 'ACTIVITY_RESET';

/**
 * @param {boolean} isLoading
 * @returns {{type, isLoading: *}}
 */
export function activityIsLoading(isLoading) {
  return {
    type: ACTIVITY_LOADING,
    isLoading
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
 * @returns {{type: string}}
 */
export function activityReset() {
  return {
    type: ACTIVITY_RESET
  };
}

/**
 * @param {boolean} refresh
 * @returns {function(*, *, {anomo: *})}
 */
export function activityFetch(refresh = false) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityIsLoading(true));

    let lastActivityID = 0;
    if (!refresh) {
      lastActivityID = getState().activity.lastActivityID; // eslint-disable-line
    }
    const url = endpoints.create('activityFetch', {
      token: user.getToken(),
      lastActivityID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:       ACTIVITY_FETCH,
            activities: data.Activities,
            refresh
          });
        }
      })
      .finally(() => {
        dispatch(activityIsLoading(false));
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
    dispatch(activityIsLoading(true));

    const url = endpoints.create('activityGet', {
      token: user.getToken(),
      actionType,
      refID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch(activitySet(data.Activity));
        }
      })
      .finally(() => {
        dispatch(activityIsLoading(false));
        dispatch(activityIsCommentsLoading(false));
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
      })
      .finally(() => {
        dispatch(activityIsLikeLoading(false, refID));
      });
  };
}

/**
 * @param {string} message
 * @param {number} refID
 * @param {number} actionType
 * @param {number} topicID
 * @param {number} isAnonymous
 * @returns {function(*, *, {endpoints: *})}
 */
export function activitySubmitComment(message, refID, actionType, topicID, isAnonymous = 0) {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    const formName = 'post';

    dispatch(activityIsCommentSending(true));
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
      if (resp.code === 'OK') {
        dispatch(formReset(formName));
        dispatch(activityIsCommentsLoading(true));
        dispatch(activityGet(refID, actionType));
      } else {
        dispatch(formError(formName, 'There was an error.'));
      }
    }).finally(() => {
      dispatch(activityIsCommentSending(false));
      dispatch(formSubmitting(formName, false));
    });
  };
}
