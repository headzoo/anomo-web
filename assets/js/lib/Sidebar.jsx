import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapActionsToProps } from 'utils';
import { TransitionGroup, FadeAndSlideTransition } from 'lib/animation';
import { Button } from 'lib/bootstrap';
import { Avatar, Icon, Link, LinkButton, withRouter } from 'lib';
import routes from 'store/routes';
import * as constants from 'anomo/constants';
import * as uiActions from 'actions/uiActions';
import * as notificationActions from 'actions/notificationsActions';
import { Row } from './bootstrap';

/**
 *
 */
class Sidebar extends React.PureComponent {
  static propTypes = {
    user:                 PropTypes.object.isRequired,
    isMobile:             PropTypes.bool.isRequired,
    sidebarDocked:        PropTypes.bool.isRequired,
    notifications:        PropTypes.object.isRequired,
    history:              PropTypes.object.isRequired,
    notificationsRead:    PropTypes.func.isRequired,
    notificationsReadAll: PropTypes.func.isRequired,
    uiSidebarDocked:      PropTypes.func.isRequired,
    uiVisibleDrawer:      PropTypes.func.isRequired
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
   *
   */
  handleLogoutClick = () => {
    const { history } = this.props;

    this.close();
    history.push(routes.route('logout'));
  };

  /**
   *
   */
  handleDockClick = () => {
    const { isMobile, uiSidebarDocked, sidebarDocked } = this.props;

    if (!isMobile) {
      uiSidebarDocked(!sidebarDocked);
    }
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    const { user, isMobile } = this.props;

    return (
      <div className="drawer-header">
        <Link name="profile" params={{ id: user.UserID }} onClick={this.close}>
          <Avatar src={user.Avatar} md />
        </Link>
        <h3>{user.UserName}</h3>
        <div className="drawer-icons">
          <Icon
            name="cog"
            title="Settings"
            className="drawer-icon"
            onClick={this.handleSettingsClick}
          />
          {!isMobile && (
            <Icon
              title="Logout"
              name="sign-out-alt"
              className="drawer-icon"
              onClick={this.handleLogoutClick}
            />
          )}
        </div>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderFooter = () => {
    const { isMobile, sidebarDocked } = this.props;

    const title = sidebarDocked ? 'Undock Sidebar' : 'Dock Sidebar';
    const icon = sidebarDocked ? 'angle-double-left docked' : 'angle-double-right undocked';

    return (
      <div className="drawer-footer">
        {!isMobile && (
          <div className="drawer-dock-icon">
            <Icon
              name={icon}
              title={title}
              className="icon-dock drawer-icon clickable"
              onClick={this.handleDockClick}
            />
          </div>
        )}
        <div className="drawer-links">
          <Link name="about">
            About
          </Link>
        </div>
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
        <div className="gutter text-center text-dim">
          No notifications.
        </div>
      );
    }

    return (
      <TransitionGroup className="list-group drawer-notifications-list-group">
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
            <FadeAndSlideTransition key={n.ID} duration={250}>
              <div
                key={n.ID}
                className="list-group-item"
                onClick={e => this.handleNotificationClick(e, n)}
              >
                <div className="drawer-notifications-avatar">
                  <Avatar src={n.Avatar} following={followingUserNames.indexOf(UserName) !== -1} md />
                </div>
                <div className="drawer-notifications-message">
                  <Icon name={icon} />
                  {message}
                </div>
                <div className="drawer-notifications-buttons">
                  <Icon name="times" onClick={e => this.handleClearClick(e, n)} />
                </div>
              </div>
            </FadeAndSlideTransition>
          );
        })}
      </TransitionGroup>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { notifications, isMobile } = this.props;

    return (
      <div>
        {this.renderHeader()}
        {this.renderNotifications()}
        <div className="drawer-buttons">
          <Button
            onClick={this.handleClearAllClick}
            disabled={notifications.notifications.length === 0}
            block
          >
            Clear Notifications
          </Button>
          {isMobile && (
            <LinkButton onClick={this.close} name="logout" block>
              Logout <Icon name="sign-out-alt" />
            </LinkButton>
          )}
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    user:          state.user,
    isMobile:      state.ui.device.isMobile,
    sidebarDocked: state.ui.sidebarDocked,
    notifications: state.notifications
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, notificationActions)
)(withRouter(Sidebar));
