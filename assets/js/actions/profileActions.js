export const PROFILE_SENDING = 'PROFILE_SENDING';
export const PROFILE_FETCH   = 'PROFILE_FETCH';

/**
 * @param {boolean} isSending
 * @returns {{type, isSending: *}}
 */
export function profileIsSending(isSending) {
  return {
    type: PROFILE_SENDING,
    isSending
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {user: *})}
 */
export function profileFetch(userID) {
  return (dispatch, getState, { user }) => {
    dispatch(profileIsSending(true));

    user.info(userID)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:    PROFILE_FETCH,
            profile: data.results
          });
        }
      }).finally(() => {
        dispatch(profileIsSending(false));
      });
  };
}
