import { objects, strings } from 'utils';

const base = 'https://ws.anomo.com/v101/index.php/webservice';

// https://github.com/unofficial-anomo-api/open/wiki/New-Anomo-2.11-Update-API-End-Points
const urls = {
  userLogin:             `${base}/user/login`,
  userFBLogin:           `${base}/user/login_with_fb`,
  userLogout:            `${base}/user/logout/{token}`,
  userInfo:              `${base}/user/get_user_info/{token}/{userID}`,
  userBlock:             `${base}/user/block_user/{token}/{userID}`,
  userBlocked:           `${base}/user/get_blocked_users/{token}/{userID}`,
  userFollow:            `${base}/user/follow/{token}/{userID}`,
  userFollowers:         `${base}/user/get_list_follower/{token}/{userID}/{page}`,
  userFollowing:         `${base}/user/get_list_following/{token}/{userID}/{page}`,
  userStatus:            `${base}/user/post_status/{token}`,
  userSearch:            `${base}/user/search_user/{token}/{userID}/{latitude}/{longitude}/1/0/18/100`,
  userPicture:           `${base}/user/post_picture_activity/{token}`,
  userUpdate:            `${base}/user/update/{token}`,
  userUpdatePrivacy:     `${base}/user/update_privacy/{token}/{userID}`,
  anomoListIntent:       `${base}/user/list_intent`,
  anomoListInterest:     `${base}/user/list_interests`,
  profilePosts:          `${base}/profile/get_user_post/{token}/{userID}/0/{lastActivityID}`,
  activityFetch:         `${base}/activity/get_activities/{token}/1/0/-1/0/18/100/{lastActivityID}/0`,
  activityFeedRecent:    `${base}/activity/get_activities/{token}/1/0/-1/0/18/100/{lastActivityID}/0`,
  activityFeedPopular:   `${base}/activity/get_activities/{token}/1/2/-1/0/18/100/{lastActivityID}/0`,
  activityFeedFollowing: `${base}/activity/get_activities/{token}/1/3/-1/0/18/100/{lastActivityID}/0`,
  activityGet:           `${base}/activity/detail/{token}/{refID}/{actionType}`,
  activityDelete:        `${base}/user/delete_activity/{token}/{activityID}`,
  activityLike:          `${base}/activity/like/{token}/{refID}/{actionType}/false`,
  activityComment:       `${base}/activity/comment/{token}/{refID}/{actionType}`,
  activityCommentLike:   `${base}/comment/like/{token}/{commentID}/1`,
  activityCommentDelete: `${base}/comment/delete/{token}/{commentID}`,
  activityAnswerPoll:    `${base}/poll/answer_poll/{token}/{pollID}/{answerID}`,
  notificationsHistory:  `${base}/push_notification/get_notification_history/{token}/1/1`,
  notificationsRead:     `${base}/push_notification/read/{token}/{notificationID}/46/33`
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
