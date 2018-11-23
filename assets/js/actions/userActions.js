import { objects, browser, redux } from 'utils';
import { formSuccess } from 'actions/formActions';
import { uiIsLoading } from 'actions/uiActions';
import { activityFeedFetchAll, activityTrendingHashtags, activityIntervalStart } from 'actions/activityActions';
import { notificationsFetch, notificationsIntervalStart } from 'actions/notificationsActions';
import api from 'api';

export const USER_ERROR              = 'USER_ERROR';
export const USER_SENDING            = 'USER_SENDING';
export const USER_SETTINGS_SENDING   = 'USER_SETTINGS_SENDING';
export const USER_SEARCH_SENDING     = 'USER_SEARCH_SENDING';
export const USER_LOGIN              = 'USER_LOGIN';
export const USER_LOGOUT             = 'USER_LOGOUT';
export const USER_SET                = 'USER_SET';
export const USER_FOLLOWERS          = 'USER_FOLLOWERS';
export const USER_FOLLOWING          = 'USER_FOLLOWING';
export const USER_BLOCKED            = 'USER_BLOCKED';
export const USER_BLOCKED_LOADING    = 'USER_BLOCKED_LOADING';
export const USER_BLOCKED_SUBMITTING = 'USER_BLOCKED_SUBMITTING';
export const USER_SEARCH_RESULTS     = 'USER_SEARCH_RESULTS';

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
 * @returns {function(*)}
 */
export function userFollowers(userID, page = 1, fetchAll = false) {
  return (dispatch) => {
    api.request('api_users_followers', { userID, page })
      .send()
      .then((resp) => {
        dispatch({
          type:      USER_FOLLOWERS,
          followers: resp.ListFollower,
          page
        });
        if (fetchAll && resp.CurrentPage < resp.TotalPage) {
          dispatch(userFollowers(userID, page + 1, false));
        }
      })
      .catch(redux.actionCatch);
  };
}

/**
 * @param {number} userID
 * @param {number} page
 * @param {boolean} fetchAll
 * @returns {function(*)}
 */
export function userFollowing(userID, page = 1, fetchAll = false) {
  return (dispatch) => {
    api.request('api_users_following', { userID, page })
      .send()
      .then((resp) => {
        dispatch({
          type:      USER_FOLLOWING,
          following: resp.ListFollowing,
          page
        });
        if (fetchAll && resp.CurrentPage < resp.TotalPage) {
          dispatch(userFollowing(userID, page + 1, true));
        }
      })
      .catch(redux.actionCatch);
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *)}
 */
export function userFollow(userID) {
  return (dispatch, getState) => {
    const { user } = getState();

    api.request('api_users_follow', { userID })
      .send()
      .then(() => {
        dispatch(userFollowing(user.UserID, 1, true));
      })
      .catch(redux.actionCatch);
  };
}

/**
 * @param {boolean} isBlockedLoading
 * @returns {{type: string, isBlockedLoading: *}}
 */
export function userBlockedIsLoading(isBlockedLoading) {
  return {
    type: USER_BLOCKED_LOADING,
    isBlockedLoading
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {batch: *})}
 */
