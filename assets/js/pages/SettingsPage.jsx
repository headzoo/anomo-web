import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapActionsToProps } from 'utils';
import { Row, Column, Card, CardBody, CardHeader, CardText, Button, ButtonGroup } from 'lib/bootstrap';
import { Form, Input, Checkbox } from 'lib/forms';
import { Page, Icon, Link, Loading, withRouter } from 'lib';
import routes from 'store/routes';
import * as constants from 'anomo/constants';
import * as formActions from 'actions/formActions';
import * as userActions from 'actions/userActions';

/**
 *
 */
class SettingsPage extends React.PureComponent {
  static propTypes = {
    user:               PropTypes.object.isRequired,
    password:           PropTypes.object.isRequired,
    notifications:      PropTypes.object.isRequired,
    history:            PropTypes.object.isRequired,
    location:           PropTypes.object.isRequired,
    formError:          PropTypes.func.isRequired,
    formChanges:        PropTypes.func.isRequired,
    userBlock:          PropTypes.func.isRequired,
    userBlocked:        PropTypes.func.isRequired,
    userUpdatePrivacy:  PropTypes.func.isRequired,
    userUpdatePassword: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      panel: this.getPanelFromPathname(props.location.pathname)
    };
    if (this.state.panel === 'blocked') {
      props.userBlocked();
    }
    this.unblock = [];
  }

  /**
   * @param {string} pathname
   * @returns {string}
   */
  getPanelFromPathname = (pathname) => {
    switch (pathname) {
      case routes.route('settingsNotifications'):
        return 'notifications';
      case routes.route('settingsBlocked'):
        return 'blocked';
      case routes.route('settingsPassword'):
        return 'password';
      default:
        return 'list';
    }
  };

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
    const { user, userBlocked, location } = this.props;

    if (location.pathname !== prevProps.location.pathname) {
      if (location.pathname === routes.route('settingsBlocked')) {
        userBlocked();
      }
      this.setState({ panel: this.getPanelFromPathname(location.pathname) });
    }
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
   * @param {Event} e
   * @param {string} panel
   */
  handleItemClick = (e, panel) => {
    const { history } = this.props;

    history.push(routes.route(panel));
  };

  /**
   * @param {Event} e
   * @param {boolean} checked
   * @param {string} name
   * @param {string} userID
   */
  handleBlockedChange = (e, checked, name, userID) => {
    const index = this.unblock.indexOf(userID);
    if (!checked && index === -1) {
      this.unblock.push(userID);
    } else if (checked && index !== -1) {
      this.unblock.splice(index, 1);
    }
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
   * @param {Event} e
   * @param {*} values
   */
  handlePasswordSubmit = (e, values) => {
    const { userUpdatePassword, formError } = this.props;

    e.preventDefault();
    if (values[constants.SETTING_NEW_PASSWORD] !== values.confirm) {
      formError('password', 'Passwords do not match');
      return;
    }

    userUpdatePassword(values[constants.SETTING_OLD_PASSWORD], values[constants.SETTING_NEW_PASSWORD]);
    this.setState({ panel: 'list' });
  };

  /**
   *
   */
  handleBlockedSubmit = () => {
    const { userBlock } = this.props;

    this.unblock.forEach((userID) => {
      userBlock(userID);
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
                onClick={e => this.handleItemClick(e, 'settings')}
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
    const { user } = this.props;
    const { isBlockedSubmitting, isBlockedLoading } = user;

    return (
      <div>
        {isBlockedLoading ? (
          <div className="text-center">
            <Loading />
          </div>
        ) : (
          <ul className="list-group">
            {user.blocked.map(u => (
              <li key={u.UserID} className="list-group-item">
                <Checkbox
                  value={u.UserID}
                  name={u.UserName}
                  label={u.UserName}
                  onChange={this.handleBlockedChange}
                  id={`form-settings-blocked-${u.UserID}`}
                  checked
                />
              </li>
            ))}
          </ul>
        )}
        <Row>
          <Column className="gutter-top">
            <ButtonGroup className="full-width">
              <Button
                theme="secondary"
                className="half-width"
                onClick={e => this.handleItemClick(e, 'settings')}
              >
                Cancel
              </Button>
              <Button
                className="half-width"
                disabled={isBlockedSubmitting || isBlockedLoading}
                onClick={this.handleBlockedSubmit}
              >
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
  renderPassword = () => {
    const { password } = this.props;

    return (
      <div>
        <Form
          name="password"
          onSubmit={this.handlePasswordSubmit}
          disabled={password.isSubmitting}
          reset={false}
          required
        >
          <Row>
            <Column>
              <Input
                type="password"
                label="Old Password"
                id="form-settings-old-password"
                name={constants.SETTING_OLD_PASSWORD}
              />
              <Input
                type="password"
                label="New Password"
                id="form-settings-new-password"
                name={constants.SETTING_NEW_PASSWORD}
              />
              <Input
                type="password"
                name="confirm"
                label="Confirm New Password"
                id="form-settings-confirm-new-password"
              />
            </Column>
          </Row>
          <Row>
            <Column className="gutter-top">
              <ButtonGroup className="full-width">
                <Button
                  theme="secondary"
                  className="half-width"
                  disabled={password.isSubmitting}
                  onClick={e => this.handleItemClick(e, 'settings')}
                >
                  Cancel
                </Button>
                <Button className="half-width" disabled={password.isSubmitting}>
                  Save
                </Button>
              </ButtonGroup>
            </Column>
          </Row>
        </Form>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderList = () => {
    return (
      <ul className="list-group card-settings-list-group">
        <li className="list-group-item">
          <Link name="settingsNotifications">
            <div>Notifications</div>
            <Icon name="angle-right" />
          </Link>
        </li>
        <li className="list-group-item">
          <Link name="settingsBlocked">
            <div>Blocked Users</div>
            <Icon name="angle-right" />
          </Link>
        </li>
        <li className="list-group-item">
          <Link name="settingsPassword">
            <div>Change Password</div>
            <Icon name="angle-right" />
          </Link>
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
      case 'password':
        title = 'Change Password';
        break;
    }

    return (
      <Page title={title}>
        <Card className="card-settings">
          <CardHeader>
            {title}
          </CardHeader>
          <CardBody>
            <CardText>
              {{
                'list':          this.renderList(),
                'password':      this.renderPassword(),
                'blocked':       this.renderBlocked(),
                'notifications': this.renderNotifications()
              }[panel]}
            </CardText>
          </CardBody>
        </Card>
      </Page>
    );
  }
}

const mapStateToProps = state => (
  {
    user:          state.user,
    password:      state.forms.password,
    notifications: state.forms.notifications
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(formActions, userActions)
)(withRouter(SettingsPage));
