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
    visibleModals:  PropTypes.object.isRequired,
    uiVisibleModal: PropTypes.func.isRequired,
    userFollow:     PropTypes.func.isRequired,
    userBlock:      PropTypes.func.isRequired,
    activityShare:  PropTypes.func.isRequired,
    activityReport: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  handleClose = () => {
    const { uiVisibleModal } = this.props;

    uiVisibleModal('activity', false);
  };

  /**
   * @param {Event} e
   * @param {string} item
   */
  handleClick = (e, item) => {
    const { visibleModals, uiVisibleModal, userFollow, userBlock, activityShare, activityReport } = this.props;
    const { activity } = visibleModals;

    switch (item) {
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
    const { visibleModals, ...props } = this.props;

    if (visibleModals.activity === false) {
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
        className="modal-activity modal-list"
        onClosed={this.handleClose}
        withHeader={false}
        {...rest}
      >
        <ul className="list-group list-group-flush">
          <li className="list-group-item list-group-item-action clickable" onClick={e => this.handleClick(e, 'share')}>
            Share Post
          </li>
          <li className="list-group-item list-group-item-action clickable" onClick={e => this.handleClick(e, 'follow')}>
            Follow User
          </li>
          <li className="list-group-item list-group-item-action clickable" onClick={e => this.handleClick(e, 'block')}>
            Block User
          </li>
          <li className="list-group-item list-group-item-action clickable" onClick={e => this.handleClick(e, 'report')}>
            Report Post
          </li>
        </ul>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    visibleModals: state.ui.visibleModals
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, userActions, activityActions)
)(ActivityModal);
