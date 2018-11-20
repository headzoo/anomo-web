import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapActionsToProps } from 'utils';
import { Modal } from 'lib/bootstrap';
import * as uiActions from 'actions/uiActions';
import * as userActions from 'actions/userActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class CommentModal extends React.PureComponent {
  static propTypes = {
    user:                      PropTypes.object.isRequired,
    userFollow:                PropTypes.func.isRequired,
    userBlock:                 PropTypes.func.isRequired,
    visibleModals:             PropTypes.object.isRequired,
    uiVisibleModal:            PropTypes.func.isRequired,
    activityDeleteComment:     PropTypes.func.isRequired,
    activityCommentStopNotify: PropTypes.func.isRequired
  };

  /**
   * @returns {boolean}
   */
  isFollowing = () => {
    const { user, visibleModals } = this.props;
    const { comment } = visibleModals.comment;
    const { UserID } = comment;
    const { following } = user;

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
    const { comment } = visibleModals.comment;
    const { UserID } = comment;
    const { blocked } = user;

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
   * @param {Event} e
   * @param {string} item
   */
  handleClick = (e, item) => {
    const {
      userBlock,
      userFollow,
      visibleModals,
      uiVisibleModal,
      activityDeleteComment,
      activityCommentStopNotify
    } = this.props;
    const { activity, comment } = visibleModals.comment;

    switch (item) {
      case 'follow':
        userFollow(comment.UserID);
        break;
      case 'block':
        userBlock(comment.UserID);
        break;
      case 'delete':
        activityDeleteComment(comment.ID);
        break;
      case 'notifications':
        activityCommentStopNotify(activity.RefID, activity.ActionType);
        break;
    }

    uiVisibleModal('comment', false);
  };

  /**
   * @returns {*}
   */
  renderMyList = () => {
    return (
      <ul className="list-group list-group-flush">
        <li
          onClick={e => this.handleClick(e, 'notifications')}
          className="list-group-item list-group-item-action clickable"
        >
          Disable Notifications
        </li>
        <li
          onClick={e => this.handleClick(e, 'delete')}
          className="list-group-item list-group-item-action list-group-item-danger clickable"
        >
          Delete Comment
        </li>
      </ul>
    );
  };

  /**
   * @returns {*}
   */
  renderTheirList = () => {
    const { user, visibleModals } = this.props;
    const { comment } = visibleModals.comment;

    return (
      <ul className="list-group list-group-flush">
        {user.UserID === comment.UserID && (
          <li
            onClick={e => this.handleClick(e, 'notifications')}
            className="list-group-item list-group-item-action clickable"
          >
            Disable Notifications
          </li>
        )}
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
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, visibleModals, ...rest } = this.props;
    const { comment } = visibleModals.comment;

    if (!comment) {
      return null;
    }

    return (
      <Modal
        name="comment"
        withHeader={false}
        className="modal-comment modal-list"
        {...objects.propsFilter(rest, CommentModal.propTypes, uiActions, userActions, activityActions)}
      >
        {user.UserID === comment.UserID ? this.renderMyList() : this.renderTheirList()}
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
  mapActionsToProps(uiActions, userActions, activityActions)
)(CommentModal);
