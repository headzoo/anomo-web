import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'lib';

/**
 *
 */
class CardHeader extends React.PureComponent {
  static propTypes = {
    icon:      PropTypes.string,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    icon:      '',
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { icon, className, children, ...props } = this.props;

    return (
      <h1 className={classNames('card-header', className)} {...props}>
        {children}
        {icon && (
          <Icon name={icon} />
        )}
      </h1>
    );
  }
}

export default CardHeader;
