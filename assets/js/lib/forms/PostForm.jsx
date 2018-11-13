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
    name:           PropTypes.string.isRequired,
    user:           PropTypes.object.isRequired,
    forms:          PropTypes.object.isRequired,
    config:         PropTypes.object.isRequired,
    deviceSize:     PropTypes.string.isRequired,
    comment:        PropTypes.bool,
    withUpload:     PropTypes.bool,
    withMobileForm: PropTypes.bool,
    onSubmit:       PropTypes.func,
    formChange:     PropTypes.func
  };

  static defaultProps = {
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
      photoSource: ''
    };
    this.photo = React.createRef();
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { forms, name } = this.props;

    if (prevProps.forms[name].isSubmitting && !forms[name].isSubmitting) {
      this.setState({ focused: false, photoSource: '' });
    }
  };

  /**
   * @param {Event} e
   */
  handleUploadClick = (e) => {
    e.preventDefault();
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
      const reader = new FileReader();
      reader.onload = (event) => {
        this.setState({ focused: true, photoSource: event.target.result });
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
    const { forms, name, formChange } = this.props;

    formChange(name, 'message', `${forms[name].message}${emoji.native}`);
    this.setState({ emojiOpen: false });
  };

  /**
   *
   */
  handleClickOutside = () => {
    const { forms, name } = this.props;

    if (!forms[name].message && !forms[name].photo) {
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
    const { user, forms, name, comment, deviceSize, config, withUpload, withMobileForm } = this.props;
    const { emojiOpen, photoSource, charCount, focused } = this.state;

    const isXs = deviceSize === 'xs' && withMobileForm;
    const placeholder = photoSource ? '' : '...';
    const previewActivity = objects.merge(user, {
      FromUserName: user.UserName,
      CreatedDate:  moment().format(''),
      Image:        photoSource,
      Message:      {
        message:      forms[name].message || placeholder,
        message_tags: []
      }
    });

    return (
      <div>
        <Card className="card-form-post">
          <CardBody>
            <Form
              name={name}
              onSubmit={this.handleSubmit}
              onChange={this.handleChange}
              disabled={forms[name].isSubmitting}
            >
              <div className="card-form-post-inputs">
                {(withUpload && !isXs) && (
                  <div className="card-form-post-upload">
                    <Icon
                      name="camera"
                      title="Upload"
                      onClick={this.handleUploadClick}
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
                    capture="camera"
                  />
                  {focused && (
                    <div className="card-form-post-message-char-count">
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
                  <Button disabled={forms[name].isSubmitting} onClick={this.handleUploadClick} block>
                    Upload
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
    forms:      state.forms,
    user:       state.user,
    deviceSize: state.ui.deviceSize
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, formActions)
)(withConfig(enhanceWithClickOutside(PostForm)));
