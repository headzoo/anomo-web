import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class PageTitle extends React.PureComponent {
  static propTypes = {
    lg:        PropTypes.bool,
    bold:      PropTypes.bool,
    size:      PropTypes.number,
    center:    PropTypes.bool,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    lg:        false,
    bold:      true,
    size:      1,
    center:    false,
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { lg, bold, size, center, className, children, ...props } = this.props;

    const classes = classNames('page-title', className, {
      'page-title-lg':   lg,
      'page-title-bold': bold,
      'text-center':     center
    });

    return React.createElement(`h${size}`, {
      className: classes,
      ...props
    }, children);
  }
}

export default PageTitle;
