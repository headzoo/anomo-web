import queryString from 'query-string';
import isEqual from 'lodash.isequal';

/**
 * @param {string} title
 */
export function browserTitle(title) {
  document.title = title;
}

/**
 * @param {number|HTMLElement} top
 * @param {string|number} behavior
 * @param {string} rest
 */
export function browserScroll(top = 0, behavior = 'auto', rest = 'auto') {
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
 *
 * @param {*} location
 * @returns {*}
 */
export function browserParseHash(location) {
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
export function browserStorageGet(key, defaultValue = null) {
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
export function browserStorageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

/**
 * @param {string} key
 * @param {*} value
 * @param {number} maxLength
 * @returns {Array}
 */
export function browserStoragePush(key, value, maxLength = -1) {
  let found  = false;
  let values = browserStorageGet(key, []);

  for (let i = 0; i < values.length; i++) {
    const v = values[i];

    if (typeof v === 'object' && typeof value === 'object') {
      if ((v.id !== undefined && value.id !== undefined) && (v.id === value.id)) {
        found = true;
        break;
      } else if ((v.listing_key !== undefined && value.listing_key !== undefined)
          && (v.listing_key === value.listing_key)) {
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
    browserStorageSet(key, values);
  }

  return values;
}

/**
 * @param {string} key
 * @returns {boolean}
 */
export function browserStorageRemove(key) {
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
export function browserOff(event, fn, rest = null) {
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
export function browserOn(event, fn, rest = null) {
  if (typeof event !== 'string') {
    event.addEventListener(fn, rest, true);
  } else {
    window.addEventListener(event, fn, true);
  }

  return () => {
    browserOff(event, fn, rest);
  };
}

/**
 * @param {string|HTMLElement} event
 * @param {string} rest
 */
export function browserTrigger(event, rest =  null) {
  if (typeof event !== 'string') {
    event.dispatchEvent(new Event(rest));
  } else {
    window.dispatchEvent(new Event(event));
  }
}

/**
 *
 */
export function browserHideScrollbars() {
  // firefox, chrome
  document.documentElement.style.overflow = 'hidden';
  // ie only
  document.body.scroll = 'no';
}

/**
 *
 */
export function browserShowScrollbars() {
  // firefox, chrome
  document.documentElement.style.overflow = 'auto';
  // ie only
  document.body.scroll = 'yes';
}

/**
 * @param {Function} cb
 */
export function browserPosition(cb) {
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

export default {
  on:             browserOn,
  off:            browserOff,
  trigger:        browserTrigger,
  title:          browserTitle,
  scroll:         browserScroll,
  hideScrollbars: browserHideScrollbars,
  showScrollbars: browserShowScrollbars,
  parseHash:      browserParseHash,
  position:       browserPosition,
  storage:        {
    get:         browserStorageGet,
    set:         browserStorageSet,
    push:        browserStoragePush,
    remove:      browserStorageRemove,
    KEY_USER:    'user',
    KEY_ID:      'UserID',
    KEY_DETAILS: 'Details',
    KEY_TOKEN:   'token',
    KEY_TAGS:    'tags'
  }
};
