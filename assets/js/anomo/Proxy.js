import axios from 'axios';

class Proxy {
  /**
   * @param {string} url
   * @returns {Promise<AxiosResponse<any>>}
   */
  get = (url) => {
    return axios.post('/proxy', {
      method: 'GET',
      url
    }).then((resp) => {
      return resp.data;
    });
  };

  /**
   * @param {string} url
   * @param {*} body
   * @returns {Promise<AxiosResponse<any>>}
   */
  post = (url, body) => {
    return axios.post('/proxy', {
      method: 'POST',
      url,
      body
    }).then((resp) => {
      return resp.data;
    });
  };
}

export default Proxy;
