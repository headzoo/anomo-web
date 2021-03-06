import { objects, browser } from 'utils';
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
  device: {
    width:    0,
    size:     'xs',
    isMobile: false
  },
  contentWidth:     551,
  activeFeed:       'recent',
  isLoading:        true,
  sidebarDocked:    false,
  errorMessage:     '',
  errorInfo:        {},
  pinnedActivities: browser.storage.get(browser.storage.KEY_PINNED_ACTIVITIES, []),
  visibleModals:    {
    user:     false,
    tags:     false,
    post:     false,
    reply:    false,
    intents:  false,
    activity: false,
    comment:  false
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
  Latitude:                   0,
  Longitude:                  0,
  ListIntent:                 [],
  Tags:                       [],
  RestrictMenuKey:            [],
  followers:                  [],
  followerUserNames:          [],
  following:                  [],
  followingUserNames:         [],
  blocked:                    [],
};

/**
 *
 */
export const defaultUser = {
  ...commonUserElements,
  searchResults:       [],
  isAuthenticated:     false,
  isSending:           false,
  isSettingsSending:   false,
  isSearchSending:     false,
  isBlockedSubmitting: false,
  isBlockedLoading:    false,
  errorMessage:        ''
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
    },
    hashtag: {
      page:    1,
      hasMore: true,
      ...commonFeed
    }
  },
  activity:          {},
  trendingHashtags:  [],
  isActivityLoading: false,
  isSubmitting:      false,
  isCommentsLoading: false,
  isCommentSending:  false,
  isLikeListLoading: false,
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
    reply:   '0',
    ...commonFormElements
  },
  postModal: {
    message: '',
    photo:   '',
    reply:   '0',
    ...commonFormElements
  },
  reply: {
    message: '',
    reply:   '0',
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
  password: {
    [constants.SETTING_OLD_PASSWORD]: '',
    [constants.SETTING_NEW_PASSWORD]: '',
    confirm:                          '',
    ...commonFormElements
  },
  notifications: {
    [constants.PRIVACY_ALLOW_ANOMOTION_NOTICE]:        0,
    [constants.PRIVACY_ALLOW_COMMENT_ACTIVITY_NOTICE]: 0,
    [constants.PRIVACY_ALLOW_LIKE_ACTIVITY_NOTICE]:    0,
    [constants.PRIVACY_ALLOW_FOLLOW_NOTICE]:           0,
    [constants.PRIVACY_ALLOW_ANSWER_POLL_NOTICE]:      0,
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
