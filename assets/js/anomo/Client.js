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
  }
}

export default Client;
