import md5 from 'md5';
import { objects, browser } from 'utils';
import { formReset, formError, formSuccess, formSubmitting } from 'actions/formActions';
import { uiIsLoading } from 'actions/uiActions';
import { activityFeedFetchAll } from 'actions/activityActions';
import { notificationsFetch } from 'actions/notificationsActions';

export const USER_ERROR            = 'USER_ERROR';
export const USER_SENDING          = 'USER_SENDING';
export const USER_STATUS_SENDING   = 'USER_STATUS_SENDING';
export const USER_SETTINGS_SENDING = 'USER_SETTINGS_SENDING';
export const USER_SEARCH_SENDING   = 'USER_SEARCH_SENDING';
export const USER_LOGIN            = 'USER_LOGIN';
export const USER_LOGOUT           = 'USER_LOGOUT';
export const USER_SET              = 'USER_SET';
export const USER_FOLLOWERS        = 'USER_FOLLOWERS';
export const USER_FOLLOWING        = 'USER_FOLLOWING';
export const USER_BLOCKED          = 'USER_BLOCKED';
export const USER_SEARCH_RESULTS   = 'USER_SEARCH_RESULTS';

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
 * @param {boolean} isSettingSending
 * @returns {{type: string, isSettingSending: *}}
 */
export function userIsSettingsSending(isSettingSending) {
  return {
    type: USER_SETTINGS_SENDING,
    isSettingSending
  };
}

/**
 * @param {boolean} isSearchSending
 * @returns {{type: string, isSearchSending: *}}
 */
export function userIsSearchSending(isSearchSending) {
  return {
    type: USER_SEARCH_SENDING,
    isSearchSending
  };
}

/**
 * @param {number} userID
 * @param {number} page
 * @param {boolean} fetchAll
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function userFollowers(userID, page = 1, fetchAll = false) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const url = endpoints.create('userFollowers', {
      token: user.getToken(),
      userID,
      page
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:      USER_FOLLOWERS,
            followers: data.ListFollower,
            page
          });
          if (fetchAll && data.CurrentPage < data.TotalPage) {
            dispatch(userFollowers(userID, page + 1, false));
          }
        }
      });
  };
}

/**
 * @param {number} userID
 * @param {number} page
 * @param {boolean} fetchAll
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function userFollowing(userID, page = 1, fetchAll = false) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const url = endpoints.create('userFollowing', {
      token: user.getToken(),
      userID,
      page
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:      USER_FOLLOWING,
            following: data.ListFollowing,
            page
          });
          if (fetchAll && data.CurrentPage < data.TotalPage) {
            dispatch(userFollowing(userID, page + 1, true));
          }
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
        dispatch(userFollowing(user.getID(), 1, true));
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
          user.logout(true);
        } else {
          dispatch({
            type: USER_LOGIN,
            user: u
          });

          dispatch(activityFeedFetchAll());
          dispatch(userFollowing(u.UserID), 1, true);
        }
      })
      .finally(() => {
        dispatch(userIsSending(false));
      });
  };
}

/**
 * @param {string} facebookEmail
 * @param {string} facebookUserID
 * @param {string} accessToken
 * @returns {function(*, *, {user: *})}
 */
export function userFacebookLogin(facebookEmail, facebookUserID, accessToken) {
  return (dispatch, getState, { user }) => {
    dispatch(userIsSending(true));
    dispatch(userError(''));

    user.facebookLogin(facebookEmail, facebookUserID, accessToken)
      .then((u) => {
        dispatch({
          type: USER_LOGIN,
          user: u
        });

        dispatch(activityFeedFetchAll());
        dispatch(userFollowing(u.UserID), 1, true);
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
              user: objects.merge(user.getDetails(), data.results)
            });

            dispatch(activityFeedFetchAll());
            dispatch(notificationsFetch());
            dispatch(userFollowing(id, 1, true));
          } else {
            user.logout(true);
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
 * @param {*} user
 * @returns {{type: string, user: *}}
 */
export function userSet(user) {
  return {
    type: USER_SET,
    user
  };
}

/**
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {function(*, *, {user: *, proxy: *, endpoints: *})}
 */
export function userUpdatePassword(oldPassword, newPassword) {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    dispatch(userIsSettingsSending(true));

    const url = endpoints.create('userUpdatePassword', {
      token: user.getToken()
    });
    const body = {
      OldPassword: md5(oldPassword),
      NewPassword: md5(newPassword)
    };
    proxy.post(url, body)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch(formSuccess('password', 'Password updated successfully.'));
        }
      })
      .finally(() => {
        dispatch(userIsSettingsSending(false));
      });
  };
}

/**
 * @param {*} values
 * @returns {function(*, *, {user: *, proxy: *, endpoints: *})}
 */
export function userUpdateSettings(values) {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    dispatch(userIsSettingsSending(true));

    const url = endpoints.create('userUpdate', {
      token: user.getToken()
    });
    proxy.post(url, values)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch(userSet(data));
        }
      })
      .finally(() => {
        dispatch(userIsSettingsSending(false));
      });
  };
}

/**
 * @param {*} values
 * @returns {function(*, *, {user: *, proxy: *, endpoints: *})}
 */
export function userUpdatePrivacy(values) {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    dispatch(userIsSettingsSending(true));

    const url = endpoints.create('userUpdatePrivacy', {
      token:  user.getToken(),
      userID: user.getID()
    });
    proxy.post(url, values)
      .then((data) => {
        if (data.code === 'OK') {
          const details = objects.merge(user.getDetails(), values);
          user.setDetails(details);
          dispatch(userSet(details));
        }
      })
      .finally(() => {
        dispatch(userIsSettingsSending(false));
      });
  };
}

/**
 * @param {string} formName
 * @param {string} message
 * @param {*} photo
 * @returns {function(*, *, {endpoints: *})}
 */
export function userSubmitStatus(formName, message, photo = '') {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    dispatch(userIsStatusSending(true));
    dispatch(formSubmitting(formName, true));
/*    setTimeout(() => {
      dispatch(formReset(formName));
      dispatch(userIsStatusSending(false));
    });*/

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
          dispatch(activityFeedFetchAll(true));
        } else {
          dispatch(formError(formName, 'There was an error.'));
        }
      }).finally(() => {
        dispatch(userIsStatusSending(false));
      });
  };
}

/**
 * @returns {function(*=, *, {user: *, proxy: *, endpoints: *})}
 */
export function userSearch() {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    /**
     * @param {number} latitude
     * @param {number} longitude
     */
    browser.position((latitude, longitude) => {
      dispatch(userIsSearchSending(true));

      const url = endpoints.create('userSearch', {
        token:  user.getToken(),
        userID: user.getID(),
        latitude,
        longitude
      });
      proxy.get(url)
        .then((data) => {
          if (data.code === 'OK') {
            dispatch({
              type:          USER_SEARCH_RESULTS,
              searchResults: data.results.ListUser || []
            });
          }
        })
        .finally(() => {
          dispatch(userIsSearchSending(false));
        });
    });
  };
}
