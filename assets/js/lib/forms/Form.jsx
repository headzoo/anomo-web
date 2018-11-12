import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isEqual from 'lodash.isequal';
import FormContext from 'context/formContext';
import { connect, mapStateToProps } from 'utils/state';
import { formChange, formReset, formComplete } from 'actions/formActions';
import { Row, Column, Alert } from 'lib/bootstrap';
import { objects, react } from 'utils';

/**
 *
 */
class Form extends React.PureComponent {
  static propTypes = {
    name:       PropTypes.string.isRequired,
    disabled:   PropTypes.bool,
    required:   PropTypes.bool,
    reset:      PropTypes.bool,
    onSubmit:   PropTypes.func,
    onChange:   PropTypes.func,
    onComplete: PropTypes.func,
    className:  PropTypes.string,
    children:   PropTypes.node,
    forms:      PropTypes.object.isRequired,
    dispatch:   PropTypes.func.isRequired
  };

  static defaultProps = {
    reset:      true,
    disabled:   false,
    required:   false,
    className:  '',
    children:   '',
    onSubmit:   () => {},
    onChange:   () => {},
    onComplete: () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.requiredInputs = [];
  }

  /**
   * Called after the component mounts
   */
  componentDidMount() {
    const { required, children } = this.props;

    react.traverseChildren(children, (child) => {
      if (react.isFormType(child)) {
        if (required || child.props.required) {
          this.requiredInputs.push(child.props.name || child.props.id);
        }
      }
    });
  }

  /**
   * Called after the component updates
   *
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { name, dispatch, forms, onComplete } = this.props;

    if (!isEqual(prevProps.forms[name], forms[name])) {
      let isComplete = true;
      const form     = forms[name];
      this.requiredInputs.forEach((n) => {
        if (!form[n]) {
          isComplete = false;
        }
      });

      if (forms[name].isComplete !== isComplete) {
        onComplete(isComplete);
        dispatch(formComplete(name, isComplete));
      }
    }
  }

  /**
   * Called before the component unmounts
   */
  componentWillUnmount() {
    const { name, reset, dispatch } = this.props;

    if (reset) {
      dispatch(formReset(name));
    }
  }

  /**
   * @param {Event} e
   */
  handleSubmit = (e) => {
    const { elements } = this.form;
    const values   = {};

    for (let i = 0; i < elements.length; i++) {
      const { name, value, type, checked } = elements[i];
      const isCheckbox = (type === 'checkbox' || type === 'radio');
      if (name && (!isCheckbox || (isCheckbox && checked))) {
        values[name] = value;
      }
    }

    this.props.onSubmit(e, values);
  };

  /**
   * @param {Event} e
   * @param {string} value
   * @param {string} fieldName
   */
  handleChange = (e, value, fieldName) => {
    const { name, dispatch, onChange } = this.props;

    dispatch(formChange(name, fieldName, value));
    onChange(e, value, fieldName);
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      name,
      forms,
      disabled,
      required,
      className,
      children,
      ...props
    } = this.props;

    const values = forms[name];
    const contextValue = {
      values,
      required,
      onChange:    this.handleChange,
      errorFields: values.errorFields || {},
      disabled:    (disabled || values.isDisabled)
    };

    return (
      <form
        className={classNames('form', className)}
        {...objects.propsFilter(props, Form.propTypes)}
        ref={ref => this.form = ref}
        onSubmit={this.handleSubmit}
      >
        {values.successMessage && (
          <Row>
            <Column>
              <Alert theme="success">
                {values.successMessage}
              </Alert>
            </Column>
          </Row>
        )}
        {values.errorMessage && (
          <Row>
            <Column>
              <Alert theme="danger">
                {values.errorMessage}
              </Alert>
            </Column>
          </Row>
        )}
        <FormContext.Provider value={contextValue}>
          {children}
        </FormContext.Provider>
      </form>
    );
  }
}

export default connect(mapStateToProps('forms'))(Form);
