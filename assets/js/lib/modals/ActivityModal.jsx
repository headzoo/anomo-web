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
class ActivityModal extends React.PureComponent {
  static propTypes = {
    userID:         PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    following:      PropTypes.array.isRequired,
    blocked:        PropTypes.array.isRequired,
    visibleModals:  PropTypes.object.isRequired,
    uiVisibleModal: PropTypes.func.isRequired,
    userFollow:     PropTypes.func.isRequired,
    userBlock:      PropTypes.func.isRequired,
    activityShare:  PropTypes.func.isRequired,
    activityReport: PropTypes.func.isRequired,
    activityDelete: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {boolean}
   */
  isFollowing = () => {
    const { following, visibleModals } = this.props;
    const { FromUserID } = visibleModals.activity;

    let found = false;
    for (let i = 0; i < following.length; i++) {
      if (following[i].UserID === FromUserID) {
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
    const { blocked, visibleModals } = this.props;
    const { FromUserID } = visibleModals.activity;

    let found = false;
    for (let i = 0; i < blocked.length; i++) {
      if (blocked[i].UserID === FromUserID) {
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
      visibleModals,
      uiVisibleModal,
      userFollow,
      userBlock,
      activityDelete,
      activityShare,
      activityReport
    } = this.props;
    const { activity } = visibleModals;

    switch (item) {
      case 'delete':
        activityDelete(activity.ActivityID);
        break;
      case 'share':
        activityShare(activity.RefID, activity.ActionType);
        break;
      case 'report':
        activityReport(activity.RefID, activity.ActionType);
        break;
      case 'follow':
        userFollow(activity.FromUserID);
        break;
      case 'block':
        userBlock(activity.FromUserID);
        break;
    }

    uiVisibleModal('activity', false);
  };

  /**
   * @returns {*}
   */
  render() {
    const { userID, visibleModals, ...props } = this.props;
    const { activity } = visibleModals;

    if (activity === false) {
      return null;
    }

    const rest = objects.propsFilter(
      props,
      ActivityModal.propTypes,
      uiActions,
      userActions,
      activityActions,
      ['dispatch']
    );

    return (
      <Modal
        name="activity"
        className="modal-activity modal-list"
        withHeader={false}
        {...rest}
      >
        <ul className="list-group list-group-flush">
          <li
            onClick={e => this.handleClick(e, 'share')}
            className="list-group-item list-group-item-action clickable"
          >
            Share Post
          </li>
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
          <li
            onClick={e => this.handleClick(e, 'report')}
            className="list-group-item list-group-item-action clickable"
          >
            Report Post
          </li>
          {activity.FromUserID === userID && (
            <li
              onClick={e => this.handleClick(e, 'delete')}
              className="list-group-item list-group-item-action list-group-item-danger clickable"
            >
              Delete Post
            </li>
          )}
        </ul>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userID:        state.user.UserID,
    following:     state.user.following,
    blocked:       state.user.blocked,
    visibleModals: state.ui.visibleModals
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, userActions, activityActions)
)(ActivityModal);
