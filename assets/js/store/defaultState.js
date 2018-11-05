import { objects } from 'utils';

/**
 *
 */
export const defaultUi = {
  deviceSize:   'xs',
  isLoading:    true,
  errorMessage: '',
  errorInfo:    {}
};

/**
 *
 */
export const defaultUser = {
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
  isAuthenticated:            false,
  isSending:                  false,
  isStatusSending:            false,
  errorMessage:               ''
};

/**
 *
 */
export const defaultActivity = {
  activities:        [],
  activity:          {},
  page:              0,
  totalPages:        0,
  radius:            0,
  isLoading:         false,
  isCommentsLoading: false
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
  ui:       objects.clone(defaultUi),
  user:     objects.clone(defaultUser),
  forms:    objects.clone(defaultForms),
  activity: objects.clone(defaultActivity)
};
