import axios from 'axios';
import Favico from 'favico.js';
import { formReset, formError, formSubmitting } from 'actions/formActions';

export const ACTIVITY_LOADING              = 'ACTIVITY_LOADING';
export const ACTIVITY_REFRESHING           = 'ACTIVITY_REFRESHING';
export const ACTIVITY_LIKE_LOADING         = 'ACTIVITY_LIKE_LOADING';
export const ACTIVITY_LIKE_COMMENT_LOADING = 'ACTIVITY_LIKE_COMMENT_LOADING';
export const ACTIVITY_COMMENTS_LOADING     = 'ACTIVITY_COMMENTS_LOADING';
export const ACTIVITY_COMMENT_SENDING      = 'ACTIVITY_COMMENT_SENDING';
export const ACTIVITY_DELETE_SENDING       = 'ACTIVITY_DELETE_SENDING';
export const ACTIVITY_NEW_NUMBER           = 'ACTIVITY_NEW_NUMBER';
export const ACTIVITY_FETCH                = 'ACTIVITY_FETCH';
export const ACTIVITY_SET                  = 'ACTIVITY_SET';
export const ACTIVITY_RESET                = 'ACTIVITY_RESET';
export const ACTIVITY_DELETE               = 'ACTIVITY_DELETE';
export const ACTIVITY_SHARE                = 'ACTIVITY_SHARE';
export const ACTIVITY_REPORT               = 'ACTIVITY_REPORT';

const { CancelToken } = axios;
const favicon = new Favico({
  animation: 'popFade'
});

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
 * @param {boolean} isRefreshing
 * @returns {{type, isLoading: *}}
 */
export function activityIsRefreshing(isRefreshing) {
  return {
    type: ACTIVITY_REFRESHING,
    isRefreshing
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
 * @returns {{type: string}}
 */
export function activityReset() {
  return {
    type: ACTIVITY_RESET
  };
}


let activityFetchSource = null;

/**
 * @param {boolean} refresh
 * @returns {function(*, *, {anomo: *})}
 */
export function activityFetch(refresh = false) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityIsLoading(true));
    if (refresh) {
      dispatch(activityIsRefreshing(true));
    }

    if (activityFetchSource) {
      activityFetchSource.cancel();
    }
    activityFetchSource = CancelToken.source();

    let lastActivityID = 0;
    if (!refresh) {
      lastActivityID = getState().activity.lastActivityID; // eslint-disable-line
    }
    const url = endpoints.create('activityFetch', {
      token: user.getToken(),
      lastActivityID
    });
    const config = {
      cancelToken: activityFetchSource.token
    };
    proxy.get(url, config)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:       ACTIVITY_FETCH,
            activities: data.Activities,
            refresh
          });
          dispatch({
            type:      ACTIVITY_NEW_NUMBER,
            newNumber: 0
          });
          favicon.badge(0);
        }
      })
      .finally(() => {
        activityFetchSource = null;
        dispatch(activityIsLoading(false));
        if (refresh) {
          dispatch(activityIsRefreshing(false));
        }
      });
  };
}

let activityNewNumberSource = null;

/**
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function activityNewNumber() {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const { firstActivityID } = getState().activity;

    if (firstActivityID === 0) {
      dispatch({
        type:      ACTIVITY_NEW_NUMBER,
        newNumber: 0
      });
      return;
    }

    if (activityNewNumberSource) {
      activityNewNumberSource.cancel();
    }
    activityNewNumberSource = CancelToken.source();

    const url = endpoints.create('activityFetch', {
      token:          user.getToken(),
      lastActivityID: 0
    });
    const config = {
      cancelToken: activityNewNumberSource.token
    };
    proxy.get(url, config)
      .then((data) => {
        if (data.code === 'OK') {
          let newNumber = 0;
          for (let i = 0; i < data.Activities.length; i++) {
            if (data.Activities[i].ActivityID > firstActivityID) {
              newNumber += 1;
            }
          }
          dispatch({
            type: ACTIVITY_NEW_NUMBER,
            newNumber
          });
          favicon.badge(newNumber);
        }
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          throw err;
        }
      })
      .finally(() => {
        activityNewNumberSource = null;
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
 * @param {number} commentID
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function activityLikeComment(commentID, refID, actionType) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityIsLikeCommentLoading(true, commentID));

    const url = endpoints.create('activityCommentLike', {
      token: user.getToken(),
      commentID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch(activityGet(refID, actionType));
        }
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
 * @returns {function(*)}
 */
export function activityIntervalStart() {
  return (dispatch) => {
    dispatch(activityNewNumber());
    setInterval(() => {
      dispatch(activityNewNumber());
    }, 30000);
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
