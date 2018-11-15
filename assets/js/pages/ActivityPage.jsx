import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapActionsToProps } from 'utils';
import { TransitionGroup, FadeAndSlideTransition } from 'lib/animation';
import { ActivityCard, CommentCard } from 'lib/cards';
import { Row, Column, Card, CardHeader, CardBody, CardText } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import { Page, Loading, Avatar, Link, withRouter } from 'lib';
import routes from 'store/routes';
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
    activityGet:               PropTypes.func.isRequired,
    activityReset:             PropTypes.func.isRequired,
    activityLikeList:          PropTypes.func.isRequired,
    activitySubmitComment:     PropTypes.func.isRequired,
    activityIsCommentsLoading: PropTypes.func.isRequired,
    activityIsActivityLoading: PropTypes.func.isRequired,
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
    const { location, match, activityGet, activityLikeList, activityIsCommentsLoading } = this.props;
    const { state } = location;

    if (state && state.activity) {
      if (state.activity.Comment !== '0') {
        activityIsCommentsLoading(true);
      }
      this.setState({ activity: state.activity }, () => {
        activityGet(match.params.refID, match.params.actionType);
        activityLikeList(match.params.refID, match.params.actionType);
      });
    } else {
      activityIsCommentsLoading(true);
      activityGet(match.params.refID, match.params.actionType);
      activityLikeList(match.params.refID, match.params.actionType);
    }
  };

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const {
      match,
      location,
      history,
      activityGet,
      activityReset,
      activityLikeList,
      activityIsActivityLoading,
      activityIsCommentsLoading
    } = this.props;
    const { state } = location;

    if (match.params.refID !== prevProps.match.params.refID) {
      if (state && state.activity) {
        if (state.activity.Comment !== '0') {
          activityIsCommentsLoading(true);
        }
        this.setState({ activity: state.activity }, () => {
          activityGet(match.params.refID, match.params.actionType);
          activityLikeList(match.params.refID, match.params.actionType);
        });
      } else {
        activityReset();
        activityIsActivityLoading(true);
        activityGet(match.params.refID, match.params.actionType);
        activityLikeList(match.params.refID, match.params.actionType);
      }
      return;
    }

    if (this.props.activity.IsDeleted) {
      history.push(routes.route('home'));
      return;
    }

    if (!objects.isEqual(this.props.activity, prevProps.activity)) {
      this.setState({ activity: this.props.activity });
    }
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handleCommentSubmit = (e, values) => {
    const { activitySubmitComment } = this.props;
    const { activity } = this.state;

    e.preventDefault();
    activitySubmitComment(
      'post',
      values.message,
      activity.RefID,
      activity.ActionType,
      activity.TopicID
    );
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
          />
        </Column>
      </FadeAndSlideTransition>
    ));
  };

  /**
   * @returns {*}
   */
  renderListList = () => {
    const { activity } = this.state;

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
                  <Link name="profile" params={{ id: u.UserID }}>
                    <Avatar src={u.Avatar} />
                    {u.UserName}
                  </Link>
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
    const { isActivityLoading } = this.props;
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
            <PostForm name="post" onSubmit={this.handleCommentSubmit} comment />
          </Column>
        </Row>
        <TransitionGroup component={Row}>
          {this.renderComments()}
        </TransitionGroup>
        {(activity.LikeList && activity.LikeList.length > 0) && (
          <Row>
            <Column className="gutter-top" md={4} offsetMd={4} xs={12}>
              {this.renderListList()}
            </Column>
          </Row>
        )}
      </Page>
    );
  }
}

const mapStateToProps = state => (
  {
    activity:          state.activity.activity,
    isActivityLoading: state.activity.isActivityLoading,
    isCommentsLoading: state.activity.isCommentsLoading
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(activityActions)
)(withRouter(ActivityPage));
