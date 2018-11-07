import { formReset, formError, formSubmitting } from 'actions/formActions';
import { uiIsLoading } from 'actions/uiActions';
import { activityFetch } from 'actions/activityActions';
import { notificationsFetch } from 'actions/notificationsActions';

export const USER_ERROR          = 'USER_ERROR';
export const USER_SENDING        = 'USER_SENDING';
export const USER_STATUS_SENDING = 'USER_STATUS_SENDING';
export const USER_LOGIN          = 'USER_LOGIN';
export const USER_LOGOUT         = 'USER_LOGOUT';
export const USER_FOLLOWERS      = 'USER_FOLLOWERS';
export const USER_FOLLOWING      = 'USER_FOLLOWING';
export const USER_BLOCKED        = 'USER_BLOCKED';

/**
 * @param {string} errorMessage
 * @returns {{type, errorMessage: *}}
 */
export function userError(errorMessage) {
  return {
    type: USER_ERROR,
    errorMessage
  };
}

/**
 * @param {boolean} isSending
 * @returns {{type, isSending: *}}
 */
export function userIsSending(isSending) {
  return {
    type: USER_SENDING,
    isSending
  };
}

/**
 * @param {boolean} isStatusSending
 * @returns {{type, isSending: *}}
 */
export function userIsStatusSending(isStatusSending) {
  return {
    type: USER_STATUS_SENDING,
    isStatusSending
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function userFollowers(userID) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const url = endpoints.create('userFollowers', {
      token: user.getToken(),
      userID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:      USER_FOLLOWERS,
            followers: data.ListFollower
          });
        }
      });
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function userFollowing(userID) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const url = endpoints.create('userFollowing', {
      token: user.getToken(),
      userID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:      USER_FOLLOWING,
            following: data.ListFollowing
          });
        }
      });
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function userFollow(userID) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const url = endpoints.create('userFollow', {
      token: user.getToken(),
      userID
    });
    proxy.get(url)
      .then(() => {
        dispatch(userFollowing(user.getID()));
      });
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function userBlocked(userID) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const url = endpoints.create('userBlocked', {
      token: user.getToken(),
      userID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:    USER_BLOCKED,
            blocked: data.results
          });
        }
      });
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function userBlock(userID) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const url = endpoints.create('userBlock', {
      token: user.getToken(),
      userID
    });
    proxy.get(url)
      .then(() => {
        dispatch(userBlocked(user.getID()));
      });
  };
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {function(*, *, {anomo: *})}
 */
export function userLogin(username, password) {
  return (dispatch, getState, { user }) => {
    dispatch(userIsSending(true));
    dispatch(userError(''));

    user.login(username, password)
      .then((u) => {
        if (u.code && u.code === 'FAIL') {
          dispatch(userError('Username or password is incorrect.'));
        } else {
          dispatch({
            type: USER_LOGIN,
            user: u
          });
          dispatch(userBlocked(u.UserID));
          dispatch(userFollowing(u.UserID));
          dispatch(userFollowers(u.UserID));
          dispatch(activityFetch());
        }
      })
      .finally(() => {
        dispatch(userIsSending(false));
      });
  };
}

/**
 * @returns {function(*, *, {anomo: *})}
 */
export function userLogout() {
  return (dispatch, getState, { user }) => {
    user.logout();
    dispatch({
      type: USER_LOGOUT
    });
  };
}

/**
 * @returns {function(*, *, {anomo: *})}
 */
export function userRefresh() {
  return (dispatch, getState, { user }) => {
    const id = user.getID();
    if (id && user.hasToken()) {
      dispatch(userIsSending(true));
      dispatch(userError(''));

      user.info(id)
        .then((data) => {
          if (data.code === 'OK') {
            dispatch({
              type: USER_LOGIN,
              user: data.results
            });
            dispatch(userBlocked(id));
            dispatch(userFollowing(id));
            dispatch(userFollowers(id));
            dispatch(activityFetch());
            dispatch(notificationsFetch());
          }
        })
        .finally(() => {
          dispatch(userIsSending(false));
          dispatch(uiIsLoading(false));
        });
    } else {
      dispatch(uiIsLoading(false));
    }
  };
}

/**
 * @param {string} message
 * @param {*} photo
 * @returns {function(*, *, {endpoints: *})}
 */
export function userSubmitStatus(message, photo = '') {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    const formName = 'post';

    dispatch(userIsStatusSending(true));
    dispatch(formSubmitting(formName, true));

    let url  = '';
    let body = {};
    if (photo) {
      url = endpoints.create('userPicture', {
        token: user.getToken()
      });
      body = new FormData();
      body.append('PictureCaption', JSON.stringify({ message, message_tags: [] }));
      body.append('Photo', photo);
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
          dispatch(activityFetch(true));
        } else {
          dispatch(formError(formName, 'There was an error.'));
        }
      }).finally(() => {
        dispatch(userIsStatusSending(false));
        dispatch(formSubmitting(formName, false));
      });
  };
}
