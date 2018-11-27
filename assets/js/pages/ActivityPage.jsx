import React from 'react';
import PropTypes from 'prop-types';
import { objects, browser, connect, mapActionsToProps } from 'utils';
import { TransitionGroup, FadeAndSlideTransition } from 'lib/animation';
import { ActivityCard, CommentCard } from 'lib/cards';
import { ReplyModal } from 'lib/modals';
import { Row, Column, Card, CardHeader, CardBody, CardText } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import { Page, Loading, Icon, UserBadge, withRouter } from 'lib';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as activityActions from 'actions/activityActions';

const FADE_DURATION  = 150;
const COMMENT_PREFIX = '#comment-';

/**
 *
 */
class ActivityPage extends React.PureComponent {
  static propTypes = {
    activity:                  PropTypes.object.isRequired,
    likeList:                  PropTypes.array.isRequired,
    isCommentsLoading:         PropTypes.bool.isRequired,
    isActivityLoading:         PropTypes.bool.isRequired,
    match:                     PropTypes.object.isRequired,
    history:                   PropTypes.object.isRequired,
    location:                  PropTypes.object.isRequired,
    visibleModals:             PropTypes.object.isRequired,
    uiVisibleModal:            PropTypes.func.isRequired,
    activitySubmitComment:     PropTypes.func.isRequired,
    activitySetupActivityPage: PropTypes.func.isRequired,
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      activity:      {},
      activeComment: { ID: '0' }
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
    const { isCommentsLoading, match, history, location } = this.props;

    if (match.params.refID !== prevProps.match.params.refID) {
      this.handleUpdate();
    } else if (this.props.activity.IsDeleted) {
      history.push(routes.route('home'));
    } else if (!objects.isEmpty(this.props.activity) && !objects.isEqual(this.props.activity, prevProps.activity)) {
      this.setState({ activity: this.props.activity }, () => {
        browser.storage.push(browser.storage.KEY_ACTIVITY_HISTORY, this.props.activity, 12);
      });
    } else if (location.hash && location.hash.indexOf(COMMENT_PREFIX) === 0) {
      if (isCommentsLoading !== prevProps.isCommentsLoading && prevProps.isCommentsLoading) {
        this.activateComment(location.hash);
      } else if (location.hash !== prevProps.location.hash) {
        this.activateComment(location.hash);
      }
    }
  };

  /**
   * @param {string} hash
   */
  activateComment = (hash) => {
    const { activity } = this.props;
    const { ListComment } = activity;

    const hashID = hash.replace(COMMENT_PREFIX, '');
    for (let i = 0; i < ListComment.length; i++) {
      if (ListComment[i].ID === hashID) {
        this.setState({ activeComment: ListComment[i] });
        break;
      }
    }
  };

  /**
   *
   */
  handleUpdate = () => {
    const { location, match, activitySetupActivityPage } = this.props;
    const { state } = location;

    if (state && state.activity) {
      this.setState({ activity: state.activity, activeComment: { ID: '0' } }, () => {
        activitySetupActivityPage(0, 0, state.activity);
      });
    } else {
      this.setState({ activeComment: { ID: '0' } });
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
    activitySubmitComment({
      formName:   values.reply === '1' ? 'reply' : 'post',
      message:    values.message,
      reply:      values.reply,
      refID:      activity.RefID,
      actionType: activity.ActionType
    });
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
   *
   */
  handleJumpClick = () => {
    const { activeComment } = this.state;

    const comment = document.querySelector(`${COMMENT_PREFIX}${activeComment.ID}`);
    if (comment) {
      comment.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  /**
   * @returns {*}
   */
  renderComments = () => {
    const { isCommentsLoading } = this.props;
    const { activity, activeComment } = this.state;

    if (isCommentsLoading) {
      return (
        <FadeAndSlideTransition key={0} duration={FADE_DURATION}>
          <Column className="text-center gutter-bottom">
            <Loading label="Loading comments" />
          </Column>
        </FadeAndSlideTransition>
      );
    }

    const comments = activity.ListComment || [];
    const tags     = comments.map((c) => {
      return {
        id:   c.UserID,
        name: `@${c.UserName}`
      };
    });

    return comments.map(comment => (
      <FadeAndSlideTransition key={comment.ID} duration={FADE_DURATION}>
        <Column>
          <CommentCard
            tags={tags}
            comment={comment}
            activity={activity}
            onReplyClick={this.handleReplyClick}
            active={activeComment.ID === comment.ID}
            id={`${COMMENT_PREFIX.replace('#', '')}${comment.ID}`}
          />
        </Column>
      </FadeAndSlideTransition>
    ));
  };

  /**
   * @returns {*}
   */
  renderLikeList = () => {
    const { likeList } = this.props;

    return (
      <Card className="card-activity-like-list">
        <CardHeader>
          Liked By
        </CardHeader>
        <CardBody>
          <CardText>
            <ul className="list-group">
              {likeList.map(u => (
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
    const { isActivityLoading, isCommentsLoading, likeList, visibleModals } = this.props;
    const { activity, activeComment } = this.state;

    return (
      <Page key={`page_${activity.ActivityID}`} title={activity.FromUserName || ''}>
        {activeComment.ID !== '0' && (
          <Row>
            <Column>
              <div className="page-activity-jump-link clickable" onClick={this.handleJumpClick}>
                Go to {activeComment.UserName}&apos;s comment.
                <Icon name="angle-down" />
              </div>
            </Column>
          </Row>
        )}
        <Row>
          <Column className="gutter-top">
            <ActivityCard
              clickable={false}
              activity={activity}
              loading={isActivityLoading}
              clickableImage
            />
          </Column>
        </Row>
        <Row>
          <Column className="gutter-bottom">
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
        {(!isCommentsLoading && likeList.length > 0) && (
          <Row>
            <Column>
              {this.renderLikeList()}
            </Column>
          </Row>
        )}
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
    likeList:          state.activity.activity.LikeList || [],
    visibleModals:     state.ui.visibleModals,
    isActivityLoading: state.activity.isActivityLoading,
    isCommentsLoading: state.activity.isCommentsLoading
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, activityActions)
)(withRouter(ActivityPage));
