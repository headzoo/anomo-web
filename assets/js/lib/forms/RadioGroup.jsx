import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { Label } from 'lib/forms';
import FormContext from 'context/formContext';
import themes from 'lib/bootstrap/themes';

/**
 *
 */
class RadioGroup extends React.PureComponent {
  static propTypes = {
    id:           PropTypes.string.isRequired,
    value:        PropTypes.string,
    name:         PropTypes.string,
    label:        PropTypes.string,
    values:       PropTypes.array.isRequired,
    theme:        PropTypes.oneOf(themes),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    inline:       PropTypes.bool,
    circle:       PropTypes.bool,
    context:      PropTypes.object.isRequired,
    onChange:     PropTypes.func
  };

  static defaultProps = {
    name:         '',
    value:        '',
    label:        '',
    errorMessage: '',
    theme:        themes[0],
    disabled:     false,
    required:     false,
    inline:       false,
    circle:       false,
    onChange:     () => {}
  };

  static unityFormType = 'radio';

  /**
   * @param {Event} e
   * @param {*} context
   * @param {*} item
   */
  handleChange = (e, context, item) => {
    const { id, name, onChange } = this.props;

    const inputName = name || id;
    const inputValue = item.value;

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
      label,
      theme,
      value,
      values,
      inline,
      circle,
      context,
      errorMessage,
      disabled,
      required,
      ...props
    } = this.props;

    const inputName  = name || id;
    const inputValue = (context.values[inputName] !== undefined) ? context.values[inputName] : value;
    const classes    = classNames(`forms-custom-checkbox forms-custom-checkbox-${theme}`, {
      'forms-custom-checkbox-inline': inline,
      'forms-custom-checkbox-circle': circle
    });

    return (
      <div id={id} {...objects.propsFilter(props, RadioGroup.propTypes)}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        {(errorMessage !== '' && errorMessage !== true) && (
          <div className="form-group-error-message">
            {errorMessage}
          </div>
        )}
        {values.map(item => (
          <div key={item.value} className={classes}>
            <input
              type="radio"
              name={inputName}
              value={item.value}
              id={`${id}-${item.value}`}
              checked={inputValue === item.value}
              required={context.required || required}
              disabled={context.disabled || disabled}
              onChange={() => { /* Empty handler to prevent React throwing error. Real handler on Label. */ }}
            />
            <Label
              htmlFor={`${id}-${item.value}`}
              className="forms-custom-checkbox-label"
              onClick={e => this.handleChange(e, context, item)}
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    );
  }
}

export default props => (
  <FormContext.Consumer>
    {context => <RadioGroup {...props} context={context} />}
  </FormContext.Consumer>
);
