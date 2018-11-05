import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { objects, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Row, Column } from 'lib/bootstrap';
import { ActivityCard } from 'lib/cards';
import { Page, Loading, withRouter } from 'lib';
import routes from 'store/routes';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class FeedPage extends React.PureComponent {
  static propTypes = {
    user:           PropTypes.object.isRequired,
    activity:       PropTypes.object.isRequired,
    activityGetAll: PropTypes.func.isRequired,
    history:        PropTypes.object.isRequired
  };

  static defaultProps = {};

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
    const { user, activityGetAll, history } = this.props;

    if (user.isAuthenticated) {
      activityGetAll();
    } else {
      history.push(routes.route('login'));
    }
  };

  /**
   * @param {*} prevProps
   * @param {*} prevState
   */
  componentDidUpdate = (prevProps, prevState) => {
    const { user, activity, activityGetAll } = this.props;
    let { activities } = this.state;

    if (prevProps.user.isAuthenticated !== user.isAuthenticated && user.isAuthenticated) {
      activityGetAll(this.lastActivityID);
      return;
    }

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
        <Row className="gutter-top">
          {activities.map(a => (
            <Column key={a.ActivityID}>
              <ActivityCard activity={a} />
            </Column>
          ))}
        </Row>
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
          <Column xs={4} offsetXs={4}>
            {this.renderFeed()}
          </Column>
        </Row>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps('user', 'activity'),
  mapActionsToProps(activityActions)
)(withRouter(FeedPage));
