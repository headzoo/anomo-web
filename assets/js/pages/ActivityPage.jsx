import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { ActivityCard, CommentCard } from 'lib/cards';
import { Row, Column } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import { Page, Loading, withRouter } from 'lib';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class ActivityPage extends React.PureComponent {
  static propTypes = {
    activity:                  PropTypes.object.isRequired,
    match:                     PropTypes.object.isRequired,
    location:                  PropTypes.object.isRequired,
    activityGet:               PropTypes.func.isRequired,
    activityReset:             PropTypes.func.isRequired,
    activitySubmitComment:     PropTypes.func.isRequired,
    activityIsCommentsLoading: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      activity: {}
    };
  }

  /**
   *
   */
  componentDidMount = () => {
    const { location, match, activityGet, activityIsCommentsLoading } = this.props;
    const { state } = location;

    activityIsCommentsLoading(true);
    if (state && state.activity) {
      this.setState({ activity: state.activity }, () => {
        activityGet(match.params.refID, match.params.actionType);
      });
    } else {
      activityGet(match.params.refID, match.params.actionType);
    }
  };

  /**
   * @param {*} prevProps
   * @param {*} prevState
   */
  componentDidUpdate = (prevProps, prevState) => {
    const { activity } = this.state;

    if (!objects.isEmpty(this.props.activity.activity)
      && !objects.isEqual(this.props.activity.activity, activity)
      && objects.isEqual(prevState.activity, activity)) {
      this.setState({ activity: this.props.activity.activity });
    }
  };

  /**
   *
   */
  componentWillUnmount = () => {
    const { activityReset } = this.props;

    activityReset();
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handleCommentSubmit = (e, values) => {
    const { activitySubmitComment } = this.props;
    const { activity } = this.state;

    e.preventDefault();
    activitySubmitComment(values.message, activity.RefID, activity.ActionType, activity.TopicID);
  };

  /**
   * @returns {*}
   */
  renderComments = () => {
    const { activity } = this.state;

    if (!activity.ListComment) {
      activity.ListComment = [];
    }

    if (this.props.activity.isCommentsLoading) {
      return (
        <Column className="text-center" md={4} offsetMd={4} xs={12}>
          <Loading />
        </Column>
      );
    }

    return activity.ListComment.map(comment => (
      <Column key={comment.ID} md={4} offsetMd={4} xs={12}>
        <CommentCard comment={comment} />
      </Column>
    ));
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity } = this.state;

    if (objects.isEmpty(activity)) {
      return null;
    }

    if (activity.IsAnonymous === '1') {
      activity.FromUserName = 'Anonymous';
      activity.Avatar = '/images/anonymous-avatar-sm.jpg';
    }

    return (
      <Page title={activity.FromUserName}>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <ActivityCard activity={activity} clickableImage />
          </Column>
        </Row>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <PostForm onSubmit={this.handleCommentSubmit} />
          </Column>
        </Row>
        <Row>
          {this.renderComments()}
        </Row>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps('activity'),
  mapActionsToProps(activityActions)
)(withRouter(ActivityPage));
