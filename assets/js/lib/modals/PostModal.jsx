import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapActionsToProps } from 'utils';
import { Modal } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import * as uiActions from 'actions/uiActions';
import * as userActions from 'actions/userActions';

/**
 *
 */
class PostModal extends React.PureComponent {
  static propTypes = {
    isStatusSending:  PropTypes.bool.isRequired,
    uiVisibleModal:   PropTypes.func.isRequired,
    userSubmitStatus: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { isStatusSending, uiVisibleModal } = this.props;

    if (prevProps.isStatusSending && !isStatusSending) {
      uiVisibleModal('post', false);
    }
  };

  /**
   *
   */
  handleClose = () => {
    const { uiVisibleModal } = this.props;

    uiVisibleModal('post', false);
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handleSubmit = (e, values) => {
    const { userSubmitStatus } = this.props;

    e.preventDefault();
    userSubmitStatus('postModal', values.message, values.photo, values.video);
  };

  /**
   * @returns {*}
   */
  render() {
    const { ...rest } = this.props;

    return (
      <Modal
        withHeader={false}
        centered={false}
        className="modal-post"
        onClosed={this.handleClose}
        {...objects.propsFilter(rest, PostModal.propTypes, uiActions, userActions)}
      >
        <PostForm
          name="postModal"
          onSubmit={this.handleSubmit}
          withMobileForm
          withUpload
        />
      </Modal>
    );
  }
}

const mapStateToProps = state => (
  {
    isStatusSending: state.user.isStatusSending
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, userActions)
)(PostModal);
