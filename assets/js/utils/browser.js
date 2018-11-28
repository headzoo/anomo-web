import queryString from 'query-string';
import isEqual from 'lodash.isequal';
import { getConfig } from 'store/config';

/**
 * @param {string} t
 */
function title(t) {
  document.title = t;
}

/**
 * @param {number|HTMLElement} top
 * @param {string|number} behavior
 * @param {string} rest
 */
function scroll(top = 0, behavior = 'auto', rest = 'auto') {
  if (typeof top !== 'number' && typeof top !== 'string') {
    top.scroll({
      left:     0,
      top:      behavior,
      behavior: rest
    });
  } else {
    window.scroll({
      left: 0,
      top,
      behavior
    });
  }
}

/**
 * @param {string} url
 * @returns {{port: string, host: string, hash: string, search: string, origin: *|string, hostname: string, protocol: string, pathname: string}}
 */
function parseURL(url) {
  const parser = document.createElement('a');
  parser.href = url;

  return {
    port:     parser.port,
    host:     parser.host,
    hash:     parser.hash,
    search:   parser.search,
    origin:   parser.origin,
    hostname: parser.hostname,
    protocol: parser.protocol,
    pathname: parser.pathname
  };
}

/**
 *
 * @param {*} location
 * @returns {*}
 */
function parseHash(location) {
  if (location.hash) {
    return queryString.parse(location.hash.substr(1));
  }

  return {};
}

/**
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
function storageGet(key, defaultValue = null) {
  const value = localStorage.getItem(key);
  if (!value) {
    return defaultValue;
  }
  return JSON.parse(value);
}

/**
 * @param {string} key
 * @param {*} value
 * @returns {*}
 */
function storageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

/**
 * @param {string} key
 * @param {*} value
 * @param {number} maxLength
 * @returns {Array}
 */
function storagePush(key, value, maxLength = -1) {
  let found  = false;
  let values = storageGet(key, []);

  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (typeof v === 'object' && typeof value === 'object') {
      if ((v.ActivityID !== undefined && value.ActivityID !== undefined) && (v.ActivityID === value.ActivityID)) {
        found = true;
        break;
      }
    }
    if (isEqual(v, value)) {
      found = true;
      break;
    }
  }

  if (!found) {
    values.unshift(value);
    if (maxLength !== -1) {
      values = values.slice(0, maxLength);
    }
    storageSet(key, values);
  }

  return values;
}

/**
 * @param {string} key
 * @returns {boolean}
 */
function storageRemove(key) {
  localStorage.removeItem(key);
  return true;
}

/**
 * Removes an event listener from window or given element
 *
 * @param {string|HTMLElement} event
 * @param {Function} fn
 * @param {Function} rest
 */
function off(event, fn, rest = null) {
  if (typeof event !== 'string') {
    event.removeEventListener(fn, rest, true);
  } else {
    window.removeEventListener(event, fn, true);
  }
}

/**
 * Binds an event handle to window or given element
 *
 * Returns a function which can be called to remove the event handler.
 *
 * let off = browserOn('click', () => {
 *  console.log('Window clicked!');
 * });
 *
 * let off = browserOn(document, 'click', () => {
 *  console.log('Document clicked!');
 * });
 *
 * off();
 *
 * @param {string|HTMLElement} event
 * @param {Function|string} fn
 * @param {Function} rest
 * @returns {Function}
 */
function on(event, fn, rest = null) {
  if (typeof event !== 'string') {
    event.addEventListener(fn, rest, true);
  } else {
    window.addEventListener(event, fn, true);
  }

  return () => {
    off(event, fn, rest);
  };
}

/**
 * @param {string|HTMLElement} event
 * @param {string} rest
 */
function trigger(event, rest =  '') {
  if (typeof event !== 'string') {
    event.dispatchEvent(new Event(rest));
  } else {
    window.dispatchEvent(new Event(event));
  }
}

/**
 *
 */
function hideScrollbars() {
  // firefox, chrome
  document.documentElement.style.overflow = 'hidden';
  // ie only
  document.body.scroll = 'no';
}

/**
 *
 */
function showScrollbars() {
  // firefox, chrome
  document.documentElement.style.overflow = 'auto';
  // ie only
  document.body.scroll = 'yes';
}

/**
 * @param {Function} cb
 */
function position(cb) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      cb(latitude, longitude);
    }, () => {
      cb(0, 0);
    });
  } else {
    cb(0, 0);
  }
}

/**
 * @param {string} src
 * @returns {string}
 */
function toHttps(src) {
  if (getConfig().https) {
    return src.replace('http://', 'https://');
  }
  return src;
}

export default {
  on,
  off,
  trigger,
  title,
  scroll,
  toHttps,
  hideScrollbars,
  showScrollbars,
  parseHash,
  position,
  parseURL,
  storage: {
    get:                   storageGet,
    set:                   storageSet,
    push:                  storagePush,
    remove:                storageRemove,
    KEY_USER:              'user',
    KEY_ID:                'UserID',
    KEY_DETAILS:           'Details',
    KEY_TOKEN:             'token',
    KEY_TAGS:              'tags',
    KEY_SHOW_PREVIEW:      'showPreview',
    KEY_SIDEBAR_DOCKED:    'sidebarDocked',
    KEY_PINNED_ACTIVITIES: 'pinnedActivities',
    KEY_ACTIVITY_HISTORY:  'activityHistory'
  }
};
