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
  constructor() {
    this.user       = new User();
    this.proxy      = new Proxy();
    this.activities = new Activities();
    this.endpoints  = endpoints;
    this.history    = history;
  }
}

export default Client;
