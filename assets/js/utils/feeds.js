import { objects } from 'utils';

/**
 * @param {{recent: *, following: *, popular: *}} feeds
 * @param {Function} cb
 */
function traverseActivities(feeds, cb) {
  objects.forEach(feeds, (feed) => {
    const len = feed.activities.length;
    for (let i = 0; i < len; i++) {
      const r = cb(feed.activities[i]);
      if (r !== undefined) {
        feed.activities[i] = r;
      }
    }
  });
}

/**
 * @param {{recent: *, following: *, popular: *}} feeds
 * @param {string} activityID
 * @param {Function} cb
 */
function traverseForActivityID(feeds, activityID, cb) {
  traverseActivities(feeds, (a) => {
    if (a.ActivityID && a.ActivityID === activityID) {
      cb(a);
    }
  });
}

/**
 * @param {{recent: *, following: *, popular: *}} feeds
 * @param {string} refID
 * @param {Function} cb
 */
function traverseForRefID(feeds, refID, cb) {
  traverseActivities(feeds, (a) => {
    if (a.RefID && a.RefID === refID) {
      cb(a);
    }
  });
}

export default {
  traverseActivities,
  traverseForRefID,
  traverseForActivityID
};
