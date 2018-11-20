import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormGroup, Label } from 'lib/forms';
import FormContext from 'context/formContext';
import themes from 'lib/bootstrap/themes';
import objects from 'utils/objects';

/**
 *
 */
class Checkbox extends React.PureComponent {
  static propTypes = {
    id:           PropTypes.string.isRequired,
    name:         PropTypes.string,
    value:        PropTypes.string,
    label:        PropTypes.string,
    theme:        PropTypes.oneOf(themes),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    radio:        PropTypes.bool,
    checked:      PropTypes.bool,
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    inline:       PropTypes.bool,
    circle:       PropTypes.bool,
    onChange:     PropTypes.func,
    context:      PropTypes.object.isRequired
  };

  static defaultProps = {
    name:         '',
    label:        '',
    value:        '',
    errorMessage: '',
    theme:        themes[0],
    radio:        false,
    checked:      false,
    disabled:     false,
    required:     false,
    inline:       false,
    circle:       false,
    onChange:     null
  };

  static unityFormType = 'checkbox';

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    const name    = props.name || props.id;
    const checked = (props.context.values[name] !== undefined)
      ? props.context.values[name]
      : props.checked;
    this.state = {
      checked
    };
  }

  /**
   * @param {React.FormEvent} e
   * @param {*} context
   */
  handleChange = (e, context) => {
    const { id, name, value, onChange } = this.props;

    const checked = !this.state.checked;
    this.setState({ checked });

    const cb = (onChange || context.onChange) || (() => {});
    cb(e, checked, name || id, value);
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
      radio,
      inline,
      circle,
      context,
      errorMessage,
      disabled,
      required,
      ...props
    } = this.props;
    const { checked } = this.state;

    const inputName    = name || id;
    const inputChecked = (context.values[inputName] !== undefined) ? context.values[inputName] : checked;
    const classes      = classNames(`forms-custom-checkbox-${theme}`, {
      'forms-custom-checkbox-inline': inline,
      'forms-custom-checkbox-circle': circle
    });

    return (
      <FormGroup
        htmlFor={id}
        className={classes}
        required={context.required || required}
        errorMessage={context.errorFields[inputName] || errorMessage}
        checkbox
      >
        <input
          id={id}
          name={inputName}
          checked={inputChecked}
          type={radio ? 'radio' : 'checkbox'}
          required={context.required || required}
          disabled={context.disabled || disabled}
          {...objects.propsFilter(props, Checkbox.propTypes)}
          onChange={() => { /* Empty handler to prevent React throwing error. Real handler on Label. */ }}
        />
        <Label
          htmlFor={id}
          required={required}
          className="forms-custom-checkbox-label"
          onClick={e => this.handleChange(e, context)}
        >
          {label}
        </Label>
      </FormGroup>
    );
  }
}

export default props => (
  <FormContext.Consumer>
    {context => <Checkbox {...props} context={context} />}
  </FormContext.Consumer>
);
