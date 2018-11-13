export const UI_LOADING        = 'UI_LOADING';
export const UI_PREVIEWING     = 'UI_PREVIEWING';
export const UI_WINDOW_RESIZE  = 'UI_WINDOW_RESIZE';
export const UI_ERROR_MESSAGE  = 'UI_ERROR_MESSAGE';
export const UI_VISIBLE_MODAL  = 'UI_VISIBLE_MODAL';
export const UI_VISIBLE_DRAWER = 'UI_VISIBLE_DRAWER';
export const UI_ACTIVE_FEED    = 'UI_ACTIVE_FEED';

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
 * @param {boolean} isPreviewing
 * @returns {{type: string, isPreviewing: *}}
 */
export function uiIsPreviewing(isPreviewing) {
  return {
    type: UI_PREVIEWING,
    isPreviewing
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
 * @param {string} modalName
 * @param {boolean|object} isVisible
 * @returns {{type: string, modalName: *, isOpen: *}}
 */
export function uiVisibleModal(modalName, isVisible) {
  return {
    type: UI_VISIBLE_MODAL,
    modalName,
    isVisible
  };
}

/**
 *
 * @param {string} drawerName
 * @param {boolean|object} isVisible
 * @returns {{type: string, drawerName: *, isVisible: *}}
 */
export function uiVisibleDrawer(drawerName, isVisible) {
  return {
    type: UI_VISIBLE_DRAWER,
    drawerName,
    isVisible
  };
}

/**
 * @param {string} activeFeed
 * @returns {{type: string, activeFeed: *}}
 */
export function uiActiveFeed(activeFeed) {
  return {
    type: UI_ACTIVE_FEED,
    activeFeed
  };
}
