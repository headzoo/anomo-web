import { combineReducers } from 'redux';
import ui from 'reducers/uiReducer';
import user from 'reducers/userReducer';
import forms from 'reducers/formsReducer';
import anomo from 'reducers/anomoReducer';
import profile from 'reducers/profileReducer';
import activity from 'reducers/activityReducer';
import notifications from 'reducers/notificationsReducer';

/**
 * @returns {Reducer}
 */
export default function createRootReducer() {
  return combineReducers({
    ui,
    user,
    forms,
    anomo,
    profile,
    activity,
    notifications
  });
}
