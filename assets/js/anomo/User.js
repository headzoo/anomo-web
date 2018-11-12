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
    this.id      = 0;
    this.details = null;
    this.token   = '';
    this.proxy   = new Proxy();
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
   * @param {*} details
   * @returns {User}
   */
  setDetails = (details) => {
    this.details = details;
    browser.storage.set(browser.storage.KEY_DETAILS, details);
    return this;
  };

  /**
   * @returns {*}
   */
  getDetails = () => {
    if (!this.details) {
      this.details = browser.storage.get(browser.storage.KEY_DETAILS, {});
    }
    return this.details;
  };

  /**
   * @returns {User}
   */
  removeDetails = () => {
    this.details = null;
    browser.storage.remove(browser.storage.KEY_DETAILS);
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

        delete data.token;
        delete data.code;
        this.setDetails(data);
      }
      return data;
    });
  };

  /**
   * @returns {Promise}
   */
  logout = (localOnly = false) => {
    this.removeID();
    this.removeToken();
    this.removeDetails();

    if (this.hasToken() && !localOnly) {
      const url = endpoints.create('userLogout', {
        token: this.getToken()
      });
      return this.proxy.get(url);
    }

    return Promise.resolve();
  };

  /**
   * @param {number} id
   * @returns {*}
   */
  info = (id) => {
    const url = endpoints.create('userInfo', {
      token:  this.getToken(),
      userID: id
    });

    return this.proxy.get(url);
  };
}

export default User;
