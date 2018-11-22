import * as constants from 'anomo/constants';
import api from 'api';

export const NOTIFICATIONS_FETCH    = 'NOTIFICATIONS_FETCH';
export const NOTIFICATIONS_READ     = 'NOTIFICATIONS_READ';
export const NOTIFICATIONS_READ_ALL = 'NOTIFICATIONS_READ_ALL';

let isClearing = false;

/**
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function notificationsFetch() {
  return (dispatch, getState) => {
    const { user } = getState();

    if (isClearing || !user.isAuthenticated) {
      return;
    }

    api.request('api_notifications_fetch', {
      status: constants.NOTIFICATION_STATUS_UNREAD,
      page:   1
    })
      .get()
      .then((resp) => {
        dispatch({
          type:          NOTIFICATIONS_FETCH,
          notifications: resp.NotificationHistory
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

/**
 * @param {number} notificationID
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function notificationsRead(notificationID) {
  return (dispatch) => {
    isClearing = true;
    dispatch({
      type: NOTIFICATIONS_READ,
      notificationID
    });

    api.request('api_notifications_delete', { notificationID })
      .delete()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        isClearing = false;
      });
  };
}

/**
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function notificationsReadAll() {
  return (dispatch) => {
    isClearing = true;
    dispatch({
      type: NOTIFICATIONS_READ_ALL
    });

    api.request('api_notifications_fetch', {
      status: constants.NOTIFICATION_STATUS_READ,
      page:   1
    })
      .get()
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        isClearing = false;
      });
  };
}

/**
 * @returns {function(*)}
 */
export function notificationsIntervalStart() {
  return (dispatch) => {
    setInterval(() => {
      dispatch(notificationsFetch());
    }, 30000);
  };
}
