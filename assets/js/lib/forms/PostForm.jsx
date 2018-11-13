import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AnimateHeight from 'react-animate-height';
import enhanceWithClickOutside from 'react-click-outside';
import { objects, connect, mapActionsToProps } from 'utils';
import { Card, CardBody, Button } from 'lib/bootstrap';
import { Form, Input, Textarea } from 'lib/forms';
import { ActivityPreviewCard } from 'lib/cards';
import { Icon, EmojiPopper, withConfig } from 'lib';
import * as uiActions from 'actions/uiActions';
import * as formActions from 'actions/formActions';

/**
 *
 */
class PostForm extends React.PureComponent {
  static propTypes = {
    user:           PropTypes.object.isRequired,
    post:           PropTypes.object.isRequired,
    config:         PropTypes.object.isRequired,
    withUpload:     PropTypes.bool,
    onSubmit:       PropTypes.func,
    formChange:     PropTypes.func,
    uiIsPreviewing: PropTypes.func.isRequired
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
      charCount:   props.config.anomo.maxChars,
      photoSource: ''
    };
    this.photo = React.createRef();
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { post, uiIsPreviewing } = this.props;

    if (prevProps.post.isSubmitting && !post.isSubmitting) {
      this.setState({ focused: false }, () => {
        uiIsPreviewing(false);
      });
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
    const { uiIsPreviewing, config } = this.props;
    const { maxChars } = config.anomo;

    if (name === 'photo') {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.setState({ focused: true, photoSource: event.target.result }, () => {
          uiIsPreviewing(true);
        });
      };
      reader.readAsDataURL(this.photo.current.files()[0]);
    } else if (name === 'message') {
      const charCount = maxChars - value.length;
      if (charCount < 1) {
        e.preventDefault();
      }
      this.setState({ charCount });
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
    const { post, formChange } = this.props;

    formChange('post', 'message', `${post.message}${emoji.native}`);
    this.setState({ emojiOpen: false });
  };

  /**
   *
   */
  handleClickOutside = () => {
    const { post, uiIsPreviewing } = this.props;

    if (!post.message && !post.photo) {
      this.setState({ focused: false }, () => {
        uiIsPreviewing(false);
      });
    }
  };

  /**
   *
   */
  handleMessageFocus = () => {
    const { uiIsPreviewing } = this.props;

    this.setState({ focused: true }, () => {
      uiIsPreviewing(true);
    });
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, post, config, withUpload } = this.props;
    const { emojiOpen, photoSource, charCount, focused } = this.state;

    const placeholder = photoSource ? '' : 'Add to conversation';
    const previewActivity = objects.merge(user, {
      FromUserName: user.UserName,
      CreatedDate:  moment().format(''),
      Image:        photoSource,
      Message:      {
        message:      post.message || placeholder,
        message_tags: []
      }
    });

    return (
      <div>
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
                  {focused && (
                    <div className="card-form-post-message-char-count">
                      {charCount}
                    </div>
                  )}
                </div>
                <div className="card-form-post-btn">
                  <Button disabled={post.isSubmitting} block>
                    Post
                  </Button>
                </div>
              </div>
            </Form>
          </CardBody>
        </Card>
        <AnimateHeight duration={50} height={focused ? 'auto' : 0}>
          <ActivityPreviewCard activity={previewActivity} />
        </AnimateHeight>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    post: state.forms.post,
    user: state.user
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, formActions)
)(withConfig(enhanceWithClickOutside(PostForm)));
