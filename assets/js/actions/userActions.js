export const USER_ERROR   = 'USER_ERROR';
export const USER_SENDING = 'USER_SENDING';
export const USER_LOGIN   = 'USER_LOGIN';
export const USER_LOGOUT  = 'USER_LOGOUT';

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
          }
        })
        .finally(() => {
          dispatch(userIsSending(false));
        });
    }
  };
}
