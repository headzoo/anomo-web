import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'rc-drawer';
import { connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Button } from 'lib/bootstrap';
import { Avatar, Icon, LinkButton, withRouter } from 'lib';
import routes from 'store/routes';
import * as constants from 'anomo/constants';
import * as uiActions from 'actions/uiActions';
import * as notificationActions from 'actions/notificationsActions';

/**
 *
 */
class NotificationsDrawer extends React.PureComponent {
  static propTypes = {
    ui:                PropTypes.object.isRequired,
    user:              PropTypes.object.isRequired,
    open:              PropTypes.bool,
    notifications:     PropTypes.object.isRequired,
    history:           PropTypes.object.isRequired,
    notificationsRead: PropTypes.func.isRequired,
    uiVisibleModal:    PropTypes.func.isRequired,
    uiVisibleDrawer:   PropTypes.func.isRequired
  };

  static defaultProps = {
    open: false
  };

  /**
   * @param {Event} e
   * @param {*} notification
   */
  handleNotificationClick = (e, notification) => {
    const { history, notificationsRead, uiVisibleDrawer } = this.props;

    notificationsRead(notification.ID);
    uiVisibleDrawer('notifications', false);
    if (notification.ContentID) {
      history.push(routes.route('activity', {
        refID:      notification.ContentID,
        actionType: notification.ContentType
      }));
    }
  };

  /**
   *
   */
  handleClearAllClick = () => {
    const { notifications, notificationsRead, uiVisibleDrawer } = this.props;

    notifications.notifications.forEach((n) => {
      notificationsRead(n.ID);
    });
    uiVisibleDrawer('notifications', false);
  };

  /**
   * @param {Event} e
   * @param {*} notification
   */
  handleClearClick = (e, notification) => {
    const { notificationsRead } = this.props;

    e.preventDefault();
    e.stopPropagation();
    notificationsRead(notification.ID);
  };

  /**
   *
   */
  handleLogoutClick = () => {
    const { uiVisibleDrawer } = this.props;

    uiVisibleDrawer('notifications', false);
  };

  /**
   *
   */
  handleMaskClick = () => {
    const { uiVisibleDrawer } = this.props;

    uiVisibleDrawer('notifications', false);
  };

  /**
   *
   */
  handleSettingsClick = () => {
    const { history, uiVisibleDrawer } = this.props;

    uiVisibleDrawer('notifications', false);
    history.push(routes.route('settings'));
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    const { user } = this.props;

    return (
      <div className="drawer-header">
        <Avatar src={user.Avatar} />
        <h3>{user.UserName}</h3>
        <Icon name="cog" onClick={this.handleSettingsClick} />
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderNotifications = () => {
    const { notifications } = this.props;

    if (notifications.notifications.length === 0) {
      return (
        <div className="gutter">
          No notifications.
        </div>
      );
    }

    return (
      <ul className="list-group">
        {notifications.notifications.map((n) => {
          let message = '';
          switch (n.Type) {
            case constants.NOTIFICATION_LIKE_POST:
              message = `${n.UserName} liked your post`;
              break;
            case constants.NOTIFICATION_COMMENT:
              if (n.UserName === n.PostOwnerName) {
                message = `${n.UserName} commented on their post`;
              } else {
                message = `${n.UserName} commented on ${n.PostOwnerName}'s post`;
              }
              break;
            case constants.NOTIFICATION_FOLLOW:
              message = `${n.UserName} followed you on Anomo`;
              break;
            case constants.NOTIFICATION_LIKE_COMMENT:
              message = `${n.UserName} liked your comment`;
              break;
            default:
              return null;
          }

          return (
            <li
              key={n.ID}
              className="list-group-item"
              onClick={e => this.handleNotificationClick(e, n)}
            >
              <Avatar src={n.Avatar} />
              <div>{message}</div>
              <div className="gutter-left">
                <Icon name="times" onClick={e => this.handleClearClick(e, n)} />
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { ui, open, ...props } = this.props;

    return (
      <Drawer
        open={open}
        level={null}
        handler={false}
        className="drawer-notifications"
        onMaskClick={this.handleMaskClick}
        width={ui.deviceSize === 'xs' ? '75vw' : '15vw'}
        {...props}
      >
        {this.renderHeader()}
        {this.renderNotifications()}
        <div className="drawer-footer gutter-sides gutter-top">
          <Button onClick={this.handleClearAllClick} block>
            Clear Notifications
          </Button>
          <LinkButton onClick={this.handleLogoutClick} name="logout" block>
            Logout <Icon name="sign-out-alt" />
          </LinkButton>
        </div>
      </Drawer>
    );
  }
}

export default connect(
  mapStateToProps('ui', 'user', 'notifications'),
  mapActionsToProps(uiActions, notificationActions)
)(withRouter(NotificationsDrawer));
