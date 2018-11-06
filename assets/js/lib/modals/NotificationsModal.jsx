import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Modal } from 'lib/bootstrap';
import { Avatar, withRouter } from 'lib';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as notificationActions from 'actions/notificationsActions';

/**
 *
 */
class NotificationsModal extends React.PureComponent {
  static propTypes = {
    notifications:            PropTypes.object.isRequired,
    history:                  PropTypes.object.isRequired,
    notificationsRead:        PropTypes.func.isRequired,
    uiNotificationsModalOpen: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  handleClose = () => {
    const { uiNotificationsModalOpen } = this.props;

    uiNotificationsModalOpen(false);
  };

  /**
   * @param {Event} e
   * @param {*} notification
   */
  handleNotificationClick = (e, notification) => {
    const { history, notificationsRead, uiNotificationsModalOpen } = this.props;

    notificationsRead(notification.ID);
    uiNotificationsModalOpen(false);
    history.push(routes.route('activity', {
      refID:      notification.ContentID,
      actionType: notification.ContentType
    }));
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
            case '13':
              message = `${n.UserName} liked your post`;
              break;
            case '14':
              if (n.UserName === n.PostOwnerName) {
                message = `${n.UserName} commented on their post`;
              } else {
                message = `${n.UserName} commented on ${n.PostOwnerName}'s post`;
              }
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
  render() {
    const props = objects.propsFilter(
      this.props,
      NotificationsModal.propTypes,
      uiActions,
      ['dispatch', 'routerParams', 'routerQuery', 'staticContext']
    );

    return (
      <Modal
        title="Notifications"
        className="modal-notifications"
        onClosed={this.handleClose}
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
