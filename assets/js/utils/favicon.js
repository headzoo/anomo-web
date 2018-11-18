import Favico from 'favico.js';

/**
 *
 */
class Favicon {
  /**
   *
   */
  constructor() {
    this.numNotices = 0;
    this.numNewFeed = 0;
    this._favicon    = new Favico({
      bgColor:   '#d00',
      animation: 'popFade'
    });
  }

  /**
   * @param {number} numNotices
   */
  noticeCount = (numNotices) => {
    this.numNotices = numNotices;
    if (this.numNotices > 0) {
      this._switchToNotices();
      this._favicon.badge(this.numNotices);
    } else if (this.numNewFeed > 0) {
      this._switchToFeeds();
      this._favicon.badge(this.numNewFeed);
    } else {
      this._favicon.badge(0);
    }
  };

  /**
   * @param {number} numNewFeed
   */
  newFeedCount = (numNewFeed) => {
    this.numNewFeed = numNewFeed;
    if (this.numNotices === 0) {
      this._switchToFeeds();
      this._favicon.badge(this.numNewFeed);
    }
  };

  /**
   * @private
   */
  _switchToNotices = () => {
    this._favicon.badge(0);
    this._favicon = new Favico({
      bgColor:   '#d00',
      animation: 'popFade'
    });
  };

  /**
   * @private
   */
  _switchToFeeds = () => {
    this._favicon.badge(0);
    this._favicon = new Favico({
      bgColor:   '#5774AC',
      animation: 'popFade'
    });
  };
}

export default new Favicon();
