import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import AnimateHeight from 'react-animate-height';
import enhanceWithClickOutside from 'react-click-outside';
import { objects, media, connect, mapActionsToProps } from 'utils';
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
    id:             PropTypes.string,
    name:           PropTypes.string.isRequired,
    user:           PropTypes.object.isRequired,
    forms:          PropTypes.object.isRequired,
    config:         PropTypes.object.isRequired,
    isMobile:       PropTypes.bool.isRequired,
    value:          PropTypes.string,
    reply:          PropTypes.bool,
    comment:        PropTypes.bool,
    withUpload:     PropTypes.bool,
    withMobileForm: PropTypes.bool,
    onSubmit:       PropTypes.func,
    formChange:     PropTypes.func
  };

  static defaultProps = {
    id:             '',
    value:          '',
    reply:          false,
    comment:        false,
    withUpload:     false,
    withMobileForm: false,
    onSubmit:       () => {}
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
      photoSource: '',
      videoSource: '',
      videoPoster: ''
    };
    this.photo   = React.createRef();
    this.video   = React.createRef();
    this.message = React.createRef();
  }

  /**
   *
   */
  componentDidMount = () => {
    const { name, value, reply, formChange } = this.props;

    formChange(name, 'reply', reply ? '1' : '0');
    if (value) {
      formChange(name, 'message', value);
      this.message.current.focus();
    }
  };

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { name, value, reply, formChange } = this.props;

    if (reply !== prevProps.reply) {
      formChange(name, 'reply', reply ? '1' : '0');
    }
    if (value !== prevProps.value) {
      formChange(name, 'message', value);
      this.message.current.focus();
    }
  };

  /**
   * @param {Event} e
   */
  handlePhotoClick = (e) => {
    const { videoSource } = this.state;

    e.preventDefault();
    if (videoSource === '') {
      this.photo.current.click();
    }
  };

  /**
   * @param {Event} e
   */
  handleVideoClick = (e) => {
    const { photoSource } = this.state;

    e.preventDefault();
    if (photoSource === '') {
      this.video.current.click();
    }
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handleSubmit = (e, values) => {
    const { onSubmit } = this.props;
    const { videoPoster } = this.state;

    if (values.photo) {
      const photo = this.photo.current.files()[0];
      if (photo) {
        values.photo = photo;
      } else {
        values.photo = '';
      }
    }
    if (values.video) {
      const video = this.video.current.files()[0];
      if (video) {
        values.video = video;
        values.photo = media.dataURItoBlob(videoPoster);
      } else {
        values.video = '';
      }
    }

    this.setState({
      focused:     false,
      photoSource: '',
      videoSource: '',
      videoPoster: ''
    });
    onSubmit(e, values);
  };

  /**
   * @param {Event} e
   * @param {string} value
   * @param {string} name
   */
  handleChange = (e, value, name) => {
    const { config } = this.props;
    const { maxChars } = config.anomo;

    if (name === 'photo') {
      const photoSource = window.URL.createObjectURL(this.photo.current.files()[0]);
      this.setState({
        focused: true,
        photoSource
      });
    } else if (name === 'video') {
      const videoSource = window.URL.createObjectURL(this.video.current.files()[0]);
      media.getVideoImage(videoSource, -1)
        .then((videoPoster) => {
          this.setState({
            focused: true,
            videoPoster,
            videoSource
          });
        });
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
    const { forms, name, formChange } = this.props;

    formChange(name, 'message', `${forms[name].message}${emoji.native}`);
    this.setState({ emojiOpen: false });
  };

  /**
   *
   */
  handleClickOutside = () => {
    const { forms, name } = this.props;
    const { focused } = this.state;

    if (focused && !forms[name].message && !forms[name].photo) {
      this.setState({ focused: false });
    }
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
    const { id, user, forms, name, comment, isMobile, config, withUpload, withMobileForm } = this.props;
    const { emojiOpen, photoSource, videoSource, videoPoster, charCount, focused } = this.state;

    const isXs = isMobile && withMobileForm;
    const placeholder = (photoSource || videoSource) ? '' : '...';
    const previewActivity = objects.merge(user, {
      FromUserName:   user.UserName,
      CreatedDate:    moment().format(''),
      Image:          photoSource,
      VideoURL:       videoSource,
      VideoThumbnail: videoPoster,
      Message:        {
        message:      forms[name].message || placeholder,
        message_tags: []
      }
    });
    const charCountClasses = classNames('card-form-post-message-char-count', {
      'text-warning': (charCount < 100 && charCount > 50),
      'text-danger':  (charCount < 51)
    });

    return (
      <div id={id}>
        <Card className="card-form-post">
          <CardBody>
            <Form
              name={name}
              onSubmit={this.handleSubmit}
              onChange={this.handleChange}
              disabled={forms[name].isSubmitting}
            >
              <Input
                type="hidden"
                name="reply"
                id="form-post-reply"
              />
              <div className="card-form-post-inputs">
                {(withUpload && !isXs) && (
                  <div className="card-form-post-upload">
                    <Icon
                      name="camera"
                      title="Picture"
                      onClick={this.handlePhotoClick}
                    />
                    <Icon
                      name="video"
                      title="Video"
                      onClick={this.handleVideoClick}
                    />
                  </div>
                )}
                {!isXs && (
                  <div className="card-form-post-emoji">
                    <EmojiPopper
                      open={emojiOpen}
                      onClick={this.handleEmojiClick}
                      onSelect={this.handleEmojiSelect}
                    />
                  </div>
                )}
                <div className="card-form-post-message no-gutter">
                  <Textarea
                    name="message"
                    ref={this.message}
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
                  <Input
                    type="file"
                    name="video"
                    ref={this.video}
                    id="form-post-video"
                    style={{ display: 'none' }}
                    accept="video/*"
                  />
                  {focused && (
                    <div className={charCountClasses}>
                      {charCount}
                    </div>
                  )}
                </div>
                {!isXs && (
                  <div className="card-form-post-btn">
                    <Button disabled={forms[name].isSubmitting} block>
                      Send
                    </Button>
                  </div>
                )}
              </div>
              {isXs && (
                <div className="card-form-post-btn gutter-top">
                  <Button disabled={forms[name].isSubmitting} block>
                    Send
                  </Button>
                </div>
              )}
              {isXs && (
                <div className="card-form-post-btn gutter-top">
                  <Button disabled={forms[name].isSubmitting} onClick={this.handlePhotoClick} block>
                    Add Picture
                  </Button>
                  <Button disabled={forms[name].isSubmitting} onClick={this.handleVideoClick} block>
                    Add Video
                  </Button>
                </div>
              )}
            </Form>
            {!isXs && (
              <AnimateHeight duration={50} height={focused ? 'auto' : 0}>
                <div className="gutter-top">
                  <ActivityPreviewCard
                    activity={previewActivity}
                    comment={comment}
                  />
                </div>
              </AnimateHeight>
            )}
          </CardBody>
        </Card>
        {isXs && (
          <AnimateHeight duration={50} height={focused ? 'auto' : 0}>
            <ActivityPreviewCard
              activity={previewActivity}
              comment={comment}
            />
          </AnimateHeight>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    forms:    state.forms,
    user:     state.user,
    isMobile: state.ui.device.isMobile
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, formActions)
)(withConfig(enhanceWithClickOutside(PostForm)));
