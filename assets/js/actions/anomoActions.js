import { browser, redux } from 'utils';
import api from 'api';

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
 * @returns {function(*, *, {batch: *})}
 */
export function anomoIntentsFetch() {
  return (dispatch, getState, { batch }) => {
    dispatch(anomoIsIntentsLoading(true));

    api.request('api_anomo_intents')
      .send()
      .then((resp) => {
        dispatch(batch(
          {
            type:    ANOMO_INTENTS,
            intents: resp.ListIntent
          },
          anomoIsIntentsLoading(false)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(anomoIsIntentsLoading(false));
      });
  };
}

/**
 * @returns {function(*, *, {batch: *})}
 */
export function anomoTagsFetch() {
  return (dispatch, getState, { batch }) => {
    let tags = browser.storage.get(browser.storage.KEY_TAGS);
    if (tags) {
      return dispatch({
        type: ANOMO_TAGS,
        tags
      });
    }

    dispatch(anomoIsTagsLoading(true));

    return api.request('api_anomo_interests')
      .send()
      .then((resp) => {
        tags = [];
        resp.ListInterests.forEach((group) => {
          group.TagList.forEach((tag) => {
            tags.push({
              TagID:    tag.TagID,
              Name:     tag.Name,
              Category: group.Category
            });
          });
        });

        browser.storage.set(browser.storage.KEY_TAGS, tags);
        dispatch(batch(
          {
            type: ANOMO_TAGS,
            tags
          },
          anomoIsTagsLoading(false)
        ));
      })
      .catch((error) => {
        redux.actionCatch(error);
        dispatch(anomoIsTagsLoading(false));
      });
  };
}
