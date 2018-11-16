import { objects, strings } from 'utils';

// https://github.com/unofficial-anomo-api/open/wiki/New-Anomo-2.11-Update-API-End-Points
const base = 'https://ws.anomo.com/v101/index.php/webservice';
const urls = {
  userLogin:                 `${base}/user/login`,
  userFBLogin:               `${base}/user/login_with_fb`,
  userLogout:                `${base}/user/logout/{token}`,
  userInfo:                  `${base}/user/get_user_info/{token}/{userID}`,
  userBlock:                 `${base}/user/block_user/{token}/{userID}`,
  userBlocked:               `${base}/user/get_blocked_users/{token}/{userID}`,
  userFollow:                `${base}/user/follow/{token}/{userID}`,
  userFollowers:             `${base}/user/get_list_follower/{token}/{userID}/{page}`,
  userFollowing:             `${base}/user/get_list_following/{token}/{userID}/{page}`,
  userStatus:                `${base}/user/post_status/{token}`,
  userSearch:                `${base}/user/search_user/{token}/{userID}/{latitude}/{longitude}/1/0/18/100`,
  userPicture:               `${base}/user/post_picture_activity/{token}`,
  userUpdate:                `${base}/user/update/{token}`,
  userUpdatePassword:        `${base}/profile/change_password/{token}`,
  userUpdatePrivacy:         `${base}/user/update_privacy/{token}/{userID}`,
  anomoListIntent:           `${base}/user/list_intent`,
  anomoListInterest:         `${base}/user/list_interests`,
  profilePosts:              `${base}/profile/get_user_post/{token}/{userID}/0/{lastActivityID}`,
  activityFetch:             `${base}/activity/get_activities/{token}/1/0/-1/0/18/100/{lastActivityID}/0`,
  activityFeedRecent:        `${base}/activity/get_activities/{token}/1/0/-1/0/18/100/{lastActivityID}/0`,
  activityFeedPopular:       `${base}/activity/get_activities/{token}/1/2/-1/0/18/100/{lastActivityID}/0`,
  activityFeedFollowing:     `${base}/activity/get_activities/{token}/1/3/-1/0/18/100/{lastActivityID}/0`,
  activityGet:               `${base}/activity/detail/{token}/{refID}/{actionType}`,
  activityDelete:            `${base}/user/delete_activity/{token}/{activityID}`,
  activityLike:              `${base}/activity/like/{token}/{refID}/{actionType}/false`,
  activityLikeList:          `${base}/activity/likelist/{token}/{refID}/{actionType}`,
  activityComment:           `${base}/activity/comment/{token}/{refID}/{actionType}`,
  activityCommentLike:       `${base}/comment/like/{token}/{commentID}/1`,
  activityCommentDelete:     `${base}/comment/delete/{token}/{commentID}`,
  activityCommentStopNotify: `${base}/comment/stop_receive_notify/{token}/{refID}/{actionType}`,
  activityAnswerPoll:        `${base}/poll/answer_poll/{token}/{pollID}/{answerID}`,
  notificationsHistory:      `${base}/push_notification/get_notification_history/{token}/{status}/{page}`,
  notificationsRead:         `${base}/push_notification/read/{token}/{notificationID}/46/33`
};

class Endpoints {
  /**
   * @param {*} endpoints
   */
  constructor(endpoints) {
    this.endpoints     = endpoints;
    this.defaultParams = {};
  }

  /**
   * @param {string} name
   * @param {*} value
   * @returns {Endpoints}
   */
  addDefaultParam = (name, value) => {
    this.defaultParams[name] = value;
    return this;
  };

  /**
   * @param {string} name
   * @param {*} params
   * @returns {string}
   */
  create = (name, params = {}) => {
    let url = urls[name];
    const values = {};
    const combinedParams = objects.merge(this.defaultParams, params);

    Object.keys(combinedParams).forEach((key) => {
      const value = combinedParams[key];
      const type  = typeof value;
      const regex = new RegExp(`{${key}}`);

      if (url.match(regex)) {
        url = url.replace(regex, this.encodeEndpointValue(value));
      } else if (type === 'object') {
        Object.keys(value).forEach((k) => {
          if (value[k]) {
            values[k] = this.encodeEndpointValue(value[k]);
          }
        });
      } else if (type !== 'undefined') {
        values[key] = this.encodeEndpointValue(value);
      }
    });

    return this.appendEndpointValues(url, values);
  };

  /**
   * @param {string} url
   * @param {*} values
   * @returns {string}
   */
  appendEndpointValues = (url, values) => {
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
  encodeEndpointObject = (obj) => {
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
  encodeEndpointValue = (value) => {
    if (typeof value === 'object') {
      return this.encodeEndpointObject(value);
    }
    return encodeURIComponent(value.toString().replace('+', ' '));
  };
}

export default new Endpoints(urls);
