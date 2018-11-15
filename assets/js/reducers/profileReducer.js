import * as types from 'actions/profileActions';
import { objects, redux } from 'utils';
import anomo from 'anomo';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function sending(state, action) {
  return {
    ...state,
    isSending: action.isSending
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function postsLoading(state, action) {
  return {
    ...state,
    isPostsLoading: action.isPostsLoading
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function fetch(state, action) {
  const profile = objects.merge(state, action.profile);
  profile.AboutMe = anomo.activities.unescapeUnicode(profile.AboutMe);

  return profile;
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function followers(state, action) {
  let newFollowers = [];
  if (action.page === 1) {
    newFollowers = action.followers.slice(0);
  } else {
    newFollowers = state.followers.slice(0).concat(action.followers.slice(0));
  }

  return {
    ...state,
    followers: newFollowers
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function following(state, action) {
  let newFollowing = [];
  if (action.page === 1) {
    newFollowing = action.following.slice(0);
  } else {
    newFollowing = state.following.slice(0).concat(action.following.slice(0));
  }

  return {
    ...state,
    following: newFollowing
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function postsFetch(state, action) {
  const newActivities = action.activities.slice(0).map((a) => {
    return anomo.activities.sanitizeActivity(a);
  });
  const newImageActivities = objects.clone(state.imageActivities);

  let activities      = [];
  let imageActivities = [];

  if (action.refresh) {
    activities = newActivities;
    imageActivities = newActivities.filter((a) => {
      return !!a.Image;
    });
  } else {
    activities = objects.clone(state.activities).concat(newActivities);
    imageActivities = objects.clone(newImageActivities).concat(newActivities.filter((a) => {
      return !!a.Image;
    }));
  }

  let lastActivityID = 0;
  const lastActivity = activities[activities.length - 1];
  if (lastActivity) {
    lastActivityID = lastActivity.ActivityID;
  }

  return {
    ...state,
    activities,
    imageActivities,
    lastActivityID,
    isLastPage: action.isLastPage
  };
}

/**
 * @param {*} state
 * @returns {*}
 */
function postsReset(state) {
  return {
    ...state,
    activities:      [],
    imageActivities: [],
    lastActivityID:  0,
    isLastPage:      false
  };
}

export default redux.createReducer({
  [types.PROFILE_SENDING]:       sending,
  [types.PROFILE_POSTS_LOADING]: postsLoading,
  [types.PROFILE_FETCH]:         fetch,
  [types.PROFILE_POSTS_FETCH]:   postsFetch,
  [types.PROFILE_FOLLOWING]:     following,
  [types.PROFILE_FOLLOWERS]:     followers,
  [types.PROFILE_POSTS_RESET]:   postsReset
});
