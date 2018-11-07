import { objects, strings } from 'utils';

const base = 'https://ws.anomo.com/v101/index.php/webservice';

// https://github.com/unofficial-anomo-api/open/wiki/New-Anomo-2.11-Update-API-End-Points
const urls = {
  userLogin:            `${base}/user/login`,
  userLogout:           `${base}/user/logout/{token}`,
  userInfo:             `${base}/user/get_user_info/{token}/{userID}`,
  userBlock:            `${base}/user/block_user/{token}/{userID}`,
  userBlocked:          `${base}/user/get_blocked_users/{token}/{userID}`,
  userFollow:           `${base}/user/follow/{token}/{userID}`,
  userFollowers:        `${base}/user/get_list_follower/{token}/{userID}/1`,
  userFollowing:        `${base}/user/get_list_following/{token}/{userID}/1`,
  userStatus:           `${base}/user/post_status/{token}`,
  userPicture:          `${base}/user/post_picture_activity/{token}`,
  profilePosts:         `${base}/profile/get_user_post/{token}/{userID}/0/{lastActivityID}`,
  activityFetch:        `${base}/activity/get_activities/{token}/1/0/-1/0/18/100/{lastActivityID}/0`,
  activityGet:          `${base}/activity/detail/{token}/{refID}/{actionType}`,
  activityLike:         `${base}/activity/like/{token}/{refID}/{actionType}/false`,
  activityComment:      `${base}/activity/comment/{token}/{refID}/{actionType}`,
  notificationsHistory: `${base}/push_notification/get_notification_history/{token}/1/1`,
  notificationsRead:    `${base}/push_notification/read/{token}/{notificationID}/46/33`
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
const create = (name, params = {}) => {
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
  create,
  appendEndpointValues,
  encodeEndpointObject,
  encodeEndpointValue
};
