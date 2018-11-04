export const UI_WINDOW_RESIZE = 'UI_WINDOW_RESIZE';
export const UI_ERROR_MESSAGE = 'UI_ERROR_MESSAGE';

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
