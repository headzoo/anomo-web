import Favico from 'favico.js';
import * as constants from 'anomo/constants';

export const NOTIFICATIONS_FETCH    = 'NOTIFICATIONS_FETCH';
export const NOTIFICATIONS_READ     = 'NOTIFICATIONS_READ';
export const NOTIFICATIONS_READ_ALL = 'NOTIFICATIONS_READ_ALL';

let isClearing = false;
const favicon = new Favico({
  animation: 'popFade'
});

/**
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function notificationsFetch() {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    if (isClearing || !user.isAuthenticated) {
      return;
    }

    const url = endpoints.create('notificationsHistory', {
      status: constants.NOTIFICATION_STATUS_UNREAD,
      page:   1
    });
    proxy.get(url)
      .then((data) => {
        const newNumber = parseInt(data.NewNotificationsNumber, 10);
        favicon.badge(newNumber);
        dispatch({
          type:          NOTIFICATIONS_FETCH,
          notifications: data.NotificationHistory,
          newNumber
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
  return (dispatch, getState, { endpoints, proxy }) => {
    const { notifications } = getState();
    const { newNumber } = notifications;

    isClearing = true;
    favicon.badge(newNumber - 1);
    dispatch({
      type: NOTIFICATIONS_READ,
      notificationID
    });

    const url = endpoints.create('notificationsRead', {
      notificationID
    });
    proxy.get(url)
      .catch((error) => {
        console.warn(error);
      })
      .finally(() => {
        isClearing = false;
        dispatch(notificationsFetch());
      });
  };
}

/**
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function notificationsReadAll() {
  return (dispatch, getState, { endpoints, proxy }) => {
    isClearing = true;
    favicon.badge(0);
    dispatch({
      type: NOTIFICATIONS_READ_ALL
    });

    const url = endpoints.create('notificationsHistory', {
      status: constants.NOTIFICATION_STATUS_READ,
      page:   1
    });
    proxy.get(url)
      .catch((error) => {
        console.warn(error);
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
    dispatch(notificationsFetch());
    setInterval(() => {
      dispatch(notificationsFetch());
    }, 30000);
  };
}
