export const NOTIFICATIONS_FETCH = 'NOTIFICATIONS_FETCH';

/**
 * @returns {function(*, *, {user: *, endpoints: *, proxy: *})}
 */
export function notificationsFetch() {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const token = user.getToken();
    if (!token) {
      return;
    }

    const url = endpoints.create('notificationsHistory', {
      token
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:          NOTIFICATIONS_FETCH,
            notifications: data.NotificationHistory,
            newNumber:     parseInt(data.NewNotificationsNumber, 10)
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
  return (dispatch, getState, { user, endpoints, proxy }) => {
    const url = endpoints.create('notificationsRead', {
      token: user.getToken(),
      notificationID
    });
    proxy.get(url)
      .then(() => {
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
