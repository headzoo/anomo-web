import { objects, numbers } from 'utils';

/**
 * @param {{recent: *, following: *, popular: *}} feeds
 * @param {Function} cb
 * @returns {{recent: *, following: *, popular: *}}
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

  return feeds;
}

/**
 * @param {{recent: *, following: *, popular: *}} feeds
 * @param {string} activityID
 * @param {Function} cb
 * @returns {{recent: *, following: *, popular: *}}
 */
function traverseForActivityID(feeds, activityID, cb) {
  traverseActivities(feeds, (a) => {
    if (a.ActivityID && a.ActivityID === activityID) {
      cb(a);
    }
  });

  return feeds;
}

/**
 * @param {{recent: *, following: *, popular: *}} feeds
 * @param {string} refID
 * @param {Function} cb
 * @returns {{recent: *, following: *, popular: *}}
 */
function traverseForRefID(feeds, refID, cb) {
  traverseActivities(feeds, (a) => {
    if (a.RefID && a.RefID === refID) {
      cb(a);
    }
  });

  return feeds;
}

/**
 * @param {*} activity
 * @param {number} commentID
 * @param {Function} cb
 * @returns {*}
 */
function traverseActivityCommentsForID(activity, commentID, cb) {
  if (activity && activity.ListComment) {
    for (let i = 0; i < activity.ListComment.length; i++) {
      if (activity.ListComment[i].ID === commentID) {
        const c = cb(activity.ListComment[i]);
        if (c !== undefined) {
          activity.ListComment[i] = c;
        }
        break;
      }
    }
  }

  return activity;
}

/**
 * @param {*} feeds
 * @param {number} commentID
 * @param {Function} cb
 * @returns {*}
 */
function traverseFeedCommentsForID(feeds, commentID, cb) {
  traverseActivities(feeds, (a) => {
    traverseActivityCommentsForID(a, commentID, cb);
  });

  return feeds;
}

/**
 * @param {*} a
 * @returns {*}
 */
function toggleActivityLike(a) {
  if (!a.IsLike || a.IsLike === '0') {
    a.IsLike = '1';
    a.Like   = numbers.parseAny(a.Like) + 1;
  } else {
    a.IsLike = '0';
    a.Like   = numbers.parseAny(a.Like) - 1;
  }

  return a;
}

/**
 * @param {*} c
 * @returns {*}
 */
function toggleCommentLike(c) {
  if (!c.IsLike || c.IsLike === '0') {
    c.IsLike = '1';
    c.NumberOfLike = numbers.parseAny(c.NumberOfLike) + 1;
  } else {
    c.IsLike = '0';
    c.NumberOfLike = numbers.parseAny(c.NumberOfLike) - 1;
  }

  return c;
}

export default {
  toggleActivityLike,
  toggleCommentLike,
  traverseActivities,
  traverseForRefID,
  traverseForActivityID,
  traverseFeedCommentsForID,
  traverseActivityCommentsForID
};
