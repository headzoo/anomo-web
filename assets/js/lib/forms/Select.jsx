import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { FormGroup } from 'lib/forms';
import FormContext from 'context/formContext';

/**
 *
 */
class Select extends React.PureComponent {
  static propTypes = {
    id:           PropTypes.string.isRequired,
    name:         PropTypes.string,
    value:        PropTypes.string,
    options:      PropTypes.array,
    label:        PropTypes.string,
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    placeholder:  PropTypes.string,
    className:    PropTypes.string,
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    fixedHeight:  PropTypes.bool,
    format:       PropTypes.func,
    parse:        PropTypes.func,
    onChange:     PropTypes.func,
  };

  static defaultProps = {
    name:         '',
    value:        '',
    label:        '',
    placeholder:  '',
    className:    '',
    errorMessage: '',
    options:      [],
    disabled:     false,
    required:     false,
    fixedHeight:  false,
    format:       v => v,
    parse:        v => v,
    onChange:     () => {}
  };

  static unityFormType = 'select';

  /**
   * @param {Event} e
   * @param {*} context
   */
  handleChange = (e, context) => {
    const { id, name, parse, onChange } = this.props;

    const inputName = name || id;
    const inputValue = parse(e.currentTarget.value);

    context.onChange(e, inputValue, inputName);
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
      options,
      label,
      format,
      fixedHeight,
      errorMessage,
      placeholder,
      className,
      disabled,
      required,
      ...props
    } = this.props;

    const inputName = name || id;
    const classes   = classNames(className, 'form-control', {
      'form-control-fixed-height': fixedHeight
    });

    return (
      <FormContext.Consumer>
        {context => (
          <FormGroup
            htmlFor={id}
            label={label}
            required={context.required || required}
            errorMessage={context.errorFields[inputName] || errorMessage}
          >
            <select
              name={inputName}
              className={classes}
              placeholder={placeholder}
              disabled={context.disabled || disabled}
              required={context.required || required}
              onChange={e => this.handleChange(e, context)}
              {...objects.propsFilter(props, Select.propTypes)}
              value={format(context.values[inputName] || value)}
            >
              {placeholder && (
                <option value="" disabled hidden>
                  {placeholder}
                </option>
              )}
              {options.map((v) => {
                return (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                );
              })}
            </select>
          </FormGroup>
        )}
      </FormContext.Consumer>
    );
  }
}

export default Select;
