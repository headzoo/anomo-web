import React from 'react';
import PropTypes from 'prop-types';
import twemoji from 'twemoji';
import { objects } from 'utils';
import routes from 'store/routes';

/**
 *
 */
class Message extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    tags: PropTypes.array
  };

  static defaultProps = {
    text: '',
    tags: []
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      parsed: this.parseText(props.text)
    };
  }

  /**
   * @param {*} nextProps
   * @returns {boolean}
   */
  shouldComponentUpdate = (nextProps) => {
    return this.props.text !== nextProps.text;
  };

  /**
   * @param {string} mention
   * @returns {number}
   */
  getUserIDFromMention = (mention) => {
    const { tags } = this.props;

    for (let i = 0; i < tags.length; i++) {
      if (tags[i].name && tags[i].name === mention) {
        return tags[i].id;
      }
    }

    return 0;
  };

  /**
   * @param {string} text
   * @returns {Array}
   */
  parseText = (text) => {
    let tokens = this.tokenize(text);
    tokens     = this.parseEmoji(tokens);
    tokens     = this.parseMentions(tokens);
    tokens     = this.parseHashtags(tokens);
    // tokens     = this.parseMarkdown(tokens);

    let buffer = '';
    const parsed = [];

    tokens.forEach((token) => {
      if (typeof token === 'string') {
        buffer += token;
      } else {
        if (buffer !== '') {
          parsed.push(buffer);
          buffer = '';
        }
        parsed.push(token);
      }
    });
    if (buffer !== '') {
      parsed.push(buffer);
    }

    return parsed;
  };

  /**
   * @param {string} text
   * @returns {Array}
   */
  tokenize = (text) => {
    const tokens  = [];
    const okChars = ['*', '_'];
    let buffer    = [];

    [...text].forEach((char) => {
      if (char.match(/[a-zA-Z0-9]/) || okChars.indexOf(char) !== -1) {
        buffer.push(char);
      } else {
        tokens.push(buffer.join(''));
        tokens.push(char);
        buffer = [];
      }
    });
    if (buffer.length > 0) {
      tokens.push(buffer.join(''));
    }

    return tokens;
  };

  /**
   * @param {Array} tokens
   * @returns {Array}
   */
  parseEmoji = (tokens) => {
    const newTokens = [];
    let keyIndex = 0;

    for (let i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'string') {
        const str = twemoji.parse(tokens[i]);
        const regex = new RegExp('<img class="emoji" draggable="false" alt="[^"]+" src="([^"]+)"\\/>', 'g');

        let match;
        const matches = [];
        while ((match = regex.exec(str)) !== null) {
          matches.push(match);
        }

        if (matches.length > 0) {
          matches.forEach((m) => {
            const img = React.createElement('img', {
              'src': m[1],
              'key': `emoji_${keyIndex}`,
              'className': 'emoji'
            });
            keyIndex += 1;
            newTokens.push(img);
          });
        } else {
          newTokens.push(tokens[i]);
        }
      } else {
        newTokens.push(tokens[i]);
      }
    }

    return newTokens;
  };

  /**
   * @param {Array} tokens
   * @returns {Array}
   */
  parseMentions = (tokens) => {
    const newTokens = [];
    let keyIndex = 0;

    for (let i = 0; i < tokens.length; i++) {
      const nextToken = tokens[i + 1];
      if (tokens[i] === '@' && nextToken && typeof nextToken === 'string' && nextToken.match(/^\w+$/)) {
        const mention = `@${nextToken}`;
        const userID  = this.getUserIDFromMention(mention);
        if (userID !== 0) {
          const anchor = React.createElement('a', {
            'key':       `mention_${keyIndex}`,
            'href':      routes.route('profile', { id: userID }),
            'className': 'anchor anchor-mention'
          }, mention);
          keyIndex += 1;
          i += 1;
          newTokens.push(anchor);
        } else {
          newTokens.push(tokens[i]);
        }
      } else {
        newTokens.push(tokens[i]);
      }
    }

    return newTokens;
  };

  /**
   * @param {Array} tokens
   * @returns {Array}
   */
  parseHashtags = (tokens) => {
    const newTokens = [];
    let keyIndex = 0;

    for (let i = 0; i < tokens.length; i++) {
      const nextToken = tokens[i + 1];
      if (tokens[i] === '#' && nextToken && typeof nextToken === 'string' && nextToken.match(/^\w+$/)) {
        const anchor = React.createElement('a', {
          'key':       `hashtag_${keyIndex}`,
          'className': 'anchor anchor-hashtag',
          'href':      routes.route('hashtag', { text: nextToken }),
        }, `#${nextToken}`);
        keyIndex += 1;
        i += 1;
        newTokens.push(anchor);
      } else {
        newTokens.push(tokens[i]);
      }
    }

    return newTokens;
  };

  /**
   * @param {Array} tokens
   * @returns {Array}
   */
  parseMarkdown = (tokens) => {
    const newTokens = [];
    let keyIndex = 0;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token[0] === '_' && token[token.length - 1] === '_') {
        const italic = React.createElement('i', {
          'key': `markdown_${keyIndex}`,
        }, token.slice(1, token.length - 1));
        keyIndex += 1;
        newTokens.push(italic);
      } else if (token[0] === '*' && token[token.length - 1] === '*') {
        const bold = React.createElement('strong', {
          'key': `markdown_${keyIndex}`,
        }, token.slice(1, token.length - 1));
        keyIndex += 1;
        newTokens.push(bold);
      } else {
        newTokens.push(token);
      }
    }

    return newTokens;
  };

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    if (!objects.isEqual(prevProps.text, this.props.text)) {
      this.setState({ parsed: this.parseText(this.props.text) });
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { parsed } = this.state;

    return (
      <div>
        {parsed}
      </div>
    );
  }
}

export default Message;
