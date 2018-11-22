import history from 'store/history';
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
    this.proxy      = new Proxy(debug);
    this.activities = new Activities(debug);
    this.endpoints  = endpoints;
    this.history    = history;
  }
}

export default Client;
