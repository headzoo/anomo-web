import objects from '../utils/objects';

/**
 *
 */
class Activities {
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
      return JSON.parse(`"${this.unescape(message)}"`);
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

    a.LikeIsLoading = false;
    if (a.Message) {
      a.Message = this.filterMessage(a.Message);
    }
    if (a.ListComment) {
      a.ListComment = a.ListComment.map((comment) => {
        comment.Content = this.unescapeUnicode(comment.Content);
        return comment;
      }).reverse();
    }

    return a;
  };
}

export default Activities;
