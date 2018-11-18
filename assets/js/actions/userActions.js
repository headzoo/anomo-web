import md5 from 'md5';
import { objects, browser } from 'utils';
import { formSuccess } from 'actions/formActions';
import { uiIsLoading } from 'actions/uiActions';
import { activityFeedFetchAll, activityTrendingHashtags } from 'actions/activityActions';
import { notificationsFetch } from 'actions/notificationsActions';

export const USER_ERROR            = 'USER_ERROR';
export const USER_SENDING          = 'USER_SENDING';
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
  return (dispatch, getState, { endpoints, proxy }) => {
    const url = endpoints.create('userFollowers', {
      userID,
      page
    });
    proxy.get(url)
      .then((data) => {
        dispatch({
          type:      USER_FOLLOWERS,
          followers: data.ListFollower,
          page
        });
        if (fetchAll && data.CurrentPage < data.TotalPage) {
          dispatch(userFollowers(userID, page + 1, false));
        }
      })
      .catch((error) => {
        console.warn(error);
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
  return (dispatch, getState, { endpoints, proxy }) => {
    const url = endpoints.create('userFollowing', {
      userID,
      page
    });
    proxy.get(url)
      .then((data) => {
        dispatch({
          type:      USER_FOLLOWING,
          following: data.ListFollowing,
          page
        });
        if (fetchAll && data.CurrentPage < data.TotalPage) {
          dispatch(userFollowing(userID, page + 1, true));
        }
      })
      .catch((error) => {
        console.warn(error);
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
      userID
    });
    proxy.get(url)
      .then(() => {
        dispatch(userFollowing(user.getID(), 1, true));
      })
      .catch((error) => {
        console.warn(error);
      });
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function userBlocked(userID) {
  return (dispatch, getState, { endpoints, proxy }) => {
    const url = endpoints.create('userBlocked', {
      userID
    });
    proxy.get(url)
      .then((data) => {
        dispatch({
          type:    USER_BLOCKED,
          blocked: data.results
        });
      })
      .catch((error) => {
        console.warn(error);
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
      userID
    });
    proxy.get(url)
      .then(() => {
        dispatch(userBlocked(user.getID()));
      })
      .catch((error) => {
        console.warn(error);
      });
  };
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {function(*, *, {anomo: *})}
 */
export function userLogin(username, password) {
  return (dispatch, getState, { user, endpoints, batch }) => {
    dispatch(batch(
      userError(''),
      userIsSending(true)
    ));

    user.login(username, password)
      .then((u) => {
        user.isAuthenticated = true;
        endpoints.addDefaultParam('token', user.getToken());
        dispatch(batch(
          {
            type: USER_LOGIN,
            user: u
          },
          activityFeedFetchAll(),
          activityTrendingHashtags(),
          userFollowing(u.UserID, 1, true)
        ));
      })
      .catch((error) => {
        console.warn(error);
        dispatch(userError('Username or password is incorrect.'));
        user.logout(true);
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
  return (dispatch, getState, { user, endpoints, batch }) => {
    dispatch(batch(
      userError(''),
      userIsSending(true)
    ));

    user.facebookLogin(facebookEmail, facebookUserID, accessToken)
      .then((u) => {
        user.isAuthenticated = true;
        endpoints.addDefaultParam('token', user.getToken());
        dispatch(batch(
          {
            type: USER_LOGIN,
            user: u
          },
          activityFeedFetchAll(),
          activityTrendingHashtags(),
          userFollowing(u.UserID, 1, true)
        ));
      })
      .catch((error) => {
        console.warn(error);
        dispatch(userError('Username or password is incorrect.'));
        user.logout(true);
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
  return (dispatch, getState, { user, endpoints, batch }) => {
    const id = user.getID();
    if (id && user.hasToken()) {
      dispatch(batch(
        userError('test'),
        userIsSending(true)
      ));

      user.info(id)
        .then((data) => {
          user.isAuthenticated = true;
          endpoints.addDefaultParam('token', user.getToken());
          dispatch({
            type: USER_LOGIN,
            user: objects.merge(user.getDetails(), data.results)
          });
          dispatch(batch(
            notificationsFetch(),
            activityFeedFetchAll(),
            activityTrendingHashtags(),
            userFollowing(id, 1, true)
          ));
        })
        .catch((error) => {
          console.warn(error);
          user.logout(true);
        })
        .finally(() => {
          dispatch(batch(
            uiIsLoading(false),
            userIsSending(false)
          ));
        });
    } else {
      dispatch(uiIsLoading(false));
    }
  };
}

/**
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {function(*, *, {user: *, proxy: *, endpoints: *})}
 */
export function userUpdatePassword(oldPassword, newPassword) {
  return (dispatch, getState, { proxy, endpoints }) => {
    dispatch(userIsSettingsSending(true));

    const url = endpoints.create('userUpdatePassword');
    const body = {
      OldPassword: md5(oldPassword),
      NewPassword: md5(newPassword)
    };
    proxy.post(url, body)
      .then(() => {
        dispatch(formSuccess('password', 'Password updated successfully.'));
      })
      .catch((error) => {
        console.error(error);
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
  return (dispatch, getState, { proxy, endpoints }) => {
    dispatch(userIsSettingsSending(true));

    const url = endpoints.create('userUpdate');
    proxy.post(url, values)
      .then((data) => {
        dispatch(userSet(data));
      })
      .catch((error) => {
        console.error(error);
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
      userID: user.getID()
    });
    proxy.post(url, values)
      .then(() => {
        const details = objects.merge(user.getDetails(), values);
        user.setDetails(details);
        dispatch(userSet(details));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        dispatch(userIsSettingsSending(false));
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
        userID: user.getID(),
        latitude,
        longitude
      });
      proxy.get(url)
        .then((data) => {
          dispatch({
            type:          USER_SEARCH_RESULTS,
            searchResults: data.results.ListUser || []
          });
        })
        .catch((error) => {
          console.warn(error);
        })
        .finally(() => {
          dispatch(userIsSearchSending(false));
        });
    });
  };
}