export function userBlocked(userID = 0) {
  return (dispatch, getState, { batch }) => {
    const { user } = getState();

    dispatch(userBlockedIsLoading(true));

    api.request('api_users_blocked', {
      userID: userID || user.UserID
    })
      .send()
      .then((resp) => {
        dispatch(batch(
          {
            type:    USER_BLOCKED,
            blocked: resp.results
          },
          userBlockedIsLoading(false)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(userBlockedIsLoading(false));
      });
  };
}


/**
 * @param {boolean} isBlockedSubmitting
 * @returns {{type: string, isBlockedLoading: *}}
 */
export function userBlockedIsSubmitting(isBlockedSubmitting) {
  return {
    type: USER_BLOCKED_SUBMITTING,
    isBlockedSubmitting
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {batch: *})}
 */
export function userBlock(userID) {
  return (dispatch, getState, { batch }) => {
    dispatch(userBlockedIsSubmitting(true));

    api.request('api_users_block')
      .send({ userID })
      .then(() => {
        dispatch(batch(
          userBlocked(userID),
          userBlockedIsSubmitting(false)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(userBlockedIsSubmitting(false));
      });
  };
}

/**
 * @param {*} user
 * @returns {function(*, *, {batch: *})}
 */
export function userStart(user) {
  return (dispatch, getState, { batch }) => {
    api.setToken(user.token);
    api.setUserID(user.UserID);

    dispatch({
      type: USER_LOGIN,
      user
    });
    dispatch(activityFeedFetchAll());
    dispatch(notificationsFetch());
    dispatch(userFollowing(user.UserID, 1, true));
    dispatch(activityTrendingHashtags());
    dispatch(batch(
      activityIntervalStart(),
      notificationsIntervalStart()
    ));
  };
}

/**
 * @returns {function(*, *, {anomo: *})}
 */
export function userLogout() {
  return (dispatch) => {
    api.request('api_users_logout')
      .send()
      .finally(() => {
        api.deleteToken();
        api.deleteUserID();
        dispatch({
          type: USER_LOGOUT
        });
      });
  };
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {function(*, *, {anomo: *})}
 */
export function userLogin(username, password) {
  return (dispatch, getState, { batch }) => {
    dispatch(batch(
      userError(''),
      userIsSending(true)
    ));

    api.request('api_users_login')
      .send({
        UserName: username,
        Password: password
      })
      .then((resp) => {
        api.setDetails(resp);
        dispatch(userStart(resp));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(userLogout());
        dispatch(userError('Username or password is incorrect.'));
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
  return (dispatch, getState, { batch }) => {
    dispatch(batch(
      userError(''),
      userIsSending(true)
    ));

    api.request('api_users_login_facebook')
      .send({
        Email:         facebookEmail,
        FacebookID:    facebookUserID,
        FbAccessToken: accessToken
      })
      .then((resp) => {
        api.setDetails(resp);
        dispatch(userStart(resp));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(userLogout());
        dispatch(userError('Username or password is incorrect.'));
      })
      .finally(() => {
        dispatch(userIsSending(false));
      });
  };
}

/**
 * @returns {function(*, *, {anomo: *})}
 */
export function userRefresh() {
  return (dispatch, getState, { batch }) => {
    const token  = api.getToken();
    const userID = api.getUserID();

    if (userID && token) {
      dispatch(batch(
        userError('test'),
        userIsSending(true)
      ));

      api.request('api_users_fetch', { userID })
        .send()
        .then((resp) => {
          const user = objects.merge(api.getDetails(), resp.results, {
            token
          });
          dispatch(userStart(user));
        })
        .catch((error) => {
          redux.actionCatch(error);
          dispatch(userLogout());
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
 * @returns {function(*, *, {batch: *})}
 */
export function userUpdatePassword(oldPassword, newPassword) {
  return (dispatch, getState, { batch }) => {
    const { user } = getState();

    dispatch(userIsSettingsSending(true));

    api.request('api_users_password', { userID: user.UserID })
      .send({
        OldPassword: oldPassword,
        NewPassword: newPassword
      })
      .then(() => {
        dispatch(batch(
          userIsSettingsSending(false),
          formSuccess('password', 'Password updated successfully.')
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(userIsSettingsSending(false));
      });
  };
}

/**
 * @param {*} values
 * @returns {function(*, *, {batch: *})}
 */
export function userUpdateSettings(values) {
  return (dispatch, getState, { batch }) => {
    const { user } = getState();

    dispatch(userIsSettingsSending(true));

    api.request('api_users_update', { userID: user.UserID })
      .send(values)
      .then((resp) => {
        dispatch(batch(
          userSet(resp),
          userIsSettingsSending(false)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(userIsSettingsSending(false));
      });
  };
}

/**
 * @param {*} values
 * @returns {function(*, *, {batch: *})}
 */
export function userUpdatePrivacy(values) {
  return (dispatch, getState, { batch }) => {
    const { user } = getState();

    dispatch(userIsSettingsSending(true));

    api.request('api_users_privacy', { userID: user.UserID })
      .send(values)
      .then(() => {
        dispatch(batch(
          userSet(values),
          userIsSettingsSending(false)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(userIsSettingsSending(false));
      });
  };
}

/**
 * @returns {function(*=, *, {batch?: *})}
 */
export function userSearch() {
  return (dispatch, getState, { batch }) => {
    const { user } = getState();

    /**
     * @param {number} latitude
     * @param {number} longitude
     */
    browser.position((latitude, longitude) => {
      dispatch(userIsSearchSending(true));

      api.request('api_search_users', {
        userID: user.UserID,
        latitude,
        longitude
      })
        .send()
        .then((resp) => {
          dispatch(batch(
            {
              type:          USER_SEARCH_RESULTS,
              searchResults: resp.results.ListUser || []
            },
            userIsSearchSending(false)
          ));
        })
        .catch((error) => {
          redux.actionCatch(error);
          dispatch(userIsSearchSending(false));
        });
    });
  };
}
