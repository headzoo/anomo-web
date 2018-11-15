import Favico from 'favico.js';

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
    if (isClearing || !user.hasToken()) {
      return;
    }

    const url = endpoints.create('notificationsHistory');
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          const newNumber = parseInt(data.NewNotificationsNumber, 10);
          favicon.badge(newNumber);
          dispatch({
            type:          NOTIFICATIONS_FETCH,
            notifications: data.NotificationHistory,
            newNumber
          });
        }
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
    const { notifications } = getState();

    isClearing = true;
    favicon.badge(0);
    dispatch({
      type: NOTIFICATIONS_READ_ALL
    });

    const promises = [];
    notifications.notifications.forEach((n) => {
      const url = endpoints.create('notificationsRead', {
        notificationID: n.ID
      });
      promises.push(proxy.get(url));
    });
    Promise.all(promises)
      .then(() => {
        isClearing = false;
        dispatch(notificationsFetch());
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
