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
    notifications: objects.clone(action.notifications).reverse(),
    newNumber:     action.newNumber
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function read(state, action) {
  const notifications = objects.clone(state.notifications).filter((n) => {
    return n.ID !== action.notificationID;
  });

  return {
    ...state,
    newNumber: notifications.length,
    notifications
  };
}

/**
 * @param {*} state
 * @returns {*}
 */
function readAll(state) {
  return {
    ...state,
    newNumber:     0,
    notifications: []
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
    case types.NOTIFICATIONS_READ:
      return read(state, action);
    case types.NOTIFICATIONS_READ_ALL:
      return readAll(state);
    default: return state;
  }
}
