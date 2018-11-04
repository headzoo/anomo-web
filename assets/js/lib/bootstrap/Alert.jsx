import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import themes from './themes';

/**
 *
 */
class Alert extends React.PureComponent {
  static propTypes = {
    theme:     PropTypes.oneOf(themes),
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    theme:     themes[0],
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { theme, className, children, ...props } = this.props;

    return (
      <div className={classNames(`alert alert-${theme}`, className)} role="alert" {...props}>
        {children}
      </div>
    );
  }
}

export default Alert;
