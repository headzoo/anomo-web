/**
 * Adds commas to a number
 *
 * @param {number} number
 * @returns {string}
 */
function addCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Returns a random number between min and max
 *
 * @param {number} min
 * @param {number} max
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @param {number} number
 * @returns {string}
 */
function money(number) {
  return `$${addCommas(number)}`;
}

/**
 * @param {number} number
 * @returns {string}
 */
function percent(number) {
  return `${addCommas(number)}%`;
}

/**
 * @param {number} number
 * @param {number} precision
 * @returns {number}
 */
function toPrecision(number, precision) {
  const power = 10 ** precision;
  return Math.round(number * power) / power;
}

/**
 * @param {*} value
 * @param {boolean} strict
 * @returns {boolean}
 */
function isInt(value, strict = false) {
  if (value === undefined) {
    return false;
  }
  if (strict && Number(value) !== value) {
    return false;
  }
  const mod = value % 1;
  return mod === 0 && !isNaN(mod);
}

/**
 * @param {*} value
 * @param {boolean} strict
 * @returns {boolean}
 */
function isFloat(value, strict = false) {
  if (value === undefined) {
    return false;
  }
  if (strict && Number(value) !== value) {
    return false;
  }
  const mod = value % 1;
  return mod !== 0 && !isNaN(mod);
}

/**
 * @param {*} value
 * @param {number} radix
 * @returns {number}
 */
function parseAny(value, radix = 10) {
  if (value === undefined) {
    return 0;
  }
  if (isInt(value)) {
    return parseInt(value, radix);
  }
  if (isFloat(value)) {
    return parseFloat(value);
  }
  return 0;
}

export default {
  parseAny,
  isInt,
  isFloat,
  addCommas,
  random,
  money,
  percent,
  toPrecision
};
