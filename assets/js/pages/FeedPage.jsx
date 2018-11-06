import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { objects, connect, mapStateToProps, mapActionsToProps } from 'utils';
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
    activity:         PropTypes.object.isRequired,
    activityGetAll:   PropTypes.func.isRequired,
    userSubmitStatus: PropTypes.func.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      activities: []
    };
    this.lastActivityID = 0;
  }

  /**
   *
   */
  componentDidMount = () => {
    const { activityGetAll } = this.props;

    activityGetAll();
  };

  /**
   * @param {*} prevProps
   * @param {*} prevState
   */
  componentDidUpdate = (prevProps, prevState) => {
    const { activity } = this.props;
    let { activities } = this.state;

    if (!objects.isEqual(activity.activities, prevProps.activity.activities)
      && objects.isEqual(activities, prevState.activities)) {
      activities = activities.concat(activity.activities);
      this.setState({ activities }, () => {
        const lastActivity = activities[activities.length - 1];
        if (lastActivity) {
          this.lastActivityID = lastActivity.ActivityID;
        }
      });
    }
  };

  /**
   *
   */
  handleNext = () => {
    const { activityGetAll } = this.props;

    activityGetAll(this.lastActivityID);
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
    const { activities } = this.state;

    return (
      <InfiniteScroll
        next={this.handleNext}
        dataLength={activities.length}
        style={{ overflow: 'hidden' }}
        loader={<Loading className="text-center" />}
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
            <PostForm onSubmit={this.handlePostSubmit} withUpload />
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

export default connect(
  mapStateToProps('activity'),
  mapActionsToProps(activityActions, userActions)
)(withRouter(FeedPage));
