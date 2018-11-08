import { strings, objects } from 'utils';

const pathsAndRoutes = {
  home:      '/',
  recent:    '/',
  popular:   '/popular',
  following: '/following',
  activity:  '/activity/:refID/:actionType',
  profile:   '/profile/:id',
  search:    '/search',
  login:     '/login',
  logout:    '/logout',
  about:     '/about',
  contact:   '/contact',
  privacy:   '/privacy',
  tou:       '/tou'
};

/**
 * @param {string} name
 * @returns {string}
 */
function path(name) {
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
function route(name, params = {}) {
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
