import React from 'react';
import PropTypes from 'prop-types';
import { objects, dates, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Row, Column, Card, CardBody, CardText, Badge, Button, ButtonGroup } from 'lib/bootstrap';
import { Form, Input, Textarea, Hidden } from 'lib/forms';
import { TagsModal } from 'lib/modals';
import { Page, Icon, Avatar, withRouter, withConfig } from 'lib';
import routes from 'store/routes';
import * as constants from 'anomo/constants';
import * as uiActions from 'actions/uiActions';
import * as formActions from 'actions/formActions';
import * as userActions from 'actions/userActions';
import * as anomoActions from 'actions/anomoActions';

/**
 *
 */
class EditProfilePage extends React.PureComponent {
  static propTypes = {
    ui:                 PropTypes.object.isRequired,
    user:               PropTypes.object.isRequired,
    forms:              PropTypes.object.isRequired,
    anomo:              PropTypes.object.isRequired,
    config:             PropTypes.object.isRequired,
    history:            PropTypes.object.isRequired,
    formChange:         PropTypes.func.isRequired,
    formChanges:        PropTypes.func.isRequired,
    uiVisibleModal:     PropTypes.func.isRequired,
    anomoIntentsFetch:  PropTypes.func.isRequired,
    userUpdateSettings: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      tags:    props.user.Tags,
      intents: props.user.ListIntent
    };

