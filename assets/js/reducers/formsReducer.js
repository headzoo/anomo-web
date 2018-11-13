import * as types from 'actions/formActions';
import * as defaultState from 'store/defaultState';
import { objects } from 'utils';

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function change(state, action) {
  const form        = objects.clone(state[action.formName]);
  form[action.name] = action.value;

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function changes(state, action) {
  const form        = objects.clone(state[action.formName]);
  const values      = objects.clone(action.values);

  Object.keys(values).forEach((key) => {
    form[key] = values[key];
  });

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function submitting(state, action) {
  const form        = objects.clone(state[action.formName]);
  form.isSubmitting = action.isSubmitting;

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function submitted(state, action) {
  const form        = objects.clone(state[action.formName]);
  form.isSubmitted  = action.isSubmitted;
  form.isSubmitting = false;

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function disabled(state, action) {
  const form      = objects.clone(state[action.formName]);
  form.isDisabled = action.isDisabled;

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function error(state, action) {
  const form          = objects.clone(state[action.formName]);
  form.errorMessage   = action.errorMessage;
  form.errorFields    = objects.clone(action.errorFields);
  form.successMessage = '';
  if (form.errors && action.errors) {
    form.errors = action.errors;
  }
  if (form.successes) {
    form.successes = [];
  }

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function success(state, action) {
  const form          = objects.clone(state[action.formName]);
  form.successMessage = action.successMessage;
  form.errorMessage   = '';
  form.errorFields    = {};
  if (form.errors) {
    form.errors = [];
  }
  if (form.successes && action.successes) {
    form.successes = action.successes;
  }

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function reset(state, action) {
  let form = objects.clone(state[action.formName]);

  if (defaultState.defaultForms[action.formName]) {
    form = objects.clone(defaultState.defaultForms[action.formName]);
  } else {
    Object.keys(form).forEach((key) => {
      switch (typeof form[key]) {
        case 'string':
          form[key] = '';
          break;
        case 'boolean':
          form[key] = false;
          break;
      }
    });
  }

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
function complete(state, action) {
  const form      = objects.clone(state[action.formName]);
  form.isComplete = action.isComplete;

  return {
    ...state,
    [action.formName]: form
  };
}

/**
 * @param {*} state
 * @param {*} action
 * @returns {*}
 */
export default function formsReducer(state = {}, action = {}) {
  switch (action.type) {
    case types.FORMS_CHANGE:
      return change(state, action);
    case types.FORMS_CHANGES:
      return changes(state, action);
    case types.FORMS_SUBMITTING:
      return submitting(state, action);
    case types.FORMS_SUBMITTED:
      return submitted(state, action);
    case types.FORMS_DISABLED:
      return disabled(state, action);
    case types.FORMS_ERROR:
      return error(state, action);
    case types.FORMS_SUCCESS:
      return success(state, action);
    case types.FORMS_RESET:
      return reset(state, action);
    case types.FORMS_COMPLETE:
      return complete(state, action);
    default: return state;
  }
}
