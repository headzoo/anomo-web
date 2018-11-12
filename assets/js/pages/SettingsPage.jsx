import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapActionsToProps } from 'utils';
import { Row, Column, Card, CardBody, CardHeader, CardText, Button, ButtonGroup } from 'lib/bootstrap';
import { Form, Input, Checkbox } from 'lib/forms';
import { Page, Icon } from 'lib';
import * as constants from 'anomo/constants';
import * as formActions from 'actions/formActions';
import * as userActions from 'actions/userActions';

/**
 *
 */
class SettingsPage extends React.PureComponent {
  static propTypes = {
    user:              PropTypes.object.isRequired,
    notifications:     PropTypes.object.isRequired,
    formChanges:       PropTypes.func.isRequired,
    userUpdatePrivacy: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      panel: 'list'
    };
  }

  /**
   *
   */
  componentDidMount = () => {
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

    const c = constants;
    formChanges('notifications', {
      [c.PRIVACY_ALLOW_ANOMOTION_NOTICE]:        user[c.PRIVACY_ALLOW_ANOMOTION_NOTICE] === '1',
      [c.PRIVACY_ALLOW_COMMENT_ACTIVITY_NOTICE]: user[c.PRIVACY_ALLOW_COMMENT_ACTIVITY_NOTICE] === '1',
      [c.PRIVACY_ALLOW_LIKE_ACTIVITY_NOTICE]:    user[c.PRIVACY_ALLOW_LIKE_ACTIVITY_NOTICE] === '1',
      [c.PRIVACY_ALLOW_FOLLOW_NOTICE]:           user[c.PRIVACY_ALLOW_FOLLOW_NOTICE] === '1',
      [c.PRIVACY_ALLOW_ANSWER_POLL_NOTICE]:      user[c.PRIVACY_ALLOW_ANSWER_POLL_NOTICE] === '1',
      [c.PRIVACY_ALLOW_REVEAL_NOTICE]:           user[c.PRIVACY_ALLOW_REVEAL_NOTICE] === '1',
    });
  };

  /**
   *
   * @param {Event} e
   * @param {string} panel
   */
  handleItemClick = (e, panel) => {
    this.setState({ panel });
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handleNotificationsSubmit = (e, values) => {
    const { formChanges, userUpdatePrivacy } = this.props;

    e.preventDefault();
    this.setState({ panel: 'list' });

    const c = constants;
    formChanges('notifications', {
      [c.PRIVACY_ALLOW_ANOMOTION_NOTICE]:        values[c.PRIVACY_ALLOW_ANOMOTION_NOTICE] === 'on',
      [c.PRIVACY_ALLOW_COMMENT_ACTIVITY_NOTICE]: values[c.PRIVACY_ALLOW_COMMENT_ACTIVITY_NOTICE] === 'on',
      [c.PRIVACY_ALLOW_LIKE_ACTIVITY_NOTICE]:    values[c.PRIVACY_ALLOW_LIKE_ACTIVITY_NOTICE] === 'on',
      [c.PRIVACY_ALLOW_FOLLOW_NOTICE]:           values[c.PRIVACY_ALLOW_FOLLOW_NOTICE] === 'on',
      [c.PRIVACY_ALLOW_ANSWER_POLL_NOTICE]:      values[c.PRIVACY_ALLOW_ANSWER_POLL_NOTICE] === 'on',
      [c.PRIVACY_ALLOW_REVEAL_NOTICE]:           values[c.PRIVACY_ALLOW_REVEAL_NOTICE] === 'on',
    });
    userUpdatePrivacy({
      [c.PRIVACY_ALLOW_ANOMOTION_NOTICE]:        values[c.PRIVACY_ALLOW_ANOMOTION_NOTICE] === 'on' ? '1' : '0',
      [c.PRIVACY_ALLOW_COMMENT_ACTIVITY_NOTICE]: values[c.PRIVACY_ALLOW_COMMENT_ACTIVITY_NOTICE] === 'on' ? '1' : '0',
      [c.PRIVACY_ALLOW_LIKE_ACTIVITY_NOTICE]:    values[c.PRIVACY_ALLOW_LIKE_ACTIVITY_NOTICE] === 'on' ? '1' : '0',
      [c.PRIVACY_ALLOW_FOLLOW_NOTICE]:           values[c.PRIVACY_ALLOW_FOLLOW_NOTICE] === 'on' ? '1' : '0',
      [c.PRIVACY_ALLOW_ANSWER_POLL_NOTICE]:      values[c.PRIVACY_ALLOW_ANSWER_POLL_NOTICE] === 'on' ? '1' : '0',
      [c.PRIVACY_ALLOW_REVEAL_NOTICE]:           values[c.PRIVACY_ALLOW_REVEAL_NOTICE] === 'on' ? '1' : '0',
    });
  };

  /**
   * @returns {*}
   */
  renderNotifications = () => {
    const { notifications } = this.props;

    return (
      <Form
        name="notifications"
        onSubmit={this.handleNotificationsSubmit}
        disabled={notifications.isSubmitting}
        reset={false}
      >
        <Row>
          <Column>
            <Checkbox
              label="Messages"
              id="form-notifications-allow-anomotion-notice"
              name={constants.PRIVACY_ALLOW_ANOMOTION_NOTICE}
            />
            <Checkbox
              label="Reveals"
              id="form-notifications-allow-reveal-notice"
              name={constants.PRIVACY_ALLOW_REVEAL_NOTICE}
            />
            <Checkbox
              label="Comment on Activities"
              id="form-notifications-allow-comment-activity-notice"
              name={constants.PRIVACY_ALLOW_COMMENT_ACTIVITY_NOTICE}
            />
            <Checkbox
              label="Like an Activity"
              id="form-notifications-allow-like-activity-notice"
              name={constants.PRIVACY_ALLOW_LIKE_ACTIVITY_NOTICE}
            />
            <Checkbox
              label="New Follower"
              id="form-notifications-allow-follow-notice"
              name={constants.PRIVACY_ALLOW_FOLLOW_NOTICE}
            />
            <Checkbox
              label="Poll"
              id="form-notifications-allow-answer-poll-notice"
              name={constants.PRIVACY_ALLOW_ANSWER_POLL_NOTICE}
            />
          </Column>
        </Row>
        <Row>
          <Column className="gutter-top">
            <ButtonGroup className="full-width">
              <Button
                theme="secondary"
                className="half-width"
                disabled={notifications.isSubmitting}
                onClick={e => this.handleItemClick(e, 'list')}
              >
                Cancel
              </Button>
              <Button className="half-width" disabled={notifications.isSubmitting}>
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
  renderBlocked = () => {
    const { notifications } = this.props;

    return (
      <div>
        Blocked
        <Row>
          <Column className="gutter-top">
            <ButtonGroup className="full-width">
              <Button
                theme="secondary"
                className="half-width"
                disabled={notifications.isSubmitting}
                onClick={e => this.handleItemClick(e, 'list')}
              >
                Cancel
              </Button>
              <Button className="half-width" disabled={notifications.isSubmitting}>
                Save
              </Button>
            </ButtonGroup>
          </Column>
        </Row>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderEmail = () => {
    const { notifications } = this.props;

    return (
      <div>
        Email
        <Row>
          <Column className="gutter-top">
            <ButtonGroup className="full-width">
              <Button
                theme="secondary"
                className="half-width"
                disabled={notifications.isSubmitting}
                onClick={e => this.handleItemClick(e, 'list')}
              >
                Cancel
              </Button>
              <Button className="half-width" disabled={notifications.isSubmitting}>
                Save
              </Button>
            </ButtonGroup>
          </Column>
        </Row>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderList = () => {
    return (
      <ul className="list-group card-settings-list-group">
        <li className="list-group-item" onClick={e => this.handleItemClick(e, 'notifications')}>
          <div>Notifications</div>
          <Icon name="angle-right" />
        </li>
        <li className="list-group-item" onClick={e => this.handleItemClick(e, 'blocked')}>
          <div>Blocked Users</div>
          <Icon name="angle-right" />
        </li>
        <li className="list-group-item" onClick={e => this.handleItemClick(e, 'email')}>
          <div>Email &amp; Password</div>
          <Icon name="angle-right" />
        </li>
      </ul>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { panel } = this.state;

    let title = 'Settings';
    switch (panel) {
      case 'notifications':
        title = 'Notifications';
        break;
      case 'blocked':
        title = 'Blocked Users';
        break;
      case 'email':
        title = 'Email & Password';
        break;
    }

    return (
      <Page title={title}>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <Card className="card-settings">
              <CardHeader>
                {title}
              </CardHeader>
              <CardBody>
                <CardText>
                  {{
                    'list':          this.renderList(),
                    'email':         this.renderEmail(),
                    'blocked':       this.renderBlocked(),
                    'notifications': this.renderNotifications()
                  }[panel]}
                </CardText>
              </CardBody>
            </Card>
          </Column>
        </Row>
      </Page>
    );
  }
}

const mapStateToProps = state => (
  {
    user:          state.user,
    notifications: state.forms.notifications
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(formActions, userActions)
)(SettingsPage);
