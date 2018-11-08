import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils';
import { Card, CardBody, Button } from 'lib/bootstrap';
import { Form, Input, Textarea } from 'lib/forms';
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
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      photoFilename: ''
    };
    this.photo = React.createRef();
  }

  /**
   *
   */
  handleUploadClick = () => {
    this.photo.current.click();
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handleSubmit = (e, values) => {
    const { onSubmit } = this.props;

    if (values.photo) {
      const photo = this.photo.current.files()[0];
      if (photo) {
        values.photo = photo;
      } else {
        values.photo = '';
      }
    }

    onSubmit(e, values);
    this.setState({ photoFilename: '' });
  };

  /**
   * @param {Event} e
   * @param {string} value
   * @param {string} name
   */
  handleChange = (e, value, name) => {
    if (name === 'photo') {
      this.setState({ photoFilename: value });
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { post, withUpload } = this.props;
    const { photoFilename } = this.state;

    return (
      <Card className="card-form-post">
        <CardBody>
          <Form
            name="post"
            onSubmit={this.handleSubmit}
            onChange={this.handleChange}
            disabled={post.isSubmitting}
          >
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
                <Input
                  type="file"
                  name="photo"
                  ref={this.photo}
                  id="form-post-photo"
                  style={{ display: 'none' }}
                  accept="image/jpg,image/jpeg,image/png,image/gif"
                />
              </div>
              <div className="card-form-post-btn">
                <Button block>
                  Post
                </Button>
              </div>
            </div>
            {photoFilename && (
              <div className="card-form-post-filename">
                {photoFilename}
              </div>
            )}
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
