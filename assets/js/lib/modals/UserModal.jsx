import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapActionsToProps } from 'utils';
import { Modal } from 'lib/bootstrap';
import * as uiActions from 'actions/uiActions';
import * as userActions from 'actions/userActions';

/**
 *
 */
class UserModal extends React.PureComponent {
  static propTypes = {
    userFollow:     PropTypes.func.isRequired,
    userBlock:      PropTypes.func.isRequired,
    visibleModals:  PropTypes.object.isRequired,
    uiVisibleModal: PropTypes.func.isRequired
  };

  /**
   * @returns {boolean}
   */
  isFollowing = () => {
    const { user, visibleModals } = this.props;
    const { following } = user;
    const { UserID } = visibleModals.user;

    let found = false;
    for (let i = 0; i < following.length; i++) {
      if (following[i].UserID === UserID) {
        found = true;
        break;
      }
    }

    return found;
  };

  /**
   * @returns {boolean}
   */
  isBlocked = () => {
    const { user, visibleModals } = this.props;
    const { blocked } = user;
    const { UserID } = visibleModals.user;

    let found = false;
    for (let i = 0; i < blocked.length; i++) {
      if (blocked[i].UserID === UserID) {
        found = true;
        break;
      }
    }

    return found;
  };

  /**
   *
   */
  handleClose = () => {
    const { uiVisibleModal } = this.props;

    uiVisibleModal('user', false);
  };

  /**
   * @param {Event} e
   * @param {string} item
   */
  handleClick = (e, item) => {
    const { visibleModals, uiVisibleModal, userFollow, userBlock } = this.props;
    const { user } = visibleModals;

    switch (item) {
      case 'follow':
        userFollow(user.UserID);
        break;
      case 'block':
        userBlock(user.UserID);
        break;
    }

    uiVisibleModal('user', false);
  };

  /**
   * @returns {*}
   */
  render() {
    const { visibleModals, ...props } = this.props;

    if (visibleModals.user === false) {
      return null;
    }

    const rest = objects.propsFilter(
      props,
      UserModal.propTypes,
      uiActions,
      userActions
    );

    return (
      <Modal
        className="modal-user modal-list"
        onClosed={this.handleClose}
        withHeader={false}
        {...rest}
      >
        <ul className="list-group list-group-flush">
          {this.isFollowing() ? (
            <li
              onClick={e => this.handleClick(e, 'follow')}
              className="list-group-item list-group-item-action clickable"
            >
              Unfollow User
            </li>
          ) : (
            <li
              onClick={e => this.handleClick(e, 'follow')}
              className="list-group-item list-group-item-action clickable"
            >
              Follow User
            </li>
          )}
          {this.isBlocked() ? (
            <li
              onClick={e => this.handleClick(e, 'block')}
              className="list-group-item list-group-item-action clickable"
            >
              Unblock User
            </li>
          ) : (
            <li
              onClick={e => this.handleClick(e, 'block')}
              className="list-group-item list-group-item-action clickable"
            >
              Block User
            </li>
          )}
        </ul>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user:          state.user,
    visibleModals: state.ui.visibleModals
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, userActions)
)(UserModal);
