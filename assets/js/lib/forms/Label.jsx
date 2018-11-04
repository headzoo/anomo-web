import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 */
class Label extends React.PureComponent {
  static propTypes = {
    htmlFor:  PropTypes.string.isRequired,
    required: PropTypes.bool,
    children: PropTypes.node
  };

  static defaultProps = {
    required: false,
    children: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { htmlFor, required, children, ...props } = this.props;

    if (!children) {
      return null;
    }

    return (
      <label htmlFor={htmlFor} {...props}>
        {children}
        {required && (
          <span className="forms-required">*</span>
        )}
      </label>
    );
  }
}

export default Label;
