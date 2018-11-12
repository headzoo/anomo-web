import React from 'react';
import PropTypes from 'prop-types';
import { browser, strings, connect, mapActionsToProps } from 'utils';
import { Row, Column, ButtonGroup, Button, Badge } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import { Page, Feed, Loading, LinkButton, Number, withRouter } from 'lib';
import routes from 'store/routes';
import * as userActions from 'actions/userActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class FeedPage extends React.PureComponent {
  static propTypes = {
    feeds:             PropTypes.object.isRequired,
    history:           PropTypes.object.isRequired,
    location:          PropTypes.object.isRequired,
    activityFeedFetch: PropTypes.func.isRequired,
    userSubmitStatus:  PropTypes.func.isRequired
  };

  /**
   * @param {*} nextProps
   * @returns {{feedType: string}}
   */
  static getDerivedStateFromProps(nextProps) {
    let feedType = 'recent';
    switch (nextProps.location.pathname) {
      case routes.path('popular'):
        feedType = 'popular';
        break;
      case routes.path('following'):
        feedType = 'following';
        break;
    }

    return {
      feedType
    };
  }

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      feedType: 'recent'
    };
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { feeds } = this.props;
    const { feedType } = this.state;

    if (feeds[feedType].isRefreshing && !prevProps.feeds[feedType].isRefreshing) {
      browser.scroll(0, 'auto');
    }
  };

  /**
   *
   */
  handleNext = () => {
    const { activityFeedFetch } = this.props;
    const { feedType } = this.state;

    activityFeedFetch(feedType);
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handlePostSubmit = (e, values) => {
    const { userSubmitStatus } = this.props;

    e.preventDefault();
    userSubmitStatus(values.message, values.photo);
  };

  /**
   * @param {Event} e
   * @param {string} feedType
   */
  handleNavClick = (e, feedType) => {
    const { history, activityFeedFetch } = this.props;

    e.preventDefault();
    history.replace(routes.route(feedType));
    activityFeedFetch(feedType, true);
    this.setState({ feedType });
  };

  /**
   * @returns {*}
   */
  renderNav = () => {
    const { feeds } = this.props;

    return (
      <ButtonGroup className="page-feed-nav-btn-group" theme="none" stretch>
        <LinkButton name="recent" onClick={e => this.handleNavClick(e, 'recent')}>
          <div>Recent</div>
          <Badge>
            <Number value={feeds.recent.newNumber} />
          </Badge>
        </LinkButton>
        <LinkButton name="following" onClick={e => this.handleNavClick(e, 'following')}>
          <div>Following</div>
          <Badge>
            <Number value={feeds.following.newNumber} />
          </Badge>
        </LinkButton>
        <LinkButton name="popular" onClick={e => this.handleNavClick(e, 'popular')}>
          <div>Popular</div>
          <Badge>
            <Number value={feeds.popular.newNumber} />
          </Badge>
        </LinkButton>
      </ButtonGroup>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { feeds } = this.props;
    const { feedType } = this.state;

    let title = 'scnstr';
    if (feedType !== 'recent') {
      title = strings.ucWords(feedType);
    }

    return (
      <Page title={title}>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <PostForm
              onSubmit={this.handlePostSubmit}
              withUpload
            />
          </Column>
        </Row>
        <Row>
          <Column className="gutter-bottom" md={4} offsetMd={4} xs={12}>
            {this.renderNav()}
          </Column>
        </Row>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            {feeds[feedType].isRefreshing && (
              <Loading className="text-center gutter-bottom" />
            )}
            <Feed
              onNext={this.handleNext}
              activities={feeds[feedType].activities}
              hasMore
            />
          </Column>
        </Row>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    feeds: state.activity.feeds
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(activityActions, userActions)
)(withRouter(FeedPage));
