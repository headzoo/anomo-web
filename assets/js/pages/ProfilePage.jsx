import React from 'react';
import PropTypes from 'prop-types';
import { dates, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Row, Column, Card, CardBody, CardText, Badge, ButtonGroup, Button } from 'lib/bootstrap';
import { Page, Feed, Loading, Avatar, LinkButton, withRouter } from 'lib';
import { UserCard } from 'lib/cards';
import * as profileActions from 'actions/profileActions';

/**
 *
 */
class ProfilePage extends React.PureComponent {
  static propTypes = {
    match:             PropTypes.object.isRequired,
    profile:           PropTypes.object.isRequired,
    profileFetch:      PropTypes.func.isRequired,
    profilePosts:      PropTypes.func.isRequired,
    profileFollowers:  PropTypes.func.isRequired,
    profileFollowing:  PropTypes.func.isRequired,
    profilePostsReset: PropTypes.func.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      panel: 'activity'
    };
  }

  /**
   *
   */
  componentDidMount = () => {
    const { profileFetch, profilePosts, profileFollowers, profileFollowing, match } = this.props;

    profileFetch(match.params.id);
    profilePosts(match.params.id);
    profileFollowers(match.params.id);
    profileFollowing(match.params.id);
  };

  /**
   *
   */
  componentWillUnmount = () => {
    const { profilePostsReset } = this.props;

    profilePostsReset();
  };

  /**
   *
   */
  handleNext = () => {
    const { profilePosts, match } = this.props;

    profilePosts(match.params.id);
  };

  /**
   *
   */
  handleRefresh = () => {
    const { profilePosts, match } = this.props;

    profilePosts(match.params.id, true);
  };

  /**
   * @param {Event} e
   * @param {string} panel
   */
  handleNavClick = (e, panel) => {
    this.setState({ panel });
  };

  /**
   * @returns {*}
   */
  renderInfo = () => {
    const { user, profile } = this.props;

    const coverStyles = {
      backgroundImage: `url(${profile.CoverPicture})`
    };

    return (
      <CardText>
        <div className="card-profile-cover-container" style={coverStyles}>
          <div className="card-profile-cover-info">
            <Avatar src={profile.Avatar || ''} />
            <h1>{profile.UserName}</h1>
            <div className="card-profile-location">
              {dates.getAge(profile.BirthDate || '1980-12-10')} &middot; {profile.NeighborhoodName || 'Earth'}
            </div>
          </div>
          <div className="card-profile-cover-mask" />
        </div>
        <div className="card-profile-container">
          {profile.UserID === user.UserID && (
            <div className="card-profile-edit-btn">
              <LinkButton name="editProfile" theme="link">
                Edit
              </LinkButton>
            </div>
          )}
          {profile.AboutMe && (
            <div className="card-profile-about">
              <h3>About</h3>
              {profile.AboutMe}
            </div>
          )}
          {profile.ListIntent.length > 0 && (
            <div className="card-profile-intents">
              <h3>Intents</h3>
              {profile.ListIntent.map(intent => (
                <Badge className="card-profile-badge" key={intent.IntentID}>
                  {intent.Name}
                </Badge>
              ))}
            </div>
          )}
          {profile.Tags.length > 0 && (
            <div className="card-profile-tags">
              <h3>Interests</h3>
              {profile.Tags.map(tag => (
                <Badge className="card-profile-badge" key={tag.TagID}>
                  {tag.Name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardText>
    );
  };

  /**
   * @returns {*}
   */
  renderNav = () => {
    const { panel } = this.state;

    return (
      <ButtonGroup className="card-profile-nav" stretch>
        <Button
          className={panel === 'activity' ? 'btn-active' : ''}
          onClick={e => this.handleNavClick(e, 'activity')}
        >
          Activity
        </Button>
        <Button
          className={panel === 'pics' ? 'btn-active' : ''}
          onClick={e => this.handleNavClick(e, 'pics')}
        >
          Pics &amp; Vids
        </Button>
        <Button
          className={panel === 'followers' ? 'btn-active' : ''}
          onClick={e => this.handleNavClick(e, 'followers')}
        >
          Followers
        </Button>
        <Button
          className={panel === 'following' ? 'btn-active' : ''}
          onClick={e => this.handleNavClick(e, 'following')}
        >
          Following
        </Button>
      </ButtonGroup>
    );
  };

  /**
   * @returns {*}
   */
  renderActivityPanel = () => {
    const { profile } = this.props;

    return (
      <Feed
        onNext={this.handleNext}
        hasMore={!profile.isLastPage}
        onRefresh={this.handleRefresh}
        activities={profile.activities}
      />
    );
  };

  /**
   * @returns {*}
   */
  renderPicsPanel = () => {
    const { profile } = this.props;

    return (
      <Feed
        onNext={this.handleNext}
        hasMore={!profile.isLastPage}
        onRefresh={this.handleRefresh}
        activities={profile.imageActivities}
        isPics
      />
    );
  };

  /**
   * @returns {*}
   */
  renderFollowersPanel = () => {
    const { profile } = this.props;

    return (
      <Row className="profile-user-cards">
        {profile.followers.map(user => (
          <Column key={user.UserID}>
            <UserCard user={user} />
          </Column>
        ))}
      </Row>
    );
  };

  /**
   * @returns {*}
   */
  renderFollowingPanel = () => {
    const { profile } = this.props;

    return (
      <Row className="profile-user-cards">
        {profile.following.map(user => (
          <Column key={user.UserID}>
            <UserCard user={user} />
          </Column>
        ))}
      </Row>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { profile } = this.props;
    const { panel } = this.state;

    if (profile.UserID === 0 || profile.isSending) {
      return (
        <Loading middle />
      );
    }

    return (
      <Page title={profile.UserName}>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <Card className="card-profile">
              <CardBody>
                {this.renderInfo()}
              </CardBody>
            </Card>
          </Column>
        </Row>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            {this.renderNav()}
          </Column>
        </Row>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            {{
              'activity':  this.renderActivityPanel(),
              'pics':      this.renderPicsPanel(),
              'followers': this.renderFollowersPanel(),
              'following': this.renderFollowingPanel()
            }[panel]}
          </Column>
        </Row>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps('user', 'profile'),
  mapActionsToProps(profileActions)
)(withRouter(ProfilePage));
