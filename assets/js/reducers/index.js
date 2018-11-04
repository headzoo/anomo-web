import { combineReducers } from 'redux';
import ui from 'reducers/uiReducer';
import user from 'reducers/userReducer';
import forms from 'reducers/formsReducer';
import activity from 'reducers/activityReducer';

/**
 * @returns {Reducer}
 */
export default function createRootReducer() {
  return combineReducers({
    ui,
    user,
    forms,
    activity
  });
}
