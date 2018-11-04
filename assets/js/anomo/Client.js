import User from './User';
import Activity from './Activity';

/**
 *
 */
class Client {
  /**
   *
   */
  constructor() {
    this.user     = new User();
    this.activity = new Activity(this.user);
  }
}

export default Client;
