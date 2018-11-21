import axios from 'axios';
import Routing from '../../../public/bundles/fosjsrouting/js/router';
import routes from '../../../public/build/js/routes.json';

Routing.setRoutingData(routes);

let token = '';

/**
 * @param {string} tok
 */
const setToken = (tok) => {
  token = tok;
};

/**
 * @returns {AxiosInstance}
 */
const instance = () => {
  return axios.create({
    timeout: 10000,
    headers: {
      'Authorization': `token ${token}`
    }
  });
};

/**
 * @param {string} url
 * @param {*} config
 * @returns {PromiseLike}
 */
const get = (url, config = {}) => {
  return instance().get(url, config)
    .then(resp => resp.data)
    .then((data) => {
      if (data.code !== 'OK') {
        throw new Error(data.code);
      }
      return data;
    });
};

/**
 * @param {string} url
 * @param {*} body
 * @param {*} config
 * @returns {PromiseLike}
 */
const post = (url, body, config = {}) => {
  return instance().post(url, body, config)
    .then(resp => resp.data)
    .then((data) => {
      if (data.code !== 'OK') {
        throw new Error(data.code);
      }
      return data;
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
   * @returns {PromiseLike}
   */
  get = (config) => {
    return get(this.url, config);
  };

  /**
   * @param {*} body
   * @param {*} config
   * @returns {PromiseLike}
   */
  post = (body = {}, config = {}) => {
    return post(this.url, body, config);
  }
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
  post,
  request,
  setToken
};
