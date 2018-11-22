import axios from 'axios';
import { browser } from 'utils';
import Routing from '../../../public/bundles/fosjsrouting/js/router';
import routes from '../../../public/build/js/routes.json';

Routing.setRoutingData(routes);

let token  = browser.storage.get(browser.storage.KEY_TOKEN, '');
let userID = browser.storage.get(browser.storage.KEY_ID, 0);

/**
 * @param {string} tok
 */
const setToken = (tok) => {
  token = tok;
  browser.storage.set(browser.storage.KEY_TOKEN, token);
};

/**
 * @returns {string}
 */
const getToken = () => {
  return token;
};

/**
 *
 */
const deleteToken = () => {
  token = '';
  browser.storage.remove(browser.storage.KEY_TOKEN);
};

/**
 * @param {number} ui
 */
const setUserID = (ui) => {
  userID = ui;
  browser.storage.set(browser.storage.KEY_ID, userID);
};

/**
 * @returns {number}
 */
const getUserID = () => {
  return userID;
};

/**
 *
 */
const deleteUserID = () => {
  userID = 0;
  browser.storage.remove(browser.storage.KEY_ID);
};

/**
 * @param {string} contentType
 * @returns {AxiosInstance}
 */
const instance = (contentType = 'application/json') => {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  return axios.create({
    timeout: 10000,
    headers
  });
};

/**
 * @param {string} url
 * @param {*} config
 * @returns {Promise}
 */
const get = (url, config = {}) => {
  return instance()
    .get(url, config)
    .then(resp => resp.data)
    .then((data) => {
      if (data.code !== 'OK') {
        throw new Error(data.code);
      }
      return data;
    })
    .catch((error) => {
      if (!axios.isCancel(error)) {
        throw error;
      }
    });
};

/**
 * @param {string} url
 * @param {*} body
 * @param {*} config
 * @returns {Promise}
 */
const post = (url, body = {}, config = {}) => {
  let bodyData    = '';
  let contentType = 'application/json';
  if (body instanceof FormData) {
    bodyData    = body;
    contentType = '';
  } else {
    bodyData = JSON.stringify(body);
  }

  return instance(contentType)
    .post(url, bodyData, config)
    .then(resp => resp.data)
    .then((data) => {
      if (data.code !== 'OK') {
        throw new Error(data.code);
      }
      return data;
    })
    .catch((error) => {
      if (!axios.isCancel(error)) {
        throw error;
      }
    });
};

/**
 * @param {string} url
 * @param {*} body
 * @param {*} config
 * @returns {Promise}
 */
const put = (url, body = {}, config = {}) => {
  return instance()
    .put(url, JSON.stringify(body), config)
    .then(resp => resp.data)
    .then((data) => {
      if (data.code !== 'OK') {
        throw new Error(data.code);
      }
      return data;
    })
    .catch((error) => {
      if (!axios.isCancel(error)) {
        throw error;
      }
    });
};

/**
 * @param {string} url
 * @param {*} config
 * @returns {Promise}
 */
const del = (url, config = {}) => {
  return instance()
    .delete(url, config)
    .then(resp => resp.data)
    .then((data) => {
      if (data.code !== 'OK') {
        throw new Error(data.code);
      }
      return data;
    })
    .catch((error) => {
      if (!axios.isCancel(error)) {
        throw error;
      }
    });
};

/**
 *
 */
class Request {
  /**
   * @param {string} url
   */
  constructor(url) {
    this.url  = url;
  }

  /**
   * @param {*} config
   * @returns {Promise}
   */
  get = (config) => {
    return get(this.url, config);
  };

  /**
   * @param {*} body
   * @param {*} config
   * @returns {Promise}
   */
  post = (body = {}, config = {}) => {
    return post(this.url, body, config);
  };

  /**
   * @param {*} body
   * @param {*} config
   * @returns {Promise}
   */
  put = (body = {}, config = {}) => {
    return put(this.url, body, config);
  };

  /**
   * @param {*} config
   * @returns {Promise}
   */
  'delete' = (config = {}) => {
    return del(this.url, config);
  };
}

/**
 * @param {string} route
 * @param {*} params
 * @param {boolean} absolute
 */
const request = (route, params = {}, absolute = false) => {
  return new Request(Routing.generate(route, params, absolute));
};

export default {
  get,
  put,
  del,
  post,
  request,
  setToken,
  getToken,
  deleteToken,
  setUserID,
  getUserID,
  deleteUserID
};