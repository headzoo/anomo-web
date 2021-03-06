import isEqual from 'lodash.isequal';

const { hasOwnProperty } = Object.prototype;

/**
 * @param {Object} obj
 * @returns {boolean}
 */
function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (const key in obj) { // eslint-disable-line
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

/**
 * Performs a key comparison between two objects, deleting from the first where
 * the keys exist in the second
 *
 * Can be used to remove unwanted component prop values. For example:
 *
 * ```jsx
 * render() {
 *   const { children, className, ...props } = this.props;
 *
 *    return (
 *      <div
 *        {...objectKeyFilter(props, Item.propTypes)}
 *        className={classNames('dp-item', className)}
 *       >
 *        {children}
 *      </div>
 *    )
 * }
 * ```
 *
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Array|object} rest
 * @returns {*}
 */
function propsFilter(obj1, obj2, ...rest) {
  const obj2Keys = Object.keys(obj2);
  const newProps = Object.assign({}, obj1);
  Object.keys(newProps)
    .filter(key => obj2Keys.indexOf(key) !== -1)
    .forEach(key => delete newProps[key]);

  rest.forEach((r) => {
    if (Array.isArray(r)) {
      r.forEach((prop) => {
        delete newProps[prop];
      });
    } else if (typeof r === 'object') {
      Object.keys(r).forEach((prop) => {
        delete newProps[prop];
      });
    } else if (typeof r === 'string') {
      delete newProps[r];
    }
  });

  return newProps;
}

/**
 * Iterates over an object
 *
 * Calls the given callback function with each value and key in the object. The callback
 * receives the value as the first argument, and key as the second.
 *
 * @param {object} obj The object to iterate over
 * @param {function} cb The callback function
 * @return {object}
 */
function forEach(obj, cb) {
  for (const key of Object.keys(obj)) { // eslint-disable-line
    cb(obj[key], key);
  }

  return obj;
}

/**
 * Creates an array from the results of calling a function on each item in an object
 *
 * Does not add undefined values to the resulting array.
 *
 * @param {object} obj The object to iterate over
 * @param {function} cb The callback function
 * @returns {Array}
 */
function map(obj, cb) {
  const results = [];
  forEach(obj, (val, key) => {
    const result = cb(val, key);
    if (result !== undefined) {
      results.push(result);
    }
  });

  return results;
}

/**
 * @param {*} obj
 * @returns {*}
 */
function clone(obj) {
  const bObject = Array.isArray(obj) ? [] : {};

  forEach(obj, (value, key) => {
    let clonedValue;
    if (Array.isArray(value)) {
      clonedValue = value.slice(0);
    } else if (typeof obj[key] === 'object') {
      clonedValue = Object.assign({}, value);
    } else {
      clonedValue = value;
    }
    bObject[key] = (typeof clonedValue === 'object') ? clone(clonedValue) : clonedValue;
  });

  return bObject;
}

/**
 * @param {*} obj1
 * @param {*} obj2
 * @param {*} rest
 * @returns {*}
 */
function merge(obj1, obj2, ...rest) {
  return Object.assign({}, obj1, obj2, ...rest);
}

export default {
  isEqual,
  isEmpty,
  propsFilter,
  forEach,
  map,
  merge,
  clone
};
