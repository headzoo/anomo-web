import axios from 'axios';

class Proxy {
  /**
   * @param {string} url
   * @param {*} config
   * @returns {Promise<AxiosResponse<any>>}
   */
  get = (url, config = {}) => {
    return axios.post('/proxy', {
      method: 'GET',
      url
    }, config).then((resp) => {
      return resp.data;
    });
  };

  /**
   * @param {string} url
   * @param {*} body
   * @param {*} config
   * @returns {Promise<AxiosResponse<any>>}
   */
  post = (url, body, config = {}) => {
    if (body instanceof FormData) {
      body.append('method', 'POST');
      body.append('url', url);
      return axios.post('/proxy', body)
        .then((resp) => {
          return resp.data;
        });
    }

    return axios.post('/proxy', {
      method: 'POST',
      url,
      body
    }, config).then((resp) => {
      return resp.data;
    });
  };
}

export default Proxy;
