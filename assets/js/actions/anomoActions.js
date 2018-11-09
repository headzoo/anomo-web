import { browser } from 'utils';

export const ANOMO_TAGS            = 'ANOMO_TAGS';
export const ANOMO_TAGS_LOADING    = 'ANOMO_TAGS_LOADING';
export const ANOMO_INTENTS         = 'ANOMO_INTENTS';
export const ANOMO_INTENTS_LOADING = 'ANOMO_INTENTS_LOADING';

/**
 * @param {boolean} isIntentsLoading
 * @returns {{type, isSending: *}}
 */
export function anomoIsIntentsLoading(isIntentsLoading) {
  return {
    type: ANOMO_INTENTS_LOADING,
    isIntentsLoading
  };
}

/**
 * @param {boolean} isTagsLoading
 * @returns {{type, isSending: *}}
 */
export function anomoIsTagsLoading(isTagsLoading) {
  return {
    type: ANOMO_TAGS_LOADING,
    isTagsLoading
  };
}

/**
 * @returns {function(*, *, {proxy: *, endpoints: *})}
 */
export function anomoIntentsFetch() {
  return (dispatch, getState, { proxy, endpoints }) => {
    dispatch(anomoIsIntentsLoading(true));

    const url = endpoints.create('anomoListIntent');
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          dispatch({
            type:    ANOMO_INTENTS,
            intents: data.ListIntent
          });
        }
      })
      .finally(() => {
        dispatch(anomoIsIntentsLoading(false));
      });
  };
}

/**
 * @returns {function(*, *, {proxy: *, endpoints: *})}
 */
export function anomoTagsFetch() {
  return (dispatch, getState, { proxy, endpoints }) => {
    let tags = browser.storage.get(browser.storage.KEY_TAGS);
    if (tags) {
      dispatch({
        type: ANOMO_TAGS,
        tags
      });
      return;
    }

    dispatch(anomoIsTagsLoading(true));

    const url = endpoints.create('anomoListInterest');
    proxy.get(url)
      .then((data) => {
        if (data.code === 'OK') {
          tags = [];
          data.ListInterests.forEach((group) => {
            group.TagList.forEach((tag) => {
              tags.push({
                TagID:    tag.TagID,
                Name:     tag.Name,
                Category: group.Category
              });
            });
          });

          browser.storage.set(browser.storage.KEY_TAGS, tags);
          dispatch({
            type: ANOMO_TAGS,
            tags
          });
        }
      })
      .finally(() => {
        dispatch(anomoIsTagsLoading(false));
      });
  };
}
