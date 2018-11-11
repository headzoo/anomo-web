export const PROFILE_SENDING       = 'PROFILE_SENDING';
export const PROFILE_POSTS_LOADING = 'PROFILE_POSTS_LOADING';
export const PROFILE_FETCH         = 'PROFILE_FETCH';
export const PROFILE_POSTS_FETCH   = 'PROFILE_POSTS_FETCH';
export const PROFILE_POSTS_RESET   = 'PROFILE_POSTS_RESET';
export const PROFILE_FOLLOWERS     = 'PROFILE_FOLLOWERS';
export const PROFILE_FOLLOWING     = 'PROFILE_FOLLOWING';

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
 * @param {boolean} isPostsLoading
 * @returns {{type: string, isPostsLoading: *}}
 */
export function profileIsPostsLoading(isPostsLoading) {
  return {
    type: PROFILE_POSTS_LOADING,
    isPostsLoading
  };
}

/**
 * @param {number} userID
 * @returns {function(*, *, {user: *})}
 */
export function profileFetch(userID) {
  return (dispatch, getState, { user }) => {
    dispatch(profileIsSending(true));

/*    const profile = JSON.parse(localStorage.getItem('profile'));
    dispatch({
      type: PROFILE_FETCH,
      profile
    });
    dispatch(profileIsSending(false));
    return;*/

    user.info(userID)
      .then((data) => {
        // localStorage.setItem('profile', JSON.stringify(data.results));
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

/**
 * @param {number} userID
 * @param {boolean} refresh
 * @returns {function(*, *, {user: *, proxy: *, endpoints: *})}
 */
export function profilePosts(userID, refresh = false) {
  return (dispatch, getState, { user, proxy, endpoints }) => {
    dispatch(profileIsPostsLoading(true));

    let lastActivityID = 0;
    if (!refresh) {
      lastActivityID = getState().profile.lastActivityID; // eslint-disable-line
    }

    const url = endpoints.create('profilePosts', {
      token: user.getToken(),
      lastActivityID,
      userID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:       PROFILE_POSTS_FETCH,
            activities: data.Activities,
            isLastPage: data.Activities.length < 10,
            refresh
          });
        }
      })
      .finally(() => {
        dispatch(profileIsPostsLoading(false));
      });
  };
}

/**
 * @param {number} userID
 * @param {number} page
 * @param {boolean} fetchAll
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function profileFollowers(userID, page = 1, fetchAll = false) {
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
            type:      PROFILE_FOLLOWERS,
            followers: data.ListFollower,
            page
          });
          if (fetchAll && data.CurrentPage < data.TotalPage) {
            dispatch(profileFollowers(userID, page + 1));
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
export function profileFollowing(userID, page = 1, fetchAll = false) {
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
            type:      PROFILE_FOLLOWING,
            following: data.ListFollowing,
            page
          });
          if (fetchAll && data.CurrentPage < data.TotalPage) {
            dispatch(profileFollowing(userID, page + 1));
          }
        }
      });
  };
}

/**
 * @returns {{type: string}}
 */
export function profilePostsReset() {
  return {
    type: PROFILE_POSTS_RESET
  };
}
