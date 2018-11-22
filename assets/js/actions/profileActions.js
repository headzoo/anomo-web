import { redux } from 'utils';
import api from 'api';

export const PROFILE_SENDING       = 'PROFILE_SENDING';
export const PROFILE_POSTS_LOADING = 'PROFILE_POSTS_LOADING';
export const PROFILE_LIKE_LOADING  = 'PROFILE_LIKE_LOADING';
export const PROFILE_LIKE          = 'PROFILE_LIKE';
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
 * @param {boolean} isLoading
 * @param {number} refID
 * @returns {{type: string, isLoading: *}}
 */
export function profileIsLikeLoading(isLoading, refID) {
  return {
    type: PROFILE_LIKE_LOADING,
    isLoading,
    refID
  };
}

/**
 * @param {number} refID
 * @returns {{type: string, refID: *}}
 */
export function profileLikeToggle(refID) {
  return {
    type: PROFILE_LIKE,
    refID
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

/**
 * @param {number} userID
 * @returns {function(*, *, {user: *})}
 */
export function profileFetch(userID) {
  return (dispatch, getState, { batch }) => {
    dispatch(profileIsSending(true));

    api.request('api_users_fetch', { userID })
      .send()
      .then((resp) => {
        dispatch(batch(
          {
            type:    PROFILE_FETCH,
            profile: resp.results
          },
          profileIsSending(false)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(profileIsSending(false));
      });
  };
}

/**
 * @param {number} userID
 * @param {boolean} refresh
 * @returns {function(*, *, {batch: *})}
 */
export function profilePosts(userID, refresh = false) {
  return (dispatch, getState, { batch }) => {
    dispatch(profileIsPostsLoading(true));

    let lastActivityID = 0;
    if (!refresh) {
      lastActivityID = getState().profile.lastActivityID; // eslint-disable-line
    }

    api.request('api_feeds_user', { userID, lastActivityID })
      .send()
      .then((data) => {
        dispatch(batch(
          {
            type:       PROFILE_POSTS_FETCH,
            activities: data.Activities,
            isLastPage: data.Activities.length < 10,
            refresh
          },
          profileIsPostsLoading(false)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(profileIsPostsLoading(false));
      });
  };
}

/**
 * @param {number} userID
 * @param {number} page
 * @param {boolean} fetchAll
 * @returns {function(*)}
 */
export function profileFollowers(userID, page = 1, fetchAll = false) {
  return (dispatch) => {
    api.request('api_users_followers', { userID, page })
      .send()
      .then((resp) => {
        dispatch({
          type:      PROFILE_FOLLOWERS,
          followers: resp.ListFollower,
          page
        });
        if (fetchAll && resp.CurrentPage < resp.TotalPage) {
          dispatch(profileFollowers(userID, page + 1));
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
export function profileFollowing(userID, page = 1, fetchAll = false) {
  return (dispatch) => {
    api.request('api_users_following', { userID, page })
      .send()
      .then((resp) => {
        dispatch({
          type:      PROFILE_FOLLOWING,
          following: resp.ListFollowing,
          page
        });
        if (fetchAll && resp.CurrentPage < resp.TotalPage) {
          dispatch(profileFollowing(userID, page + 1));
        }
      })
      .catch(redux.actionCatch);
  };
}
