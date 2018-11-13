import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils';
import enhanceWithClickOutside from 'react-click-outside';
import { formChange } from 'actions/formActions';
import { Card, CardBody, Button } from 'lib/bootstrap';
import { Form, Input, Textarea } from 'lib/forms';
import { Icon, Image, EmojiPopper, withConfig } from 'lib';

/**
 *
 */
class PostForm extends React.PureComponent {
  static propTypes = {
    post:       PropTypes.object.isRequired,
    config:     PropTypes.object.isRequired,
    withUpload: PropTypes.bool,
    onSubmit:   PropTypes.func,
    dispatch:   PropTypes.func.isRequired
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
      emojiOpen:   false,
      focused:     false,
      photoSource: ''
    };
    this.photo = React.createRef();
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { post } = this.props;

    if (prevProps.post.isSubmitting && !post.isSubmitting) {
      this.setState({ focused: false });
    }
  };

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
    this.setState({ photoSource: '' });
  };

  /**
   * @param {Event} e
   * @param {string} value
   * @param {string} name
   */
  handleChange = (e, value, name) => {
    if (name === 'photo') {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.setState({ photoSource: event.target.result });
      };
      reader.readAsDataURL(this.photo.current.files()[0]);
    }
  };

  /**
   *
   */
  handleEmojiClick = () => {
    const { emojiOpen } = this.state;

    this.setState({ emojiOpen: !emojiOpen });
  };

  /**
   * @param {*} emoji
   */
  handleEmojiSelect = (emoji) => {
    const { post, dispatch } = this.props;

    dispatch(formChange('post', 'message', `${post.message}${emoji.native}`));
    this.setState({ emojiOpen: false });
  };

  /**
   *
   */
  handleClickOutside = () => {
    this.setState({ focused: false });
  };

  /**
   *
   */
  handleMessageFocus = () => {
    this.setState({ focused: true });
  };

  /**
   * @returns {*}
   */
  render() {
    const { post, config, withUpload } = this.props;
    const { emojiOpen, photoSource, focused } = this.state;

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
              <div className="card-form-post-emoji">
                <EmojiPopper
                  open={emojiOpen}
                  onClick={this.handleEmojiClick}
                  onSelect={this.handleEmojiSelect}
                />
              </div>
              <div className="card-form-post-message">
                <Textarea
                  name="message"
                  id="form-post-message"
                  onFocus={this.handleMessageFocus}
                  placeholder="Add to conversation"
                  className={focused ? 'focused' : ''}
                />
                <Input
                  type="file"
                  name="photo"
                  ref={this.photo}
                  id="form-post-photo"
                  style={{ display: 'none' }}
                  accept={config.imageTypes}
                />
              </div>
              <div className="card-form-post-btn">
                <Button disabled={post.isSubmitting} block>
                  Post
                </Button>
              </div>
            </div>
            {photoSource && (
              <div className="card-form-post-photo-preview">
                <Image data={{ src: photoSource, alt: 'Preview' }} />
              </div>
            )}
          </Form>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = state => (
  {
    post: state.forms.post
  }
);

export default connect(
  mapStateToProps
)(withConfig(enhanceWithClickOutside(PostForm)));
