import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Modal, ModalFooter, Button } from 'lib/bootstrap';
import { Avatar, withRouter } from 'lib';
import routes from 'store/routes';
import * as constants from 'anomo/constants';
import * as uiActions from 'actions/uiActions';
import * as notificationActions from 'actions/notificationsActions';

/**
 *
 */
class NotificationsModal extends React.PureComponent {
  static propTypes = {
    notifications:     PropTypes.object.isRequired,
    history:           PropTypes.object.isRequired,
    notificationsRead: PropTypes.func.isRequired,
    uiVisibleModal:    PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  handleClose = () => {
    const { uiVisibleModal } = this.props;

    uiVisibleModal('notifications', false);
  };

  /**
   * @param {Event} e
   * @param {*} notification
   */
  handleNotificationClick = (e, notification) => {
    const { history, notificationsRead, uiVisibleModal } = this.props;

    notificationsRead(notification.ID);
    uiVisibleModal('notifications', false);
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
  handleClearClick = () => {
    const { notifications, notificationsRead, uiVisibleModal } = this.props;

    notifications.notifications.forEach((n) => {
      notificationsRead(n.ID);
    });
    uiVisibleModal('notifications', false);
  };

  /**
   * @returns {*}
   */
  renderNotifications = () => {
    const { notifications } = this.props;

    return (
      <ul className="list-group">
        {notifications.notifications.map((n) => {
          let message = '';
          switch (n.Type) {
            case constants.NOTIFICATION_LIKE:
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
            case '17':
              message = `${n.UserName} liked ${n.PostOwnerName}'s post`;
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
              <div>
                <Avatar src={n.Avatar} />
                {message}
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
  renderFooter = () => {
    return (
      <ModalFooter>
        <Button onClick={this.handleClearClick}>
          Clear All
        </Button>
      </ModalFooter>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const props = objects.propsFilter(
      this.props,
      NotificationsModal.propTypes,
      uiActions,
      notificationActions,
      ['dispatch', 'routerParams', 'routerQuery', 'staticContext']
    );

    return (
      <Modal
        title="Notifications"
        footer={this.renderFooter()}
        onClosed={this.handleClose}
        className="modal-notifications"
        {...props}
        lg
      >
        {this.renderNotifications()}
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps('notifications'),
  mapActionsToProps(uiActions, notificationActions)
)(withRouter(NotificationsModal));
