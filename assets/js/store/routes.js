import { strings, objects } from 'utils';

const pathsAndRoutes = {
  home:     '/',
  activity: '/activity/:refID',
  login:    '/login',
  logout:   '/logout',
  contact:  '/contact',
  privacy:  '/privacy',
  tou:      '/tou'
};

/**
 * @param {string} name
 * @returns {string}
 */
export function path(name) {
  if (!pathsAndRoutes[name]) {
    throw new Error(`Path ${name} not found.`);
  }
  return pathsAndRoutes[name];
}

/**
 * @param {string} name
 * @param {*} params
 * @returns {string}
 */
export function route(name, params = {}) {
  let p           = path(name);
  const remaining = {};

  Object.keys(params).forEach((key) => {
    const r = new RegExp(`:${key}`);
    if (p.match(r)) {
      p = p.replace(r, strings.encodeURI(params[key]));
    } else {
      remaining[key] = params[key];
    }
  });

  if (!objects.isEmpty(remaining)) {
    p = `${p}?`;
    Object.keys(remaining).forEach((key) => {
      p = `${p}${key}=${strings.encodeURI(remaining[key])}&`;
    });
    p = p.substring(0, p.length - 1);
  }

  return p;
}

export default {
  path,
  route
};
