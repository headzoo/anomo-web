import history from 'store/history';
import User from './User';
import Proxy from './Proxy';
import endpoints from './endpoints';

/**
 *
 */
class Client {
  /**
   *
   */
  constructor() {
    this.user      = new User();
    this.proxy     = new Proxy();
    this.endpoints = endpoints;
    this.history   = history;
  }
}

export default Client;
