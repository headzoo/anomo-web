import Favico from 'favico.js';

/**
 *
 */
class Favicon {
  /**
   *
   */
  constructor() {
    this._numNotices = 0;
    this._numNewFeed = 0;
    this._favicon    = new Favico({
      bgColor:   '#d00',
      animation: 'popFade'
    });
  }

  /**
   * @param {number} numNotices
   */
  noticeCount = (numNotices) => {
    this._numNotices = numNotices;
    if (this._numNotices > 0) {
      this._switchToNotices();
      this._favicon.badge(this._numNotices);
    } else if (this._numNewFeed > 0) {
      this._switchToFeeds();
      this._favicon.badge(this._numNewFeed);
    } else {
      this._favicon.badge(0);
    }
  };

  /**
   * @param {number} numNewFeed
   */
  newFeedCount = (numNewFeed) => {
    this._numNewFeed = numNewFeed;
    if (this._numNotices === 0) {
      this._switchToFeeds();
      this._favicon.badge(this._numNewFeed);
    }
  };

  /**
   * @private
   */
  _switchToNotices = () => {
    this._favicon    = new Favico({
      bgColor:   '#d00',
      animation: 'popFade'
    });
  };

  /**
   * @private
   */
  _switchToFeeds = () => {
    this._favicon    = new Favico({
      bgColor:   '#5774AC',
      animation: 'popFade'
    });
  };
}

export default new Favicon();
