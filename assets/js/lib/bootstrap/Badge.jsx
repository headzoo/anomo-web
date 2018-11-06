import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import themes from 'lib/bootstrap/themes';

/**
 *
 */
class Badge extends React.PureComponent {
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

    const classes = classNames(`badge badge-${theme}`, className);

    return (
      <div className={classes} {...props}>
        {children}
      </div>
    );
  }
}

export default Badge;
