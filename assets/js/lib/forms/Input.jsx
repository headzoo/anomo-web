import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { FormGroup } from 'lib/forms';
import FormContext from 'context/formContext';

/**
 *
 */
class Input extends React.PureComponent {
  static propTypes = {
    id:           PropTypes.string.isRequired,
    name:         PropTypes.string,
    type:         PropTypes.string,
    label:        PropTypes.string,
    value:        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    placeholder:  PropTypes.string,
    className:    PropTypes.string,
    numeric:      PropTypes.bool,
    formGroup:    PropTypes.bool,
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    format:       PropTypes.func,
    parse:        PropTypes.func,
    onChange:     PropTypes.func,
    forms:        PropTypes.object
  };

  static defaultProps = {
    name:         '',
    type:         'text',
    value:        '',
    label:        '',
    placeholder:  '',
    className:    '',
    errorMessage: '',
    formGroup:    true,
    numeric:      false,
    disabled:     false,
    required:     false,
    forms:        {},
    format:       v => v,
    parse:        v => v,
    onChange:     () => {}
  };

  static unityFormType = 'input';

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  /**
   * @returns {string|number}
   */
  getValue = () => {
    const { numeric } = this.props;
    const { value } = this.input.current;

    if (numeric) {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        return 0;
      }
      return parsed;
    }
    return value;
  };

  /**
   * Gives focus to the element
   */
  focus = () => {
    this.input.current.focus();
  };

  /**
   * Clicks the input element.
   */
  click = () => {
    this.input.current.click();
  };

  /**
   * @returns {FileList}
   */
  files = () => {
    return this.input.current.files;
  };

  /**
   * @param {Event} e
   * @param {*} context
   */
  incrementInputValue = (e, context) => {
    const { id, name, parse, onChange } = this.props;

    const cb = onChange || context.onChange;
    cb(e, parse(this.getValue() + 1), name || id);
  };

  /**
   * @param {Event} e
   * @param {*} context
   */
  decrementInputValue = (e, context) => {
    const { id, name, parse, onChange } = this.props;

    const cb = onChange || context.onChange;
    cb(e, parse(this.getValue() - 1), name || id);
  };

  /**
   * @param {Event} e
   * @param {*} context
   */
  handleChange = (e, context) => {
    const { id, name, parse, onChange } = this.props;

    const inputName = name || id;
    const inputValue = parse(this.getValue());

    if (context.onChange) context.onChange(e, inputValue, inputName);
    onChange(e, inputValue, inputName);
  };

  /**
   * @param {Event} e
   * @param {*} context
   */
  handleWheel = (e, context) => {
    const { numeric } = this.props;

    if (!numeric) {
      return;
    }
    if (e.deltaY < 0) { // Up
      this.incrementInputValue(e, context);
    } else if (e.deltaY > 0) { // Down
      this.decrementInputValue(e, context);
    }
  };

  /**
   * @param {Event} e
   * @param {*} context
   */
  handleKeyDown = (e, context) => {
    const { numeric } = this.props;

    if (!numeric) {
      return;
    }
    switch (e.keyCode) {
      case 38: // Up
        this.incrementInputValue(e, context);
        break;
      case 40: // Down
        this.decrementInputValue(e, context);
        break;
    }
  };

  /**
   * @param {*} context
   * @returns {*}
   */
  renderInput = (context) => {
    const {
      id,
      name,
      type,
      value,
      format,
      placeholder,
      className,
      disabled,
      required,
      ...props
    } = this.props;

    const inputName = name || id;

    return (
      <input
        id={id}
        type={type}
        name={inputName}
        placeholder={placeholder}
        ref={this.input}
        required={context.required || required}
        disabled={context.disabled || disabled}
        onWheel={e => this.handleWheel(e, context)}
        onKeyDown={e => this.handleKeyDown(e, context)}
        onChange={e => this.handleChange(e, context)}
        className={classNames(className, 'form-control')}
        {...objects.propsFilter(props, Input.propTypes)}
        value={format(context.values[inputName] || value)}
      />
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { id, name, type, label, formGroup, errorMessage, required } = this.props;

    if (!formGroup || type === 'hidden') {
      return (
        <FormContext.Consumer>
          {context => (
            this.renderInput(context)
          )}
        </FormContext.Consumer>
      );
    }

    const inputName = name || id;

    return (
      <FormContext.Consumer>
        {context => (
          <FormGroup
            htmlFor={id}
            label={label}
            required={context.required || required}
            errorMessage={context.errorFields[inputName] || errorMessage}
          >
            {this.renderInput(context)}
          </FormGroup>
        )}
      </FormContext.Consumer>
    );
  }
}

export default Input;
