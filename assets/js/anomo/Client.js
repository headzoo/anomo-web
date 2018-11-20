import history from 'store/history';
import User from './User';
import Proxy from './Proxy';
import Activities from './Activities';
import endpoints from './endpoints';

/**
 *
 */
class Client {
  /**
   *
   */
  constructor(debug = false) {
    this.user       = new User(debug);
    this.proxy      = new Proxy(debug);
    this.activities = new Activities(debug);
    this.endpoints  = endpoints;
    this.history    = history;
  }
}

export default Client;
