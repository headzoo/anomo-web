import * as types from 'actions/uiActions';
import { objects, redux } from 'utils';
import anomo from 'anomo';

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
  const device = objects.clone(state.device);
  const { width } = action;

  device.width = width;
  if (width >= BREAK_XL) {
    device.size     = 'xl';
    device.isMobile = false;
  } else if (width >= BREAK_LG) {
    device.size     = 'lg';
    device.isMobile = false;
  } else if (width >= BREAK_MD) {
    device.size     = 'md';
    device.isMobile = false;
  } else if (width >= BREAK_SM) {
    device.size = 'sm';
    device.isMobile = true;
  } else {
    device.size     = 'xs';
    device.isMobile = true;
  }

  return {
    ...state,
    device
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

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function sidebarDocked(state, action) {
  return {
    ...state,
    visibleDrawers: {
      notifications: false
    },
    sidebarDocked: action.sidebarDocked
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function pinActivity(state, action) {
  const activity         = objects.clone(action.activity);
  const pinnedActivities = objects.clone(state.pinnedActivities).filter((a) => {
    return a.ActivityID !== activity.ActivityID;
  });
  pinnedActivities.unshift(activity);

  return {
    ...state,
    pinnedActivities
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function unpinActivity(state, action) {
  const { activity }     = action;
  const pinnedActivities = objects.clone(state.pinnedActivities).filter((a) => {
    return a.ActivityID !== activity.ActivityID;
  });

  return {
    ...state,
    pinnedActivities
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function updateActivity(state, action) {
  const activity       = objects.clone(action.activity);
  let pinnedActivities = objects.clone(state.pinnedActivities);

  if (Array.isArray(activity)) {
    activity.forEach((a) => {
      pinnedActivities = pinnedActivities.map((aa) => {
        if (aa.ActivityID === a.ActivityID) {
          return anomo.activities.sanitizeActivity(a);
        }
        return aa;
      });
    });
  } else {
    pinnedActivities = pinnedActivities.map((a) => {
      if (a.ActivityID === activity.ActivityID) {
        return activity;
      }
      return a;
    });
  }

  return {
    ...state,
    pinnedActivities
  };
}

export default redux.createReducer({
  [types.UI_LOADING]:         loading,
  [types.UI_ACTIVE_FEED]:     activeFeed,
  [types.UI_ERROR_MESSAGE]:   errorMessage,
  [types.UI_WINDOW_RESIZE]:   windowResize,
  [types.UI_CONTENT_WIDTH]:   contentWidth,
  [types.UI_VISIBLE_MODAL]:   visibleModal,
  [types.UI_VISIBLE_DRAWER]:  visibleDrawer,
  [types.UI_SIDEBAR_DOCKED]:  sidebarDocked,
  [types.UI_PIN_ACTIVITY]:    pinActivity,
  [types.UI_UNPIN_ACTIVITY]:  unpinActivity,
  [types.UI_UPDATE_ACTIVITY]: updateActivity
});
