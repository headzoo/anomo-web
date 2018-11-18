import { favicon } from 'utils';

/**
 * @param {*} store
 * @returns {function(*): function(*=)}
 */
const faviconMiddleware = store => next => action => {
  next(action);

  if (action.type.indexOf('NOTIFICATION_') === 0 || action.type.indexOf('ACTIVITY_') === 0) {
    const state = store.getState();
    if (state.notifications.newNumber !== favicon.numNotices) {
      favicon.noticeCount(state.notifications.newNumber);
    }
    if (state.activity.feeds.recent.newNumber !== favicon.numNewFeed) {
      favicon.newFeedCount(state.activity.feeds.recent.newNumber);
    }
  }
};

export default faviconMiddleware;
