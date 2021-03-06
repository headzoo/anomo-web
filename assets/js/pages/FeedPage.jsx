import React from 'react';
import PropTypes from 'prop-types';
import { browser, strings, connect, mapActionsToProps } from 'utils';
import { Row, Column, ButtonGroup, Badge } from 'lib/bootstrap';
import { Page, Feed, TrendingHashtags, Loading, LinkButton, Number, withRouter } from 'lib';
import { PostForm } from 'lib/forms';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class FeedPage extends React.PureComponent {
  static propTypes = {
    feeds:             PropTypes.object.isRequired,
    isMobile:          PropTypes.bool.isRequired,
    activeFeed:        PropTypes.string.isRequired,
    history:           PropTypes.object.isRequired,
    location:          PropTypes.object.isRequired,
    uiActiveFeed:      PropTypes.func.isRequired,
    activityFeedFetch: PropTypes.func.isRequired,
    activitySubmit:    PropTypes.func.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.history = browser.storage.get(browser.storage.KEY_ACTIVITY_HISTORY, []);
    switch (props.location.pathname) {
      case routes.route('recent'):
        props.uiActiveFeed('recent');
        break;
      case routes.route('popular'):
        props.uiActiveFeed('popular');
        break;
      case routes.route('following'):
        props.uiActiveFeed('following');
        break;
      case routes.route('history'):
        props.uiActiveFeed('history');
        break;
    }
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { feeds, activeFeed } = this.props;

    if (activeFeed === 'history' && prevProps.activeFeed !== 'history') {
      browser.scroll();
      this.history = browser.storage.get(browser.storage.KEY_ACTIVITY_HISTORY, []);
    } else if (feeds[activeFeed].isRefreshing && !prevProps.feeds[activeFeed].isRefreshing) {
      browser.scroll();
    }
  };

  /**
   *
   */
  handleNext = () => {
    const { activeFeed, activityFeedFetch } = this.props;

    activityFeedFetch(activeFeed);
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handlePostSubmit = (e, values) => {
    const { activitySubmit } = this.props;

    e.preventDefault();
    activitySubmit('post', values.message, values.photo, values.video);
  };

  /**
   * @param {Event} e
   * @param {string} activeFeed
   */
  handleNavClick = (e, activeFeed) => {
    const { history, uiActiveFeed, activityFeedFetch } = this.props;

    e.preventDefault();
    if (activeFeed !== 'history') {
      activityFeedFetch(activeFeed, true);
    }
    uiActiveFeed(activeFeed);
    history.replace(routes.route(activeFeed));
  };

  /**
   * @returns {*}
   */
  renderNav = () => {
    const { activeFeed, isMobile, feeds } = this.props;

    return (
      <div className={isMobile ? '' : 'gutter-top'}>
        <ButtonGroup className="page-feed-nav-btn-group" theme="none" stretch>
          <LinkButton
            name="recent"
            onClick={e => this.handleNavClick(e, 'recent')}
            className={activeFeed === 'recent' ? 'active' : ''}
          >
            <div>Recent</div>
            <Badge>
              <Number value={feeds.recent.newNumber} />
            </Badge>
          </LinkButton>
          <LinkButton
            name="following"
            onClick={e => this.handleNavClick(e, 'following')}
            className={activeFeed === 'following' ? 'active' : ''}
          >
            <div>Following</div>
            <Badge>
              <Number value={feeds.following.newNumber} />
            </Badge>
          </LinkButton>
          <LinkButton
            name="popular"
            onClick={e => this.handleNavClick(e, 'popular')}
            className={activeFeed === 'popular' ? 'active' : ''}
          >
            <div>Popular</div>
          </LinkButton>
          {this.history.length > 0 && (
            <LinkButton
              name="history"
              onClick={e => this.handleNavClick(e, 'history')}
              className={activeFeed === 'history' ? 'active' : ''}
            >
              <div>History</div>
            </LinkButton>
          )}
        </ButtonGroup>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { feeds, isMobile, activeFeed } = this.props;

    let title = 'scnstr';
    if (activeFeed !== 'recent') {
      title = strings.ucWords(activeFeed);
    }
    if (activeFeed === 'history') {
      feeds.history = {
        isRefreshing: false,
        activities:   this.history
      };
    }

    return (
      <Page title={title}>
        {!isMobile && (
          <Row>
            <Column>
              <PostForm
                id="feed-post-card"
                name="post"
                onSubmit={this.handlePostSubmit}
                withUpload
              />
            </Column>
          </Row>
        )}
        <Row>
          <Column className="gutter-bottom">
            {this.renderNav()}
          </Column>
        </Row>
        {!isMobile && (
          <TrendingHashtags />
        )}
        <Row>
          <Column>
            {feeds[activeFeed].isRefreshing && (
              <Loading className="text-center gutter-bottom" />
            )}
            <Feed
              onNext={this.handleNext}
              activities={feeds[activeFeed].activities}
              hasMore={activeFeed !== 'history'}
            />
          </Column>
        </Row>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    feeds:      state.activity.feeds,
    isMobile:   state.ui.device.isMobile,
    activeFeed: state.ui.activeFeed
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, activityActions)
)(withRouter(FeedPage));
