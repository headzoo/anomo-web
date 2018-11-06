export const UI_LOADING                  = 'UI_LOADING';
export const UI_WINDOW_RESIZE            = 'UI_WINDOW_RESIZE';
export const UI_ERROR_MESSAGE            = 'UI_ERROR_MESSAGE';
export const UI_NOTIFICATIONS_MODAL_OPEN = 'UI_NOTIFICATIONS_MODAL_OPEN';

/**
 * @param {boolean} isLoading
 * @returns {{type, isLoading: *}}
 */
export function uiIsLoading(isLoading) {
  return {
    type: UI_LOADING,
    isLoading
  };
}

/**
 * @param {string} em
 * @param {*} errorInfo
 * @returns {{type, errorMessage: *}}
 */
export function errorMessage(em, errorInfo) {
  return {
    type:         UI_ERROR_MESSAGE,
    errorMessage: em,
    errorInfo
  };
}

/**
 * @param {number} width
 * @returns {{type, width: *}}
 */
export function windowResize(width) {
  return {
    type: UI_WINDOW_RESIZE,
    width
  };
}

/**
 * @param {boolean} isNotificationsModalOpen
 * @returns {{type: string, modalNotificationsOpen: *}}
 */
export function uiNotificationsModalOpen(isNotificationsModalOpen) {
  return {
    type: UI_NOTIFICATIONS_MODAL_OPEN,
    isNotificationsModalOpen
  };
}
