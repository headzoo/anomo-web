import { objects, strings } from 'utils';

// https://github.com/unofficial-anomo-api/open/wiki/New-Anomo-2.11-Update-API-End-Points
const base = 'https://ws.anomo.com/v101/index.php/webservice';
const urls = {
  userBlock:                 `${base}/user/block_user/{token}/{userID}`,
  userBlocked:               `${base}/user/get_blocked_users/{token}/{userID}`,
  userStatus:                `${base}/user/post_status/{token}`,
  userSearch:                `${base}/user/search_user/{token}/{userID}/{latitude}/{longitude}/1/0/18/100`,
  userPicture:               `${base}/user/post_picture_activity/{token}`,
  userUpdate:                `${base}/user/update/{token}`,
  userUpdatePassword:        `${base}/profile/change_password/{token}`,
  userUpdatePrivacy:         `${base}/user/update_privacy/{token}/{userID}`,
  anomoListIntent:           `${base}/user/list_intent`,
  anomoListInterest:         `${base}/user/list_interests`,
  profilePosts:              `${base}/profile/get_user_post/{token}/{userID}/0/{lastActivityID}`,
  activityDelete:            `${base}/user/delete_activity/{token}/{activityID}`,
  activityLike:              `${base}/activity/like/{token}/{refID}/{actionType}/false`,
  activityComment:           `${base}/activity/comment/{token}/{refID}/{actionType}`,
  activityCommentLike:       `${base}/comment/like/{token}/{commentID}/{actionType}`,
  activityCommentLikeList:   `${base}/comment/likelist/{token}/{commentID}/{actionType}`,
  activityCommentDelete:     `${base}/comment/delete/{token}/{commentID}`,
  activityCommentStopNotify: `${base}/comment/stop_receive_notify/{token}/{refID}/{actionType}`,
  activityAnswerPoll:        `${base}/poll/answer_poll/{token}/{pollID}/{answerID}`
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
