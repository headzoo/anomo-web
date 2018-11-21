/**
 * @param {number} index
 * @param {string} alt1
 * @param {string} alt2
 * @returns {string}
 */
function roundRobin(index, alt1, alt2) {
  if (index % 2 === 0) {
    return alt1;
  }
  return alt2;
}

/**
 * @param {string|Array} pieces
 */
function spaceCommas(pieces) {
  if (!pieces) {
    return null;
  }
  let newPieces = pieces;
  if (Array.isArray(newPieces)) {
    newPieces = newPieces.join(', ');
  }

  return newPieces.replace(/,/g, ', ');
}

/**
 * @param {string} str
 */
function ucWords(str) {
  return str
    .replace(/^(.)|\s+(.)/g, ($1) => {
      return $1.toUpperCase();
    });
}

/**
 * @param {string} str
 * @param {number} maxLen
 * @param {string} postfix
 * @returns {string}
 */
function truncate(str, maxLen, postfix = '...') {
  if (str.length <= maxLen) {
    return str;
  }
  return `${str.substr(0, maxLen)}${postfix}`;
}

/**
 * @param {string} str
 * @param {number} count
 * @returns {string}
 */
function repeat(str, count) {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += str;
  }
  return result;
}

/**
 * @param {string} str
 * @returns {string}
 */
function encodeURI(str) {
  return encodeURIComponent(str).replace(/%20/g, '+');
}

/**
 * @param {string} str
 * @returns {string}
 */
function decodeURI(str) {
  return decodeURIComponent(str).replace(/\+/g, ' ');
}

export default {
  roundRobin,
  spaceCommas,
  repeat,
  truncate,
  ucWords,
  encodeURI,
  decodeURI
};
