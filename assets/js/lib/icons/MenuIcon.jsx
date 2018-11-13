import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects, connect, mapStateToProps } from 'utils';

/**
 *
 */
class MenuIcon extends React.PureComponent {
  static propTypes = {
    user:          PropTypes.object.isRequired,
    notifications: PropTypes.object.isRequired,
    className:     PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, notifications, className, ...props } = this.props;
    let { newNumber } = notifications;

    if (newNumber > 99) {
      newNumber = '99+';
    }

    return (
      <span
        className={classNames('icon icon-menu clickable', className)}
        {...objects.propsFilter(props, MenuIcon.propTypes, 'dispatch')}
      >
        {user.isAuthenticated && (
          <div className={classNames({ active: notifications.newNumber })}>
            {newNumber}
          </div>
        )}
      </span>
    );
  }
}

export default connect(
  mapStateToProps('user', 'notifications')
)(MenuIcon);
