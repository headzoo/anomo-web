import { objects } from 'utils';
import * as constants from 'anomo/constants';

/**
 *
 */
export const defaultAnomo = {
  tags:             [],
  intents:          [],
  isTagsLoading:    false,
  isIntentsLoading: false
};

/**
 *
 */
export const defaultUi = {
  deviceSize:    'xs',
  isLoading:     true,
  errorMessage:  '',
  errorInfo:     {},
  visibleModals: {
    user:     false,
    tags:     false,
    intents:  false,
    activity: false
  },
  visibleDrawers: {
    notifications: false
  }
};

/**
 *
 */
const commonUserElements = {
  UserID:                     0,
  UserName:                   '',
  Email:                      '',
  AboutMe:                    '',
  Avatar:                     '',
  FullPhoto:                  '',
  CoverPicture:               '',
  BirthDate:                  '',
  ProfileStatus:              '',
  FacebookID:                 '',
  FbEmail:                    '',
  Gender:                     0,
  GenderDating:               0,
  Credits:                    0,
  IsVendor:                   0,
  IsVerify:                   0,
  IsEmailVerify:              0,
  IsSocialMedia:              0,
  AllowSendGiftNotice:        0,
  AllowRevealNotice:          0,
  AllowChatNotice:            0,
  AllowAnomotionNotice:       0,
  AllowCommentActivityNotice: 0,
  AllowLikeActivityNotice:    0,
  AllowFollowNotice:          0,
  OnlyShowCountry:            0,
  AllowAnswerPollNotice:      0,
  ListIntent:                 [],
  Tags:                       [],
  RestrictMenuKey:            [],
  followers:                  [],
  following:                  [],
  blocked:                    [],
};

/**
 *
 */
export const defaultUser = {
  ...commonUserElements,
  isAuthenticated:   false,
  isSending:         false,
  isStatusSending:   false,
  isSettingsSending: false,
  errorMessage:      ''
};

/**
 *
 */
export const defaultProfile = {
  ...commonUserElements,
  isSending:       false,
  isPostsLoading:  false,
  isLastPage:      false,
  lastActivityID:  0,
  firstActivityID: 0,
  activities:      [],
  imageActivities: [],
  errorMessage:    ''
};

/**
 *
 */
const commonFeed = {
  activities:      [],
  newNumber:       0,
  lastActivityID:  0,
  firstActivityID: 0,
  isLoading:       false,
  isRefreshing:    false
};

/**
 *
 */
export const defaultActivity = {
  feeds: {
    recent: {
      ...commonFeed
    },
    popular: {
      ...commonFeed
    },
    following: {
      ...commonFeed
    }
  },
  activity:          {},
  isLoading:         false,
  isRefreshing:      false,
  isCommentsLoading: false,
  isCommentSending:  false,
  isPollSending:     false
};

/**
 *
 */
export const defaultNotifications = {
  newNumber:     0,
  notifications: []
};

/**
 *
 */
const commonFormElements = {
  errorMessage:   '',
  successMessage: '',
  isDisabled:     false,
  isSubmitting:   false,
  isSubmitted:    false,
  isComplete:     false
};

/**
 *
 */
export const defaultForms = {
  post: {
    message: '',
    photo:   '',
    ...commonFormElements
  },
  search: {
    term: '',
    ...commonFormElements
  },
  profile: {
    [constants.SETTING_ABOUT_ME]: '',
    ...commonFormElements
  },
  notifications: {
    [constants.PRIVACY_ALLOW_ANOMO_NOTICE]:            0,
    [constants.PRIVACY_ALLOW_COMMENT_ACTIVITY_NOTICE]: 0,
    [constants.PRIVACY_ALLOW_LIKE_ACTIVITY_NOTICE]:    0,
    [constants.PRIVACY_ALLOW_FOLLOW_NOTICE]:           0,
    [constants.PRIVACY_ANSWER_POLL_NOTICE]:            0,
    [constants.PRIVACY_ALLOW_REVEAL_NOTICE]:           0,
    ...commonFormElements
  },
  contact: {
    name:    '',
    email:   '',
    message: '',
    ...commonFormElements
  },
  login: {
    username: '',
    password: '',
    ...commonFormElements
  }
};

export default {
  ui:            objects.clone(defaultUi),
  user:          objects.clone(defaultUser),
  forms:         objects.clone(defaultForms),
  anomo:         objects.clone(defaultAnomo),
  profile:       objects.clone(defaultProfile),
  activity:      objects.clone(defaultActivity),
  notifications: objects.clone(defaultNotifications)
};
