import React from 'react';
import PropTypes from 'prop-types';
import { connect, browser, mapActionsToProps } from 'utils';
import { Row, Column, Card, CardBody, CardText, Badge, ButtonGroup, Button } from 'lib/bootstrap';
import { Page, Feed, Loading, Avatar, Icon, LinkButton, Number, Age, withRouter } from 'lib';
import { UserCard } from 'lib/cards';
import * as uiActions from 'actions/uiActions';
import * as profileActions from 'actions/profileActions';

/**
 *
 */
class ProfilePage extends React.PureComponent {
  static propTypes = {
    match:              PropTypes.object.isRequired,
    profile:            PropTypes.object.isRequired,
    isOwner:            PropTypes.bool.isRequired,
    followingUserNames: PropTypes.array.isRequired,
    profileFetch:       PropTypes.func.isRequired,
    profilePosts:       PropTypes.func.isRequired,
    profileFollowers:   PropTypes.func.isRequired,
    profileFollowing:   PropTypes.func.isRequired,
    profilePostsReset:  PropTypes.func.isRequired,
    uiVisibleModal:     PropTypes.func.isRequired,
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
    this.handleUpdate();
  };

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { match } = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      this.handleUpdate();
    }
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
  handleUpdate = () => {
    const { profileFetch, profilePosts, profileFollowers, profileFollowing, profilePostsReset, match } = this.props;

    profilePostsReset();
    profileFetch(match.params.id);
    profilePosts(match.params.id, true);
    profileFollowers(match.params.id);
    profileFollowing(match.params.id);
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
   *
   */
  handleEllipsisClick = () => {
    const { profile, uiVisibleModal } = this.props;

    uiVisibleModal('user', profile);
  };

  /**
   * @returns {*}
   */
  renderInfo = () => {
    const { followingUserNames, profile, isOwner } = this.props;

    const isFollowing  = followingUserNames.indexOf(profile.UserName) !== -1;
    const coverStyles  = {
      backgroundImage: `url(${browser.toHttps(profile.CoverPicture)})`
    };

    return (
      <CardText>
        <div className="card-profile-cover-container" style={coverStyles}>
          <div className="card-profile-cover-info">
            <div className="card-profile-ellipsis">
              <Icon name="ellipsis-h" onClick={this.handleEllipsisClick} />
            </div>
            <Avatar src={profile.Avatar} following={isFollowing} lg />
            <h1>{profile.UserName || profile.UserID}</h1>
            <div className="card-profile-location">
              <Age date={profile.BirthDate} /> &middot; {profile.NeighborhoodName || 'Earth'}
            </div>
          </div>
          <div className="card-profile-cover-mask" />
        </div>
        <div className="card-profile-container">
          {isOwner && (
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
          <div className="card-profile-stats">
            <Row>
              <Column xs={4}>
                <Number value={parseInt(profile.NumberOfFollowing, 10)} /> Following
              </Column>
              <Column xs={4}>
                <Number value={parseInt(profile.NumberOfFollower, 10)} /> Followers
              </Column>
              <Column xs={4}>
                <Number value={parseInt(profile.Point, 10)} /> Points
              </Column>
            </Row>
          </div>
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
        <Page title="Loading">
          <Row>
            <Column className="gutter-lg text-center">
              <Loading label="Loading profile" />
            </Column>
          </Row>
        </Page>
      );
    }

    return (
      <Page title={profile.UserName} key={`profile_${profile.UserID}`}>
        <Row>
          <Column>
            <Card className="card-profile">
              <CardBody>
                {this.renderInfo()}
              </CardBody>
            </Card>
          </Column>
        </Row>
        <Row>
          <Column>
            {this.renderNav()}
          </Column>
        </Row>
        <Row>
          <Column>
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

const mapStateToProps = state => (
  {
    profile:            state.profile,
    isOwner:            state.profile.UserID === state.user.UserID,
    followingUserNames: state.user.followingUserNames
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, profileActions)
)(withRouter(ProfilePage));
