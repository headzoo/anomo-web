import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { FormGroup } from 'lib/forms';
import FormContext from 'context/formContext';

/**
 *
 */
class Textarea extends React.PureComponent {
  static propTypes = {
    id:           PropTypes.string,
    name:         PropTypes.string,
    value:        PropTypes.string,
    label:        PropTypes.string,
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    placeholder:  PropTypes.string,
    className:    PropTypes.string,
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    format:       PropTypes.func,
    parse:        PropTypes.func,
    onChange:     PropTypes.func
  };

  static defaultProps = {
    id:           '',
    name:         '',
    value:        '',
    label:        '',
    errorMessage: '',
    placeholder:  '',
    className:    '',
    disabled:     false,
    required:     false,
    format:       v => v,
    parse:        v => v,
    onChange:     () => {}
  };

  static unityFormType = 'textarea';

  /**
   * @param {Event} e
   * @param {*} context
   */
  handleChange = (e, context) => {
    const { id, name, parse, onChange } = this.props;

    const inputName = name || id;
    const inputValue = parse(this.textarea.value);

    if (context.onChange) context.onChange(e, inputValue, inputName);
    onChange(e, inputValue, inputName);
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      id,
      name,
      value,
      label,
      format,
      placeholder,
      errorMessage,
      className,
      disabled,
      required,
      ...props
    } = this.props;

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
            <textarea
              id={id}
              name={inputName}
              placeholder={placeholder}
              ref={ref => this.textarea = ref}
              required={context.required || required}
              disabled={context.disabled || disabled}
              onChange={e => this.handleChange(e, context)}
              className={classNames(className, 'form-control')}
              {...objects.propsFilter(props, Textarea.propTypes)}
              value={format(context.values[inputName] || value)}
            />
          </FormGroup>
        )}
      </FormContext.Consumer>
    );
  }
}

export default Textarea;
