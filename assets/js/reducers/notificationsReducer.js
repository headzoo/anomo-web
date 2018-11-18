import * as types from 'actions/notificationsActions';
import { objects, redux } from 'utils';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function fetch(state, action) {
  const notifications = objects.clone(action.notifications).reverse();

  return {
    ...state,
    notifications,
    newNumber: notifications.length
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
    notifications,
    newNumber: notifications.length
  };
}

/**
 * @param {*} state
 * @returns {*}
 */
function readAll(state) {
  return {
    ...state,
    notifications: [],
    newNumber:     0
  };
}

export default redux.createReducer({
  [types.NOTIFICATIONS_FETCH]:    fetch,
  [types.NOTIFICATIONS_READ]:     read,
  [types.NOTIFICATIONS_READ_ALL]: readAll
});
