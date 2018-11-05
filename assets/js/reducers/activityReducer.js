import * as types from 'actions/activityActions';
import objects from 'utils/objects';


/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function loading(state, action) {
  return {
    ...state,
    isLoading: action.isLoading
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function likeLoading(state, action) {
  const activity = objects.merge(state.activity, {
    LikeIsLoading: action.isLoading
  });

  return {
    ...state,
    activity
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function get(state, action) {
  const activities = action.activities.slice(0).map((a) => {
    if (a.Message) {
      a.Message = JSON.parse(a.Message);
    }
    a.LikeIsLoading = false;
    return a;
  });

  return {
    ...state,
    activities,
    page:       action.page,
    totalPages: action.totalPages,
    radius:     action.radius
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function set(state, action) {
  const activity = objects.clone(action.activity);
  if (activity.Message && typeof activity.Message === 'string') {
    activity.Message = JSON.parse(activity.Message);
  }
  activity.LikeIsLoading = false;

  return {
    ...state,
    activity
  };
}

/**
 * @param {*} state
 * @returns {*}
 */
function reset(state) {
  return {
    ...state,
    activity: {}
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function activityReducer(state = {}, action = {}) {
  switch (action.type) {
    case types.ACTIVITY_LOADING:
      return loading(state, action);
    case types.ACTIVITY_LIKE_LOADING:
      return likeLoading(state, action);
    case types.ACTIVITY_GET:
      return get(state, action);
    case types.ACTIVITY_SET:
      return set(state, action);
    case types.ACTIVITY_RESET:
      return reset(state);
    default: return state;
  }
}
