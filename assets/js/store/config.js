import deepmerge from 'deepmerge';

let config = {
  debug:  false,
  lang:   'en',
  https:  true,
  styles: {
    primaryColor:     '#00d2d9',
    placeholderImage: ''
  }
};

/**
 * @returns {*}
 */
export function getConfig() {
  return config;
}

/**
 * @param {*} c
 * @returns {*}
 */
export function setConfig(c) {
  config = deepmerge(config, c);
  return config;
}
