import { objects } from 'utils';

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
   * @param {string} str
   */
  unescape = (str) => {
    return str
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  };

  /**
   * @param {string} message
   * @returns {string}
   */
  unescapeUnicode = (message) => {
    try {
      return JSON.parse(`"${this.unescape(message).replace(/"/g, '\\"')}"`);
    } catch (error) {
      return message;
    }
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
   * @param {*} activity
   * @returns {*}
   */
  sanitizeActivity = (activity) => {
    const a = objects.clone(activity);

    a.IsDeleted       = false;
    a.DeleteIsSending = false;
    a.LikeIsLoading   = false;

    if (!a.LikeList) {
      a.LikeList = [];
    }
    if (a.Message) {
      a.Message = this.filterMessage(a.Message);
    }
    if (a.ListComment) {
      a.ListComment = a.ListComment.map((comment) => {
        comment.Content         = this.unescapeUnicode(comment.Content);
        comment.IsDeleted       = false;
        comment.DeleteIsSending = false;
        comment.LikeIsLoading   = false;
        return comment;
      });
    }

    return a;
  };
}

export default Activities;
