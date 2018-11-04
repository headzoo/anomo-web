import deepmerge from 'deepmerge';

let config = {
  debug:  false,
  lang:   'en',
  styles: {
    primaryColor:     '#00A8AF',
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
