import axios from 'axios';

class Proxy {
  /**
   * @param {boolean} debug
   */
  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * @param {string} url
   * @param {*} config
   * @returns {Promise}
   */
  get = (url, config = {}) => {
    if (this.debug) {
      console.groupCollapsed(`GET ${url}`);
      console.log('config', config);
      console.groupEnd();
    }

    return axios.post('/proxy', {
      method: 'GET',
      url
    }, config)
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
   * @returns {Promise}
   */
  post = (url, body, config = {}) => {
    if (this.debug) {
      console.groupCollapsed(`POST ${url}`);
      console.log('body', body);
      console.log('config', config);
      console.groupEnd();
    }

    if (body instanceof FormData) {
      body.append('method', 'POST');
      body.append('url', url);
      return axios.post('/proxy', body)
        .then(resp => resp.data)
        .then((data) => {
          if (data.code !== 'OK') {
            throw new Error(data.code);
          }
          return data;
        });
    }

    return axios.post('/proxy', {
      method: 'POST',
      url,
      body
    }, config)
      .then(resp => resp.data)
      .then((data) => {
        if (data.code !== 'OK') {
          throw new Error(data.code);
        }
        return data;
      });
  };
}

export default Proxy;
