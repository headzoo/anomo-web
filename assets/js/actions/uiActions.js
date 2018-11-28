import { browser } from 'utils';

export const UI_LOADING         = 'UI_LOADING';
export const UI_WINDOW_RESIZE   = 'UI_WINDOW_RESIZE';
export const UI_CONTENT_WIDTH   = 'UI_CONTENT_WIDTH';
export const UI_ERROR_MESSAGE   = 'UI_ERROR_MESSAGE';
export const UI_VISIBLE_MODAL   = 'UI_VISIBLE_MODAL';
export const UI_VISIBLE_DRAWER  = 'UI_VISIBLE_DRAWER';
export const UI_ACTIVE_FEED     = 'UI_ACTIVE_FEED';
export const UI_SIDEBAR_DOCKED  = 'UI_SIDEBAR_DOCKED';
export const UI_PIN_ACTIVITY    = 'UI_PIN_ACTIVITY';
export const UI_UNPIN_ACTIVITY  = 'UI_UNPIN_ACTIVITY';
export const UI_UPDATE_ACTIVITY = 'UI_UPDATE_ACTIVITY';

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
 * @param {number} contentWidth
 * @returns {{type: string, contentWidth: *}}
 */
export function uiContentWidth(contentWidth) {
  return {
    type: UI_CONTENT_WIDTH,
    contentWidth
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

/**
 * @param {boolean} sidebarDocked
 * @returns {{type: string, sidebarDocked: *}}
 */
export function uiSidebarDocked(sidebarDocked) {
  browser.storage.set(browser.storage.KEY_SIDEBAR_DOCKED, sidebarDocked);
  return {
    type: UI_SIDEBAR_DOCKED,
    sidebarDocked
  };
}

/**
 * @param {*} activity
 * @returns {function(*, *)}
 */
export function uiPinActivity(activity) {
  return (dispatch, getState) => {
    dispatch({
      type: UI_PIN_ACTIVITY,
      activity
    });
    browser.storage.set(browser.storage.KEY_PINNED_ACTIVITIES, getState().ui.pinnedActivities);
  };
}

/**
 * @param {*} activity
 * @returns {function(*, *)}
 */
export function uiUnpinActivity(activity) {
  return (dispatch, getState) => {
    dispatch({
      type: UI_UNPIN_ACTIVITY,
      activity
    });
    browser.storage.set(browser.storage.KEY_PINNED_ACTIVITIES, getState().ui.pinnedActivities);
  };
}

/**
 * @param {*} activity
 * @returns {function(*, *)}
 */
export function uiUpdateActivity(activity) {
  return (dispatch, getState) => {
    dispatch({
      type: UI_UPDATE_ACTIVITY,
      activity
    });
    browser.storage.set(browser.storage.KEY_PINNED_ACTIVITIES, getState().ui.pinnedActivities);
  };
}
