import { objects, strings } from 'utils';

const base = 'https://ws.anomo.com/v101/index.php/webservice';

// https://github.com/unofficial-anomo-api/open/wiki/New-Anomo-2.11-Update-API-End-Points
const urls = {
  userLogin:          `${base}/user/login`,
  userLogout:         `${base}/user/logout/{token}`,
  userInfo:           `${base}/user/get_user_info/{token}/{UserID}`,
  activityGet:        `${base}/activity/get_activities/{token}/1/0/-1/0/18/100/0/0`,
  activityGetByRefID: `${base}/activity/detail/{token}/{refID}/{actionType}`,
  activityLike:       `${base}/activity/like/{token}/{refID}/{actionType}/false`
};

/**
 * @param {string} url
 * @param {*} values
 * @returns {string}
 */
const appendEndpointValues = (url, values) => {
  if (!objects.isEmpty(values)) {
    url = `${url}${url.indexOf('?') === -1 ? '?' : '&'}`;
    Object.keys(values).forEach((key) => {
      url = `${url}${key}=${strings.encodeURI(values[key])}&`;
    });
    url = url.substring(0, url.length - 1);
  }

  return url;
};

/**
 * @param {*} obj
 * @returns {string}
 */
const encodeEndpointObject = (obj) => {
  const str = [];
  Object.keys(obj).forEach((key) => {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  });

  return str.join('&');
};

/**
 * @param {*} value
 * @returns {string}
 */
const encodeEndpointValue = (value) => {
  if (typeof value === 'object') {
    return encodeEndpointObject(value);
  }
  return encodeURIComponent(value.toString().replace('+', ' '));
};

/**
 * @param {string} name
 * @param {*} params
 * @returns {string}
 */
const get = (name, params = {}) => {
  let url = urls[name];
  const values = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];
    const type  = typeof value;
    const regex = new RegExp(`{${key}}`);

    if (url.match(regex)) {
      url = url.replace(regex, encodeEndpointValue(value));
    } else if (type === 'object') {
      Object.keys(value).forEach((k) => {
        if (value[k]) {
          values[k] = encodeEndpointValue(value[k]);
        }
      });
    } else if (type !== 'undefined') {
      values[key] = encodeEndpointValue(value);
    }
  });

  return appendEndpointValues(url, values);
};

export default {
  get,
  appendEndpointValues,
  encodeEndpointObject,
  encodeEndpointValue
};
