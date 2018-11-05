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

  /**
   * @param {number} refID
   * @param {number} actionType
   * @returns {Promise}
   */
  getByRefID = (refID, actionType) => {
    const url = endpoints.get('activityGetByRefID', {
      token: this.user.getToken(),
      refID,
      actionType
    });

    return this.proxy.get(url);
  };

  /**
   * @param {number} refID
   * @param {number} actionType
   * @returns {Promise}
   */
  like = (refID, actionType) => {
    const url = endpoints.get('activityLike', {
      token: this.user.getToken(),
      refID,
      actionType
    });

    return this.proxy.get(url);
  };
}

export default Activity;
