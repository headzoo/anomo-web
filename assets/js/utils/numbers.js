/**
 * Adds commas to a number
 *
 * @param {number} number
 * @returns {string}
 */
export function numberAddCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Returns a random number between min and max
 *
 * @param {number} min
 * @param {number} max
 */
export function numberRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @param {number} number
 * @returns {string}
 */
export function numberMoney(number) {
  return `$${numberAddCommas(number)}`;
}

/**
 * @param {number} number
 * @returns {string}
 */
export function numberPercent(number) {
  return `${numberAddCommas(number)}%`;
}

/**
 * @param {number} number
 * @param {number} precision
 * @returns {number}
 */
export function numberToPrecision(number, precision) {
  const power = 10 ** precision;
  return Math.round(number * power) / power;
}

/**
 * @param {*} value
 * @param {boolean} strict
 * @returns {boolean}
 */
export function numberIsInt(value, strict = false) {
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
export function numberIsFloat(value, strict = false) {
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
export function numberParseAny(value, radix = 10) {
  if (value === undefined) {
    return 0;
  }
  if (numberIsInt(value)) {
    return parseInt(value, radix);
  }
  if (numberIsFloat(value)) {
    return parseFloat(value);
  }
  return 0;
}

export default {
  parseAny:    numberParseAny,
  isInt:       numberIsInt,
  isFloat:     numberIsFloat,
  addCommas:   numberAddCommas,
  random:      numberRandom,
  money:       numberMoney,
  percent:     numberPercent,
  toPrecision: numberToPrecision
};
