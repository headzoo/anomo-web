import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect } from 'utils';
import { Modal } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';

/**
 *
 */
class ReplyModal extends React.PureComponent {
  static propTypes = {
    visibleModals: PropTypes.object.isRequired,
    onSubmit:      PropTypes.func
  };

  static defaultProps = {
    onSubmit: () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  /**
   *
   */
  handleOpened = () => {
    const { visibleModals } = this.props;
    const { reply } = visibleModals;
    const { value } = this.state;

    const newValue = `@${reply.UserName} `;
    if (newValue !== value) {
      this.setState({ value: newValue });
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { visibleModals, onSubmit, ...rest } = this.props;
    const { reply } = visibleModals;
    const { value } = this.state;

    if (reply === false) {
      return null;
    }

    return (
      <Modal
        name="reply"
        withHeader={false}
        className="modal-post"
        onOpened={this.handleOpened}
        {...objects.propsFilter(rest, ReplyModal.propTypes)}
      >
        <PostForm
          name="reply"
          value={value}
          onSubmit={onSubmit}
          withMobileForm
          comment
          reply
        />
      </Modal>
    );
  }
}

const mapStateToProps = state => (
  {
    visibleModals: state.ui.visibleModals
  }
);

export default connect(
  mapStateToProps
)(ReplyModal);