    this.tags    = React.createRef();
    this.cover   = React.createRef();
    this.avatar  = React.createRef();
    this.intents = React.createRef();
  }

  /**
   *
   */
  componentDidMount = () => {
    const { anomoIntentsFetch } = this.props;

    anomoIntentsFetch();
    this.handleUpdate();
  };

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { user } = this.props;

    if (!objects.isEqual(user, prevProps.user)) {
      this.handleUpdate();
    }
  };

  /**
   *
   */
  handleUpdate = () => {
    const { user, formChanges } = this.props;

    const tags = user.Tags.map((t) => {
      return t.Name;
    }).join(',');
    const intents = user.ListIntent.map((i) => {
      return i.IntentID;
    }).join(',');

    formChanges('profile', {
      [constants.SETTING_ABOUT_ME]:   user.AboutMe,
      [constants.SETTING_TAGS_IDS]:   tags,
      [constants.SETTING_INTENT_IDS]: intents
    });

    this.setState({ tags: user.Tags, intents: user.ListIntent });
  };

  /**
   * @param {Event} e
   * @param {*} tag
   */
  handleRemoveTagClick = (e, tag) => {
    const { forms, formChange } = this.props;
    const { profile } = forms;

    const tags = profile[constants.SETTING_TAGS_IDS].split(',').filter((t) => {
      return t !== tag.Name;
    }).join(',');

    formChange('profile', constants.SETTING_TAGS_IDS, tags);
  };

  /**
   * @param {Event} e
   * @param {*} intent
   */
  handleRemoveIntentClick = (e, intent) => {
    const { forms, formChange } = this.props;
    const { profile } = forms;

    const intents = profile[constants.SETTING_INTENT_IDS].split(',').filter((i) => {
      return i !== intent.IntentID;
    }).join(',');

    formChange('profile', constants.SETTING_INTENT_IDS, intents);
  };

  /**
   *
   */
  handleAddTagClick = () => {
    const { uiVisibleModal } = this.props;

    uiVisibleModal('tags', true);
  };

  /**
   *
   */
  handleAddIntentClick = () => {
    const { uiVisibleModal } = this.props;

    uiVisibleModal('intents', true);
  };

  /**
   * @param {Event} e
   * @param {*} tags
   */
  handleSaveTags = (e, tags) => {
    const { formChange, uiVisibleModal } = this.props;

    const newTags = tags.map((t) => {
      return t.Name;
    }).join(',');

    uiVisibleModal('tags', false);
    formChange('profile', constants.SETTING_TAGS_IDS, newTags);
    this.setState({ tags });
  };

  /**
   * @param {Event} e
   * @param {*} intents
   */
  handleSaveIntents = (e, intents) => {
    const { formChange, uiVisibleModal } = this.props;

    const newIntents = intents.map((t) => {
      return t.IntentID;
    }).join(',');

    uiVisibleModal('intents', false);
    formChange('profile', constants.SETTING_INTENT_IDS, newIntents);
    this.setState({ intents });
  };

  /**
   *
   */
  handleCoverClick = () => {
    this.cover.current.click();
  };

  /**
   *
   */
  handleAvatarClick = () => {
    this.avatar.current.click();
  };

  /**
   *
   */
  handleCancelClick = () => {
    const { user, history } = this.props;

    history.push(routes.route('profile', { id: user.UserID }));
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handleSubmit = (e, values) => {
    const { user, history, userUpdateSettings } = this.props;

    e.preventDefault();

    if (values.cover) {
      const cover = this.cover.current.files()[0];
      if (cover) {
        values.cover = cover;
      } else {
        values.cover = '';
      }
    }
    if (values.avatar) {
      const avatar = this.avatar.current.files()[0];
      if (avatar) {
        values.avatar = avatar;
      } else {
        values.avatar = '';
      }
    }

    delete values.cover;
    delete values.avatar;

    userUpdateSettings(values);
    history.push(routes.route('profile', { id: user.UserID }));
  };

  /**
   * @returns {*}
   */
  renderTags = () => {
    const { tags } = this.state;

    const tagBadges = tags.map(tag => (
      <Badge className="profile-badge-tag" key={tag.TagID}>
        {tag.Name}
        <Icon
          name="times"
          title="Remove"
          className="clickable"
          onClick={e => this.handleRemoveTagClick(e, tag)}
        />
      </Badge>
    ));

    return (
      <div className="card-profile-tags">
        <div className="card-profile-tags-add-btn" onClick={this.handleAddTagClick}>
          <Icon name="plus" /> Add New
        </div>
        <h3>Interest</h3>
        <div className="form-edit-profile-tags">
          {tagBadges}
        </div>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderIntents = () => {
    const { intents } = this.state;

    const intentBadges = intents.map(intent => (
      <Badge className="profile-badge-tag" key={intent.IntentID}>
        {intent.Name}
        <Icon
          name="times"
          title="Remove"
          className="clickable"
          onClick={e => this.handleRemoveIntentClick(e, intent)}
        />
      </Badge>
    ));

    return (
      <div className="card-profile-intents">
        <div className="card-profile-tags-add-btn" onClick={this.handleAddIntentClick}>
          <Icon name="plus" /> Add New
        </div>
        <h3>Intents</h3>
        <div className="form-edit-profile-tags">
          {intentBadges}
        </div>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { forms, config } = this.props;
    const { profile } = forms;

    return (
      <Form
        name="profile"
        onSubmit={this.handleSubmit}
        disabled={profile.isSubmitting}
      >
        <Input
          type="file"
          name="avatar"
          ref={this.avatar}
          id="form-profile-avatar"
          style={{ display: 'none' }}
          accept={config.imageTypes}
        />
        <Input
          type="file"
          name="cover"
          ref={this.cover}
          id="form-profile-cover"
          style={{ display: 'none' }}
          accept={config.imageTypes}
        />
        <Hidden
          ref={this.tags}
          id="form-profile-tags"
          name={constants.SETTING_TAGS_IDS}
        />
        <Hidden
          ref={this.intents}
          id="form-profile-intents"
          name={constants.SETTING_INTENT_IDS}
        />
        <Row>
          <Column>
            <Textarea
              rows={3}
              label="About You"
              id="form-profile-about-me"
              className="form-control-auto-height"
              name={constants.SETTING_ABOUT_ME}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            {this.renderIntents()}
          </Column>
        </Row>
        <Row>
          <Column>
            {this.renderTags()}
          </Column>
        </Row>
        <Row>
          <Column className="gutter-top">
            <ButtonGroup className="full-width">
              <Button
                theme="secondary"
                className="half-width"
                disabled={profile.isSubmitting}
                onClick={this.handleCancelClick}
              >
                Cancel
              </Button>
              <Button className="half-width" disabled={profile.isSubmitting}>
                Save
              </Button>
            </ButtonGroup>
          </Column>
        </Row>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  renderHead = () => {
    const { user } = this.props;

    const coverStyles = {
      backgroundImage: `url(${user.CoverPicture})`
    };

    return (
      <div className="card-profile-cover-container" style={coverStyles}>
        <div className="card-profile-cover-info">
          <Avatar
            className="clickable"
            src={user.Avatar || ''}
            onClick={this.handleAvatarClick}
          />
          <h1>{user.UserName}</h1>
          <div className="card-profile-location">
            {dates.getAge(user.BirthDate || '1980-12-10')} &middot; {user.NeighborhoodName || 'Earth'}
          </div>
          <Icon
            name="camera"
            onClick={this.handleCoverClick}
            className="card-profile-cover-btn clickable"
          />
        </div>
        <div className="card-profile-cover-mask" />
      </div>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { ui, user } = this.props;

    return (
      <Page title="Edit Profile">
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <Card className="card-profile">
              <CardBody>
                <CardText>
                  {this.renderHead()}
                  <div className="card-profile-container">
                    {this.renderForm()}
                  </div>
                </CardText>
              </CardBody>
            </Card>
          </Column>
        </Row>
        <TagsModal
          selected={user.Tags}
          onSave={this.handleSaveTags}
          open={ui.visibleModals.tags !== false}
        />
        <TagsModal
          selected={user.ListIntent}
          onSave={this.handleSaveIntents}
          open={ui.visibleModals.intents !== false}
          isIntents
        />
      </Page>
    );
  }
}

export default connect(
  mapStateToProps('ui', 'user', 'forms', 'anomo'),
  mapActionsToProps(uiActions, formActions, userActions, anomoActions)
)(withConfig(withRouter(EditProfilePage)));
