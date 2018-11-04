export const FORMS_CHANGE     = 'FORMS_CHANGE';
export const FORMS_CHANGES    = 'FORMS_CHANGES';
export const FORMS_SUBMITTING = 'FORMS_SUBMITTING';
export const FORMS_SUBMITTED  = 'FORMS_SUBMITTED';
export const FORMS_DISABLED   = 'FORMS_DISABLED';
export const FORMS_ERROR      = 'FORMS_ERROR';
export const FORMS_SUCCESS    = 'FORMS_SUCCESS';
export const FORMS_RESET      = 'FORMS_RESET';
export const FORMS_COMPLETE   = 'FORMS_COMPLETE';

/**
 * @param {string} formName
 * @param {boolean} isSubmitting
 */
export function formSubmitting(formName, isSubmitting = true) {
  return {
    type: FORMS_SUBMITTING,
    isSubmitting,
    formName
  };
}

/**
 * @param {string} formName
 * @param {boolean} isSubmitted
 */
export function formSubmitted(formName, isSubmitted = true) {
  return {
    type: FORMS_SUBMITTED,
    isSubmitted,
    formName
  };
}

/**
 * @param {string} formName
 * @param {boolean} isDisabled
 * @returns {{type: string, isDisabled: boolean, formName: *}}
 */
export function formDisabled(formName, isDisabled = true) {
  return {
    type: FORMS_DISABLED,
    isDisabled,
    formName
  };
}

/**
 * @param {string} formName
 * @param {string} name
 * @param {string} value
 * @returns {{type, formName: *, name: *, value: *}}
 */
export function formChange(formName, name, value) {
  return {
    type: FORMS_CHANGE,
    formName,
    name,
    value
  };
}

/**
 * @param {string} formName
 * @param {*} values
 * @returns {{type, formName: *, values: *}}
 */
export function formChanges(formName, values) {
  return {
    type: FORMS_CHANGES,
    formName,
    values
  };
}

/**
 * @param {string} formName
 * @param {string} errorMessage
 * @param {*} errorFields
 * @returns {{type, errorMessage: *, formName: *}}
 */
export function formError(formName, errorMessage = '', errorFields = {}) {
  return {
    type: FORMS_ERROR,
    errorMessage,
    errorFields,
    formName
  };
}

/**
 * @param {string} formName
 * @param {string} successMessage
 * @param {Array} successes
 * @returns {{type, successMessage: *, formName: *}}
 */
export function formSuccess(formName, successMessage = '', successes = []) {
  return {
    type: FORMS_SUCCESS,
    successMessage,
    successes,
    formName
  };
}

/**
 * @param {string} formName
 * @returns {{type, formName: *}}
 */
export function formReset(formName) {
  return {
    type: FORMS_RESET,
    formName
  };
}

/**
 * @param {string} formName
 * @param {boolean} isComplete
 * @returns {{type, formName: *}}
 */
export function formComplete(formName, isComplete = true) {
  return {
    type: FORMS_COMPLETE,
    isComplete,
    formName
  };
}
