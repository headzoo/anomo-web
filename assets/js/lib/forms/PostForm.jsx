import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils';
import { Card, CardBody, Button } from 'lib/bootstrap';
import { Form, Textarea } from 'lib/forms';
import { Icon } from 'lib';

/**
 *
 */
class PostForm extends React.PureComponent {
  static propTypes = {
    post:       PropTypes.object.isRequired,
    withUpload: PropTypes.bool,
    onSubmit:   PropTypes.func
  };

  static defaultProps = {
    withUpload: false,
    onSubmit:   () => {}
  };

  /**
   *
   */
  handleUploadClick = () => {
    alert('Not implemented yet.');
  };

  /**
   * @returns {*}
   */
  render() {
    const { post, withUpload, onSubmit } = this.props;

    return (
      <Card className="card-form-post">
        <CardBody>
          <Form name="post" onSubmit={onSubmit} disabled={post.isSubmitting} required>
            <div className="card-form-post-inputs">
              {withUpload && (
                <div className="card-form-post-upload">
                  <Icon
                    name="camera"
                    title="Upload"
                    onClick={this.handleUploadClick}
                  />
                </div>
              )}
              <div className="card-form-post-message">
                <Textarea
                  name="message"
                  id="form-post-message"
                  placeholder="Add to conversation"
                />
              </div>
              <div className="card-form-post-btn">
                <Button block>
                  Post
                </Button>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    post: state.forms.post
  };
};

export default connect(mapStateToProps)(PostForm);
