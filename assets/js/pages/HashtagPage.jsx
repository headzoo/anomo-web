import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapActionsToProps } from 'utils';
import { Row, Column } from 'lib/bootstrap';
import { Page, Feed, TrendingHashtags, withRouter } from 'lib';
import { PostForm } from 'lib/forms';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class HashtagPage extends React.PureComponent {
  static propTypes = {
    hashtagFeed:            PropTypes.object.isRequired,
    match:                  PropTypes.object.isRequired,
    isMobile:               PropTypes.bool.isRequired,
    activitySubmit:         PropTypes.func.isRequired,
    activityFeedReset:      PropTypes.func.isRequired,
    activityFetchByHashtag: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      formValue: ''
    };
    this.formValued = false;
  }

  /**
   *
   */
  componentDidMount = () => {
    this.handleNext();
  };

  /**
   * @params {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { match, activityFeedReset, activityFetchByHashtag } = this.props;

    if (match.params.hashtag !== prevProps.match.params.hashtag) {
      activityFeedReset('hashtag');
      activityFetchByHashtag(match.params.hashtag, true);
    }
  };

  /**
   *
   */
  componentWillUnmount = () => {
    const { activityFeedReset } = this.props;

    activityFeedReset('hashtag');
  };

  /**
   * @param {Event} e
   * @param {boolean} focused
   */
  handlePostFocus = (e, focused) => {
    const { match } = this.props;

    if (focused && !this.formValued) {
      this.formValued = true;
      this.setState({ formValue: `#${match.params.hashtag} ` });
    }
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
   *
   */
  handleNext = () => {
    const { match, activityFetchByHashtag } = this.props;

    activityFetchByHashtag(match.params.hashtag);
  };

  /**
   * @returns {*}
   */
  render() {
    const { match, isMobile, hashtagFeed } = this.props;
    const { formValue } = this.state;

    return (
      <Page title={`#${match.params.hashtag}`}>
        <Row>
          <Column className="gutter-bottom" md={4} offsetMd={4} xs={12}>
            <PostForm
              name="post"
              id="feed-post-card"
              value={formValue}
              onSubmit={this.handlePostSubmit}
              onFocus={this.handlePostFocus}
              withUpload
            />
          </Column>
        </Row>
        {!isMobile && (
          <TrendingHashtags />
        )}
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <Feed
              onNext={this.handleNext}
              activities={hashtagFeed.activities}
              hasMore={hashtagFeed.hasMore}
            />
          </Column>
        </Row>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isMobile:    state.ui.device.isMobile,
    hashtagFeed: state.activity.feeds.hashtag
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(activityActions)
)(withRouter(HashtagPage));
