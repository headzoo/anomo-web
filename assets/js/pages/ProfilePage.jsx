import React from 'react';
import PropTypes from 'prop-types';
import { dates, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Row, Column, Card, CardBody, CardText, Badge } from 'lib/bootstrap';
import { Page, Feed, Loading, Avatar, withRouter } from 'lib';
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
    profilePostsReset: PropTypes.func.isRequired
  };

  /**
   *
   */
  componentDidMount = () => {
    const { profileFetch, profilePosts, match } = this.props;

    profileFetch(match.params.id);
    profilePosts(match.params.id);
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
   * @returns {*}
   */
  renderBody = () => {
    const { profile } = this.props;

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
              <h3>Interest</h3>
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
  render() {
    const { profile } = this.props;

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
                {this.renderBody()}
              </CardBody>
            </Card>
          </Column>
        </Row>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <Feed
              onNext={this.handleNext}
              onRefresh={this.handleRefresh}
              activities={profile.activities}
            />
          </Column>
        </Row>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps('profile'),
  mapActionsToProps(profileActions)
)(withRouter(ProfilePage));
