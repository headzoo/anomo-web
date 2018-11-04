import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class Heading extends React.PureComponent {
  static propTypes = {
    size:      PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    size:      1,
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { size, className, children, ...props } = this.props;

    return React.createElement(`h${size}`, {
      className: classNames(`display-${size} heading`, className),
      ...props
    }, children);
  }
}

export default Heading;
