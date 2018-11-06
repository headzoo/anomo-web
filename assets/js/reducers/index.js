import { combineReducers } from 'redux';
import ui from 'reducers/uiReducer';
import user from 'reducers/userReducer';
import forms from 'reducers/formsReducer';
import profile from 'reducers/profileReducer';
import activity from 'reducers/activityReducer';

/**
 * @returns {Reducer}
 */
export default function createRootReducer() {
  return combineReducers({
    ui,
    user,
    forms,
    profile,
    activity
  });
}
