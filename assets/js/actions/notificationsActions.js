import axios from 'axios';
import * as constants from 'anomo/constants';
import { redux } from 'utils';
import api from 'api';

export const NOTIFICATIONS_FETCH    = 'NOTIFICATIONS_FETCH';
export const NOTIFICATIONS_READ     = 'NOTIFICATIONS_READ';
export const NOTIFICATIONS_READ_ALL = 'NOTIFICATIONS_READ_ALL';

let isClearing = false;
let fetchSource = null;
const { CancelToken } = axios;

/**
 * @returns {{cancelToken: *}}
 */
function getAxiosConfig() {
  if (fetchSource) {
    fetchSource.cancel();
  }
  fetchSource = CancelToken.source();

  return {
    cancelToken: fetchSource.token
  };
}

/**
 * @returns {function(*, *)}
 */
export function notificationsFetch() {
  return (dispatch, getState) => {
    const { user } = getState();

    if (isClearing || !user.isAuthenticated) {
      return;
    }

    api.request('api_notifications_fetch', {
      page: 1
    })
      .send({}, getAxiosConfig())
      .then((resp) => {
        dispatch({
          type:          NOTIFICATIONS_FETCH,
          notifications: resp.NotificationHistory
        });
      })
      .catch(redux.actionCatch)
      .finally(() => {
        fetchSource = null;
      });
  };
}

/**
 * @param {number} notificationID
 * @returns {function(*)}
 */
export function notificationsRead(notificationID) {
  return (dispatch) => {
    isClearing = true;
    dispatch({
      type: NOTIFICATIONS_READ,
      notificationID
    });

    api.request('api_notifications_delete', { notificationID })
      .send()
      .catch(redux.actionCatch)
      .finally(() => {
        isClearing = false;
      });
  };
}

/**
 * @returns {function(*)}
 */
export function notificationsReadAll() {
  return (dispatch) => {
    isClearing = true;
    dispatch({
      type: NOTIFICATIONS_READ_ALL
    });

    api.request('api_notifications_delete_all', {
      page: 1
    })
      .send()
      .catch(redux.actionCatch)
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
