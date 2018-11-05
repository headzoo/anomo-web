export const ACTIVITY_LOADING      = 'ACTIVITY_LOADING';
export const ACTIVITY_LIKE_LOADING = 'ACTIVITY_LIKE_LOADING';
export const ACTIVITY_GET          = 'ACTIVITY_GET';
export const ACTIVITY_SET          = 'ACTIVITY_SET';
export const ACTIVITY_RESET        = 'ACTIVITY_RESET';

/**
 * @param {boolean} isLoading
 * @returns {{type, isLoading: *}}
 */
export function activityIsLoading(isLoading) {
  return {
    type: ACTIVITY_LOADING,
    isLoading
  };
}

/**
 * @param {boolean} isLoading
 * @returns {{type: string, isLoading: *}}
 */
export function activityLikeIsLoading(isLoading) {
  return {
    type: ACTIVITY_LIKE_LOADING,
    isLoading
  };
}

/**
 * @returns {{type: string}}
 */
export function activityReset() {
  return {
    type: ACTIVITY_RESET
  };
}

/**
 * @param {number} lastActivityID
 * @returns {function(*, *, {anomo: *})}
 */
export function activityGetAll(lastActivityID = 0) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityIsLoading(true));

/*    const feed = JSON.parse(localStorage.getItem('feed'));
    dispatch({
      type:       ACTIVITY_GET,
      activities: feed.Activities,
      page:       parseInt(feed.Page, 10),
      totalPages: parseInt(feed.TotalPage, 10),
      radius:     parseFloat(feed.Radius)
    });
    dispatch(activityIsLoading(false));
    return;*/

    const url = endpoints.get('activityGetAll', {
      token: user.getToken(),
      lastActivityID
    });
    proxy.get(url)
      .then((data) => {
        // localStorage.setItem('feed', JSON.stringify(data));
        if (data.code === 'OK') {
          dispatch({
            type:       ACTIVITY_GET,
            activities: data.Activities,
            page:       parseInt(data.Page, 10),
            totalPages: parseInt(data.TotalPage, 10),
            radius:     parseFloat(data.Radius)
          });
        }
      })
      .finally(() => {
        dispatch(activityIsLoading(false));
      });
  };
}

/**
 * @param {*} activity
 * @returns {{type: string, activity: *}}
 */
export function activitySet(activity) {
  return {
    type: ACTIVITY_SET,
    activity
  };
}

/**
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*, *, {anomo: *})}
 */
export function activityGet(refID, actionType) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityIsLoading(true));

    const url = endpoints.get('activityGet', {
      token: user.getToken(),
      actionType,
      refID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch(activitySet(data.Activity));
        }
      })
      .finally(() => {
        dispatch(activityIsLoading(false));
      });
  };
}

/**
 * @param {number} refID
 * @param {number} actionType
 * @returns {function(*, *, {anomo: *})}
 */
export function activityLike(refID, actionType) {
  return (dispatch, getState, { user, endpoints, proxy }) => {
    dispatch(activityLikeIsLoading(true));

    const url = endpoints.get('activityLike', {
      token: user.getToken(),
      actionType,
      refID
    });
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch(activityGet(refID, actionType));
        }
      })
      .finally(() => {
        dispatch(activityLikeIsLoading(false));
      });
  };
}
