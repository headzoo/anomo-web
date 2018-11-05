import md5 from 'md5';
import { browser } from 'utils';
import Proxy from './Proxy';
import endpoints from './endpoints';

/**
 *
 */
class User {
  /**
   *
   */
  constructor() {
    this.id    = 0;
    this.token = '';
    this.proxy = new Proxy();
  }

  /**
   * @param {string} token
   * @returns {User}
   */
  setToken = (token) => {
    this.token = token;
    browser.storage.set(browser.storage.KEY_TOKEN, token);
    return this;
  };

  /**
   * @returns {string}
   */
  getToken = () => {
    if (!this.token) {
      this.token = browser.storage.get(browser.storage.KEY_TOKEN, '');
    }
    return this.token;
  };

  /**
   * @returns {boolean}
   */
  hasToken = () => {
    return this.getToken() !== '';
  };

  /**
   * @returns {User}
   */
  removeToken = () => {
    this.token = '';
    browser.storage.remove(browser.storage.KEY_TOKEN);
    return this;
  };

  /**
   * @param {number} id
   * @returns {User}
   */
  setID = (id) => {
    this.id = id;
    browser.storage.set(browser.storage.KEY_ID, id);
    return this;
  };

  /**
   * @returns {number}
   */
  getID = () => {
    if (!this.id) {
      this.id = browser.storage.get(browser.storage.KEY_ID, 0);
    }
    return this.id;
  };

  /**
   * @returns {User}
   */
  removeID = () => {
    this.id = 0;
    browser.storage.remove(browser.storage.KEY_ID);
    return this;
  };

  /**
   * @param {string} username
   * @param {string} password
   * @returns {Promise}
   */
  login = (username, password) => {
    return this.proxy.post(endpoints.create('userLogin'), {
      UserName: username,
      Password: md5(password)
    }).then((data) => {
      if (data.token) {
        this.setID(parseInt(data.UserID, 10));
        this.setToken(data.token);
      }
      return data;
    });
  };

  /**
   * @returns {Promise}
   */
  logout = () => {
    if (!this.hasToken()) {
      return Promise.resolve();
    }

    this.removeID();
    this.removeToken();
    const url = endpoints.create('userLogout', {
      token: this.getToken()
    });

    return this.proxy.get(url);
  };

  /**
   * @param {number} id
   * @returns {*}
   */
  info = (id) => {
    const url = endpoints.create('userInfo', {
      token:  this.getToken(),
      UserID: id
    });

    return this.proxy.get(url);
  };
}

export default User;
