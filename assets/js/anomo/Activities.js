import { objects, media } from 'utils';

/**
 *
 */
class Activities {
  /**
   * @param {boolean} debug
   */
  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * @param {string} message
   * @returns {string}
   */
  unescapeUnicode = (message) => {
    return unescape(message.replace(/\\u([\d\w]{4})/gi, (match, grp) => {
      return String.fromCharCode(parseInt(grp, 16));
    }));
  };

  /**
   * @param {string|*} message
   * @returns {string|*}
   */
  filterMessage = (message) => {
    message = JSON.parse(message);
    if (message.message) {
      message.message = this.unescapeUnicode(message.message);
    }

    return message;
  };

  /**
   * @param {string} string
   * @returns {string}
   */
  padWithLeadingZeros = (string) => {
    return new Array(5 - string.length).join('0') + string;
  };

  /**
   * @param {number} charCode
   * @returns {string}
   */
  unicodeCharEscape = (charCode) => {
    return `\\u${this.padWithLeadingZeros(charCode.toString(16))}`;
  };

  /**
   * @param {string} string
   */
  unicodeEscape = (string) => {
    return string.split('')
      .map((char) => {
        const charCode = char.charCodeAt(0);
        return charCode > 127 ? this.unicodeCharEscape(charCode) : char;
      })
      .join('');
  };

  /**
   * @param {*} activity
   * @returns {*}
   */
  sanitizeActivity = (activity) => {
    const a = objects.clone(activity);

    a.IsDeleted       = false;
    a.DeleteIsSending = false;
    a.LikeIsLoading   = false;
    a.LikeList        = a.LikeList || [];
    a.ListComment     = a.ListComment || [];

    if (a.Message) {
      a.Message = this.filterMessage(a.Message);
    }

    a.ListComment = a.ListComment.map((comment) => {
      comment.Content         = this.unescapeUnicode(comment.Content);
      comment.IsDeleted       = false;
      comment.DeleteIsSending = false;
      comment.LikeIsLoading   = false;
      return comment;
    });

    return a;
  };

  /**
   * @param {string} message
   * @returns {string}
   */
  createMessage = (message) => {
    const content = {
      message:      this.unicodeEscape(message),
      message_tags: []
    };

    return JSON.stringify(content);
  };

  /**
   * @param {Array} activities
   * @returns {Promise}
   */
  setImageDimensions = (activities) => {
    const promises = [];
    activities.forEach((a) => {
      if (a.Image) {
        promises.push(media.getImageDimensions(a.Image));
      }
    });

    return Promise.all(promises)
      .then((dims) => {
        dims.forEach((dim) => {
          activities.forEach((a) => {
            if (a.Image === dim.src) {
              a.ImageHeight = dim.height;
              a.ImageWidth  = dim.width;
            }
          });
        });

        return activities;
      });
  };
}

export default Activities;
