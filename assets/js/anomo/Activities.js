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
}

export default Activities;
