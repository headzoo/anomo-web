import React from 'react';
import twemoji from 'twemoji';
import Link from 'lib/Link';

/**
 * @param {string} mention
 * @param {Array} tags
 * @returns {number}
 */
const getUserIDFromMention = (mention, tags) => {
  for (let i = 0; i < tags.length; i++) {
    if (tags[i].name && tags[i].name.toUpperCase() === mention.toUpperCase()) {
      return tags[i].id;
    }
  }

  return 0;
};

/**
 * @param {string} url
 * @param {number} keyIndex
 * @returns {*}
 */
const handleURL = (url, keyIndex) => {
  return React.createElement('a', {
    'key':       `link_${keyIndex}`,
    'href':      url,
    'target':    '_blank',
    'className': 'anchor'
  }, url);
};

/**
 * @param {string} text
 * @returns {Array}
 */
const tokenize = (text) => {
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

  return tokens.filter(n => n);
};

/**
 * @param {Array} tokens
 * @returns {Array}
 */
const parseEmoji = (tokens) => {
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
 * @param {Array} tags
 * @returns {Array}
 */
const parseMentions = (tokens, tags) => {
  const newTokens = [];
  let keyIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const nextToken = tokens[i + 1];
    if (tokens[i] === '@' && nextToken && typeof nextToken === 'string' && nextToken.match(/^\w+$/) && tags.length > 0) {
      const mention = `@${nextToken}`;
      const userID  = getUserIDFromMention(mention, tags);
      if (userID !== 0) {
        const anchor = React.createElement(Link, {
          'key':       `mention_${keyIndex}`,
          'name':      'profile',
          'params':    { id: userID },
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
const parseHashtags = (tokens) => {
  const newTokens = [];
  let keyIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const nextToken = tokens[i + 1];
    if (tokens[i] === '#' && nextToken && typeof nextToken === 'string' && nextToken.match(/^\w+$/)) {
      const anchor = React.createElement(Link, {
        'key':       `hashtag_${keyIndex}`,
        'name':      'hashtag',
        'params':    { hashtag: nextToken.replace('#', '') },
        'className': 'anchor anchor-hashtag'
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
const parseMarkdown = (tokens) => {
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
 * @param {Array} tokens
 * @returns {Array}
 */
const parseLinks = (tokens) => {
  const newTokens = [];
  let keyIndex = 0;
  const breakChars = [' ', "\n", "\r", "\t"]; // eslint-disable-line

  for (let i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'string' && tokens.slice(i, i + 4).join('').match(/https?:\/\//)) {
      let y = i;
      const buffer = [];
      for (; y < tokens.length; y++) {
        if (typeof tokens[y] === 'string') {
          if (breakChars.indexOf(tokens[y]) === -1) {
            buffer.push(tokens[y]);
          } else {
            newTokens.push(tokens[y]);
            break;
          }
        } else {
          newTokens.push(tokens[y]);
        }
      }

      if (buffer.length > 0) {
        const anchor = handleURL(buffer.join(''), keyIndex);
        keyIndex += 1;
        i = y + 1;
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
 * @param {string} text
 * @param {Array} tags
 * @returns {Array}
 */
const parseText = (text, tags = []) => {
  if (!text || text === '...') { // optimization for post preview
    return [text];
  }

  let tokens = tokenize(text);
  tokens     = parseEmoji(tokens);
  tokens     = parseMentions(tokens, tags);
  tokens     = parseHashtags(tokens);
  tokens     = parseLinks(tokens);
  // tokens     = parseMarkdown(tokens);

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

export default {
  parseText
};
