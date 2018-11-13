import React from 'react';
import PropTypes from 'prop-types';
import { browser, strings, connect, mapActionsToProps } from 'utils';
import { Row, Column, ButtonGroup, Button, Badge } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import { Page, Feed, Loading, LinkButton, Number, withRouter } from 'lib';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as userActions from 'actions/userActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class FeedPage extends React.PureComponent {
  static propTypes = {
    feeds:             PropTypes.object.isRequired,
    activeFeed:        PropTypes.string.isRequired,
    history:           PropTypes.object.isRequired,
    location:          PropTypes.object.isRequired,
    isPreviewing:      PropTypes.bool.isRequired,
    uiActiveFeed:      PropTypes.func.isRequired,
    activityFeedFetch: PropTypes.func.isRequired,
    userSubmitStatus:  PropTypes.func.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

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
    }
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { feeds, activeFeed } = this.props;

    if (feeds[activeFeed].isRefreshing && !prevProps.feeds[activeFeed].isRefreshing) {
      browser.scroll(0, 'auto');
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
    const { userSubmitStatus } = this.props;

    e.preventDefault();
    userSubmitStatus(values.message, values.photo);
  };

  /**
   * @param {Event} e
   * @param {string} activeFeed
   */
  handleNavClick = (e, activeFeed) => {
    const { history, uiActiveFeed, activityFeedFetch } = this.props;

    e.preventDefault();
    activityFeedFetch(activeFeed, true);
    uiActiveFeed(activeFeed);
    history.replace(routes.route(activeFeed));
  };

  /**
   * @returns {*}
   */
  renderNav = () => {
    const { activeFeed, feeds } = this.props;

    return (
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
    const { feeds, isPreviewing, activeFeed } = this.props;

    let title = 'scnstr';
    if (activeFeed !== 'recent') {
      title = strings.ucWords(activeFeed);
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
          <Column
            md={4}
            xs={12}
            offsetMd={4}
            className={isPreviewing ? 'gutter-bottom activity-feed-previewing' : 'gutter-bottom'}
          >
            {this.renderNav()}
          </Column>
        </Row>
        <Row>
          <Column className={isPreviewing ? 'activity-feed-previewing' : ''} md={4} offsetMd={4} xs={12}>
            {feeds[activeFeed].isRefreshing && (
              <Loading className="text-center gutter-bottom" />
            )}
            <Feed
              onNext={this.handleNext}
              activities={feeds[activeFeed].activities}
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
    feeds:        state.activity.feeds,
    isPreviewing: state.ui.isPreviewing,
    activeFeed:   state.ui.activeFeed
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, activityActions, userActions)
)(withRouter(FeedPage));
