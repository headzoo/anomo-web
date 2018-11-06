import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Modal } from 'lib/bootstrap';
import { Avatar } from 'lib';
import * as uiActions from 'actions/uiActions';

/**
 *
 */
class NotificationsModal extends React.PureComponent {
  static propTypes = {
    notifications:            PropTypes.object.isRequired,
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
    console.log(notification);
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
              message = `${n.UserName} commented on ${n.PostOwnerName}'s post`;
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
    return (
      <Modal
        title="Notifications"
        className="modal-notifications"
        onClosed={this.handleClose}
        {...objects.propsFilter(this.props, NotificationsModal.propTypes, uiActions, 'dispatch')}
      >
        {this.renderNotifications()}
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps('notifications'),
  mapActionsToProps(uiActions)
)(NotificationsModal);
