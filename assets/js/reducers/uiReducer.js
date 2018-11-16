import * as types from 'actions/uiActions';
import { objects, redux } from 'utils';

const BREAK_SM = 576;
const BREAK_MD = 768;
const BREAK_LG = 992;
const BREAK_XL = 1200;

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function loading(state, action) {
  return {
    ...state,
    isLoading: action.isLoading
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function errorMessage(state, action) {
  return {
    ...state,
    errorMessage: action.errorMessage,
    errorInfo:    objects.clone(action.errorInfo)
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function windowResize(state, action) {
  const { width } = action;

  let deviceSize = 'xs';
  if (width >= BREAK_XL) {
    deviceSize = 'xl';
  } else if (width >= BREAK_LG) {
    deviceSize = 'lg';
  } else if (width >= BREAK_MD) {
    deviceSize = 'md';
  } else if (width >= BREAK_SM) {
    deviceSize = 'sm';
  }

  return {
    ...state,
    deviceSize
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function contentWidth(state, action) {
  return {
    ...state,
    contentWidth: action.contentWidth
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function visibleModal(state, action) {
  const newState = objects.clone(state);

  newState.visibleModals[action.modalName] = action.isVisible;

  return newState;
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function visibleDrawer(state, action) {
  const newState = objects.clone(state);

  newState.visibleDrawers[action.drawerName] = action.isVisible;

  return newState;
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function activeFeed(state, action) {
  return {
    ...state,
    activeFeed: action.activeFeed
  };
}

export default redux.createReducer({
  [types.UI_LOADING]:        loading,
  [types.UI_ACTIVE_FEED]:    activeFeed,
  [types.UI_ERROR_MESSAGE]:  errorMessage,
  [types.UI_WINDOW_RESIZE]:  windowResize,
  [types.UI_CONTENT_WIDTH]:  contentWidth,
  [types.UI_VISIBLE_MODAL]:  visibleModal,
  [types.UI_VISIBLE_DRAWER]: visibleDrawer
});
