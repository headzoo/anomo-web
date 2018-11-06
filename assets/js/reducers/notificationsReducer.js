import * as types from 'actions/notificationsActions';
import { objects } from 'utils';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function fetch(state, action) {
  return {
    ...state,
    notifications: objects.clone(action.notifications),
    newNumber:     action.newNumber
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function notificationsReducer(state = {}, action = {}) {
  switch (action.type) {
    case types.NOTIFICATIONS_FETCH:
      return fetch(state, action);
    default: return state;
  }
}
