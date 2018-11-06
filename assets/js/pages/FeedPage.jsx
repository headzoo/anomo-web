import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect, mapActionsToProps } from 'utils';
import { TransitionGroup, FadeAndSlideTransition } from 'lib/animation';
import { Row, Column } from 'lib/bootstrap';
import { ActivityCard } from 'lib/cards';
import { PostForm } from 'lib/forms';
import { Page, Loading, withRouter } from 'lib';
import * as userActions from 'actions/userActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class FeedPage extends React.PureComponent {
  static propTypes = {
    activities:       PropTypes.array.isRequired,
    activityFetch:    PropTypes.func.isRequired,
    userSubmitStatus: PropTypes.func.isRequired
  };

  /**
   *
   */
  handleNext = () => {
    const { activityFetch } = this.props;

    activityFetch();
  };

  /**
   *
   */
  handleRefresh = () => {
    const { activityFetch } = this.props;

    activityFetch(true);
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handlePostSubmit = (e, values) => {
    const { userSubmitStatus } = this.props;

    e.preventDefault();
    userSubmitStatus(values.message);
  };

  /**
   * @returns {*}
   */
  renderFeed = () => {
    const { activities } = this.props;

    return (
      <InfiniteScroll
        next={this.handleNext}
        dataLength={activities.length}
        style={{ overflow: 'hidden' }}
        refreshFunction={this.handleRefresh}
        loader={<Loading className="text-center" />}
        releaseToRefreshContent={<Loading className="text-center" />}
        pullDownToRefresh
        hasMore
      >
        <TransitionGroup component={Row}>
          {activities.map(a => (
            a.ActionType !== '28' ? (
              <FadeAndSlideTransition key={a.ActivityID} duration={150}>
                <Column>
                  <ActivityCard activity={a} />
                </Column>
              </FadeAndSlideTransition>
            ) : null
          ))}
        </TransitionGroup>
      </InfiniteScroll>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Page title="Anomo">
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <PostForm
              onSubmit={this.handlePostSubmit}
              withUpload
            />
          </Column>
        </Row>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            {this.renderFeed()}
          </Column>
        </Row>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activities: state.activity.activities
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(activityActions, userActions)
)(withRouter(FeedPage));
