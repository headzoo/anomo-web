export const ACTIVITY_LOADING = 'ACTIVITY_LOADING';
export const ACTIVITY_GET     = 'ACTIVITY_GET';

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
 * @returns {function(*, *, {anomo: *})}
 */
export function activityGet() {
  return (dispatch, getState, { anomo }) => {
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

    anomo.activity.get()
      .then((data) => {
        localStorage.setItem('feed', JSON.stringify(data));
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
