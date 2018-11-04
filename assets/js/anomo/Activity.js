import Proxy from './Proxy';
import endpoints from './endpoints';

/**
 *
 */
class Activity {
  /**
   * @param {User} user
   */
  constructor(user) {
    this.user  = user;
    this.proxy = new Proxy();
  }

  /**
   * @returns {Promise}
   */
  get = () => {
    const url = endpoints.get('activityGet', {
      token: this.user.getToken()
    });

    return this.proxy.get(url);
  };
}

export default Activity;
