import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapActionsToProps } from 'utils';
import { Modal } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import * as uiActions from 'actions/uiActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class PostModal extends React.PureComponent {
  static propTypes = {
    isSubmitting:   PropTypes.bool.isRequired,
    uiVisibleModal: PropTypes.func.isRequired,
    activitySubmit: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { isSubmitting, uiVisibleModal } = this.props;

    if (prevProps.isSubmitting && !isSubmitting) {
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
    const { activitySubmit } = this.props;

    e.preventDefault();
    activitySubmit('postModal', values.message, values.photo, values.video);
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
        {...objects.propsFilter(rest, PostModal.propTypes, uiActions, activityActions)}
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
    isSubmitting: state.activity.isSubmitting
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, activityActions)
)(PostModal);
