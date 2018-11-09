import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapActionsToProps } from 'utils';
import { Modal } from 'lib/bootstrap';
import * as uiActions from 'actions/uiActions';

/**
 *
 */
class UserModal extends React.PureComponent {
  static propTypes = {
    visibleModals:  PropTypes.object.isRequired,
    uiVisibleModal: PropTypes.func.isRequired
  };

  /**
   *
   */
  handleClose = () => {
    const { uiVisibleModal } = this.props;

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
      ['dispatch']
    );

    return (
      <Modal
        className="modal-user modal-list"
        onClosed={this.handleClose}
        withHeader={false}
        {...rest}
      >
        <ul className="list-group">
          <li className="list-group-item">Follow User</li>
          <li className="list-group-item">Block User</li>
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
  mapActionsToProps(uiActions)
)(UserModal);
