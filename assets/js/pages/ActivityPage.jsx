import React from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { objects, connect, mapActionsToProps } from 'utils';
import { TransitionGroup, FadeAndSlideTransition } from 'lib/animation';
import { ActivityCard, CommentCard } from 'lib/cards';
import { ReplyModal } from 'lib/modals';
import { Row, Column, Card, CardHeader, CardBody, CardText } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import { Page, Loading, UserBadge, withRouter } from 'lib';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class ActivityPage extends React.PureComponent {
  static propTypes = {
    activity:                  PropTypes.object.isRequired,
    isActivityLoading:         PropTypes.bool,
    isCommentsLoading:         PropTypes.bool.isRequired,
    match:                     PropTypes.object.isRequired,
    history:                   PropTypes.object.isRequired,
    location:                  PropTypes.object.isRequired,
    visibleModals:             PropTypes.object.isRequired,
    uiVisibleModal:            PropTypes.func.isRequired,
    activityGet:               PropTypes.func.isRequired,
    activityReset:             PropTypes.func.isRequired,
    activitySubmitComment:     PropTypes.func.isRequired,
    activityIsCommentsLoading: PropTypes.func.isRequired,
    activityIsActivityLoading: PropTypes.func.isRequired,
    activitySetupActivityPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isActivityLoading: false
  };

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
    this.handleUpdate();
  };

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { match, history } = this.props;

    if (match.params.refID !== prevProps.match.params.refID) {
      this.handleUpdate();
    } else if (this.props.activity.IsDeleted) {
      history.push(routes.route('home'));
    } else if (!objects.isEmpty(this.props.activity) && !objects.isEqual(this.props.activity, prevProps.activity)) {
      this.setState({ activity: this.props.activity });
    }
  };

  /**
   *
   */
  handleUpdate = () => {
    const { location, match, activitySetupActivityPage } = this.props;
    const { state } = location;

    if (state && state.activity) {
      this.setState({ activity: state.activity }, () => {
        activitySetupActivityPage(0, 0, state.activity);
      });
    } else {
      activitySetupActivityPage(match.params.refID, match.params.actionType);
    }
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handleCommentSubmit = (e, values) => {
    const { activitySubmitComment, uiVisibleModal } = this.props;
    const { activity } = this.state;

    e.preventDefault();
    activitySubmitComment(
      'post',
      values.message,
      activity.RefID,
      activity.ActionType,
      activity.TopicID
    );
    uiVisibleModal('reply', false);
  };

  /**
   * @param {Event} e
   * @param {*} comment
   */
  handleReplyClick = (e, comment) => {
    const { uiVisibleModal } = this.props;

    uiVisibleModal('reply', comment);
  };

  /**
   * @returns {*}
   */
  renderComments = () => {
    const { isCommentsLoading } = this.props;
    const { activity } = this.state;

    if (!objects.isEmpty(activity) && !activity.ListComment) {
      activity.ListComment = [];
    }

    if (isCommentsLoading) {
      return (
        <FadeAndSlideTransition key={0} duration={150}>
          <Column className="text-center" md={4} offsetMd={4} xs={12}>
            <Loading />
          </Column>
        </FadeAndSlideTransition>
      );
    }

    return (activity.ListComment || []).map(comment => (
      <FadeAndSlideTransition key={comment.ID} duration={150}>
        <Column md={4} offsetMd={4} xs={12}>
          <CommentCard
            comment={comment}
            activity={activity}
            onReplyClick={this.handleReplyClick}
          />
        </Column>
      </FadeAndSlideTransition>
    ));
  };

  /**
   * @returns {*}
   */
  renderLikeList = () => {
    const { activity } = this.state;

    if (!activity.LikeList) {
      return null;
    }

    return (
      <Card className="card-activity-like-list">
        <CardHeader>
          Liked By
        </CardHeader>
        <CardBody>
          <CardText>
            <ul className="list-group">
              {activity.LikeList.map(u => (
                <li key={u.UserID} className="list-group-item">
                  <UserBadge user={u} />
                </li>
              ))}
            </ul>
          </CardText>
        </CardBody>
      </Card>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { isActivityLoading, visibleModals } = this.props;
    const { activity } = this.state;

    if (isActivityLoading) {
      return <Loading middle />;
    }

    return (
      <Page key={`page_${activity.ActivityID}`} title={activity.FromUserName || ''}>
        <Row>
          <Column className="gutter-top" md={4} offsetMd={4} xs={12}>
            <ActivityCard
              clickable={false}
              activity={activity}
              clickableImage
            />
          </Column>
        </Row>
        <Row>
          <Column className="gutter-bottom" md={4} offsetMd={4} xs={12}>
            <PostForm
              name="post"
              onSubmit={this.handleCommentSubmit}
              comment
            />
          </Column>
        </Row>
        <TransitionGroup component={Row}>
          {this.renderComments()}
        </TransitionGroup>
        <AnimateHeight
          duration={250}
          height={(activity.LikeList && activity.LikeList.length > 0) ? 'auto' : 0}
        >
          <Row>
            <Column md={4} offsetMd={4} xs={12}>
              {this.renderLikeList()}
            </Column>
          </Row>
        </AnimateHeight>
        <ReplyModal
          onSubmit={this.handleCommentSubmit}
          open={visibleModals.reply !== false}
        />
      </Page>
    );
  }
}

const mapStateToProps = state => (
  {
    activity:          state.activity.activity,
    visibleModals:     state.ui.visibleModals,
    isActivityLoading: state.activity.isActivityLoading,
    isCommentsLoading: state.activity.isCommentsLoading
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, activityActions)
)(withRouter(ActivityPage));
