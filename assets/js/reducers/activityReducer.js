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
function get(state, action) {
  const activities = action.activities.slice(0).map((a) => {
    if (a.Message) {
      a.Message = JSON.parse(a.Message);
    }
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
export default function activityReducer(state = {}, action = {}) {
  switch (action.type) {
    case types.ACTIVITY_LOADING:
      return loading(state, action);
    case types.ACTIVITY_GET:
      return get(state, action);
    default: return state;
  }
}
