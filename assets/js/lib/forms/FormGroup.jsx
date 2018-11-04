import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Label } from 'lib/forms';

/**
 *
 */
class FormGroup extends React.PureComponent {
  static propTypes = {
    htmlFor:      PropTypes.string,
    label:        PropTypes.string,
    errorMessage: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    required:     PropTypes.bool,
    checkbox:     PropTypes.bool,
    className:    PropTypes.string,
    children:     PropTypes.node
  };

  static defaultProps = {
    label:        '',
    htmlFor:      '',
    errorMessage: '',
    checkbox:     false,
    required:     false,
    className:    '',
    children:     ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { htmlFor, label, errorMessage, checkbox, required, className, children, ...props } = this.props;

    const classes = classNames(className, {
      'form-group':            !checkbox,
      'forms-custom-checkbox': checkbox,
      'form-group-error':      errorMessage !== ''
    });

    const inputLabel = label ? (
      <Label
        htmlFor={htmlFor}
        required={required}
        className={checkbox ? 'forms-custom-checkbox-label' : ''}
      >
        {label}
      </Label>
    ) : null;

    return (
      <div className={classes} {...props}>
        {checkbox ? children : inputLabel}
        {checkbox ? inputLabel : children}
        {(errorMessage !== '' && errorMessage !== true) && (
          <div className="form-group-error-message">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
}

export default FormGroup;
