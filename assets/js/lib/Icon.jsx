import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class Icon extends React.PureComponent {
  static propTypes = {
    name:       PropTypes.string.isRequired,
    regular:    PropTypes.bool,
    size:       PropTypes.number,
    isSpinning: PropTypes.bool,
    className:  PropTypes.string
  };

  static defaultProps = {
    size:       1,
    regular:    true,
    isSpinning: false,
    className:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { name, size, regular, isSpinning, className, ...props } = this.props;

    return (
      <span
        className={classNames(
          className,
          `icon fa-${size}x fa-${name}`,
          {
            'fa-spin': isSpinning,
            'fas':     regular,
            'far':     !regular
          }
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }
}

export default Icon;
