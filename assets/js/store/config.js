import deepmerge from 'deepmerge';

let config = {
  debug:      false,
  https:      true,
  lang:       'en',
  imageTypes: 'image/*',
  styles:     {
    primaryColor:     '#00d2d9',
    placeholderImage: ''
  },
  anomo: {
    maxChars: 520
  },
  axios: {
    timeout: 10000
  },
  facebook: {
    appID:  '1581500341950614',
    fields: 'name,email,picture'
  }
};

/**
 * @param {*} c
 * @returns {*}
 */
export function setConfig(c) {
  config = deepmerge(config, c);
  return config;
}

/**
 * @returns {*}
 */
export function getConfig() {
  return config;
}
