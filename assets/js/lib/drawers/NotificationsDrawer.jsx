import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'rc-drawer';
import { connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Button } from 'lib/bootstrap';
import { Avatar, Icon, Link, LinkButton, withRouter } from 'lib';
import routes from 'store/routes';
import * as constants from 'anomo/constants';
import * as uiActions from 'actions/uiActions';
import * as notificationActions from 'actions/notificationsActions';

/**
 *
 */
class NotificationsDrawer extends React.PureComponent {
  static propTypes = {
    ui:                   PropTypes.object.isRequired,
    user:                 PropTypes.object.isRequired,
    open:                 PropTypes.bool,
    notifications:        PropTypes.object.isRequired,
    history:              PropTypes.object.isRequired,
    notificationsRead:    PropTypes.func.isRequired,
    notificationsReadAll: PropTypes.func.isRequired,
    uiVisibleModal:       PropTypes.func.isRequired,
    uiVisibleDrawer:      PropTypes.func.isRequired
  };

  static defaultProps = {
    open: false
  };

  /**
   *
   */
  close = () => {
    const { uiVisibleDrawer } = this.props;

    uiVisibleDrawer('notifications', false);
  };

  /**
   * @param {Event} e
   * @param {*} notification
   */
  handleNotificationClick = (e, notification) => {
    const { history, notificationsRead } = this.props;
    const { ID, RefID, ContentID, ContentType, SendUserID } = notification;

    this.close();
    notificationsRead(ID);

    switch (notification.Type) {
      case constants.NOTIFICATION_FOLLOW:
        history.push(routes.route('profile', {
          id: SendUserID
        }));
        break;
      case constants.NOTIFICATION_LIKE_POST:
        history.push(routes.route('activity', {
          refID:      ContentID,
          actionType: ContentType
        }));
        break;
      case constants.NOTIFICATION_COMMENT:
        history.push({
          hash:     `#comment-${RefID}`,
          pathname: routes.route('activity', {
            refID:      ContentID,
            actionType: ContentType
          })
        });
        break;
      case constants.NOTIFICATION_LIKE_COMMENT:
        history.push(routes.route('activity', {
          refID:      ContentID,
          actionType: ContentType
        }));
        break;
    }
  };

  /**
   *
   */
  handleClearAllClick = () => {
    const { notificationsReadAll } = this.props;

    setTimeout(this.close, 250);
    notificationsReadAll();
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
  handleSettingsClick = () => {
    const { history } = this.props;

    this.close();
    history.push(routes.route('settings'));
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    const { user } = this.props;

    return (
      <div className="drawer-header">
        <Link name="profile" params={{ id: user.UserID }} onClick={this.close}>
          <Avatar src={user.Avatar} md />
        </Link>
        <h3>{user.UserName}</h3>
        <Icon
          name="cog"
          title="Settings"
          onClick={this.handleSettingsClick}
        />
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderNotifications = () => {
    const { user, notifications } = this.props;
    const { UserName, followingUserNames } = user;

    if (notifications.notifications.length === 0) {
      return (
        <div className="gutter">
          No notifications.
        </div>
      );
    }

    return (
      <ul className="list-group drawer-notifications-list-group">
        {notifications.notifications.map((n) => {
          let icon    = 'comment';
          let message = '';
          switch (n.Type) {
            case constants.NOTIFICATION_LIKE_POST:
              icon    = 'heart';
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
              icon    = 'star';
              message = `${n.UserName} followed you on Anomo`;
              break;
            case constants.NOTIFICATION_MENTION:
              icon    = 'comments';
              message = `${n.UserName} mentioned you`;
              break;
            case constants.NOTIFICATION_LIKE_COMMENT:
              icon    = 'heart';
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
              <div className="drawer-notifications-avatar">
                <Avatar src={n.Avatar} following={followingUserNames.indexOf(UserName) !== -1} sm />
              </div>
              <div className="drawer-notifications-message">
                <Icon name={icon} />
                {message}
              </div>
              <div>
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
    const { ui, notifications, open, ...props } = this.props;

    return (
      <Drawer
        open={open}
        level={null}
        handler={false}
        onMaskClick={this.close}
        className="drawer-notifications"
        width={ui.deviceSize === 'xs' ? '75vw' : '15vw'}
        {...props}
      >
        {this.renderHeader()}
        {this.renderNotifications()}
        <div className="drawer-footer gutter-sides gutter-top">
          <Button
            onClick={this.handleClearAllClick}
            disabled={notifications.notifications.length === 0}
            block
          >
            Clear Notifications
          </Button>
          <LinkButton onClick={this.close} name="logout" block>
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
