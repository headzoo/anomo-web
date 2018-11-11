import React from 'react';
import PropTypes from 'prop-types';
import { objects, browser, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { TransitionGroup, FadeAndSlideTransition } from 'lib/animation';
import { ActivityCard, CommentCard } from 'lib/cards';
import { Row, Column } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import { Page, Loading, withRouter } from 'lib';
import routes from 'store/routes';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class ActivityPage extends React.PureComponent {
  static propTypes = {
    activity:                  PropTypes.object.isRequired,
    match:                     PropTypes.object.isRequired,
    history:                   PropTypes.object.isRequired,
    location:                  PropTypes.object.isRequired,
    activityGet:               PropTypes.func.isRequired,
    activityReset:             PropTypes.func.isRequired,
    activitySubmitComment:     PropTypes.func.isRequired,
    activityIsCommentsLoading: PropTypes.func.isRequired,
    activityIsActivityLoading: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      activity:           {},
      highlightedComment: 0
    };
  }

  /**
   *
   */
  componentDidMount = () => {
    const { location, match, activityGet, activityIsCommentsLoading } = this.props;
    const { state } = location;

    if (state && state.activity) {
      if (state.activity.Comment !== '0') {
        activityIsCommentsLoading(true);
      }
      this.setState({ activity: state.activity }, () => {
        activityGet(match.params.refID, match.params.actionType);
      });
    } else {
      activityIsCommentsLoading(true);
      activityGet(match.params.refID, match.params.actionType);
    }
  };

  /**
   * @param {*} prevProps
   * @param {*} prevState
   */
  componentDidUpdate = (prevProps, prevState) => {
    const {
      match,
      location,
      history,
      activityGet,
      activityReset,
      activityIsActivityLoading,
      activityIsCommentsLoading
    } = this.props;

    const { activity, highlightedComment } = this.state;
    const { state } = location;

    if (match.params.refID !== prevProps.match.params.refID) {
      if (state && state.activity) {
        if (state.activity.Comment !== '0') {
          activityIsCommentsLoading(true);
        }
        this.setState({ activity: state.activity }, () => {
          activityGet(match.params.refID, match.params.actionType);
        });
      } else {
        activityReset();
        activityIsActivityLoading(true);
        activityGet(match.params.refID, match.params.actionType);
      }
      return;
    }

    if (this.props.activity.activity.IsDeleted) {
      history.push(routes.route('home'));
      return;
    }

    if (!this.props.activity.isCommentsLoading && prevProps.activity.isCommentsLoading) {
      const parsed = browser.parseHash(location);
      if (parsed.c) {
        this.setState({ highlightedComment: parsed.c });
      }
    }

    if (prevState.highlightedComment !== highlightedComment) {
      setTimeout(() => {
        const comment = document.getElementById(`comment-${highlightedComment}`);
        if (comment) {
          comment.scrollIntoView({
            block:    'center',
            behavior: 'smooth'
          });
        }
      }, 1000);
    }

    if (!objects.isEmpty(this.props.activity.activity)
      && !objects.isEqual(this.props.activity.activity, activity)
      && objects.isEqual(prevState.activity, activity)) {
      this.setState({ activity: this.props.activity.activity });
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
    activitySubmitComment(values.message, activity.RefID, activity.ActionType, activity.TopicID);
  };

  /**
   * @returns {*}
   */
  renderComments = () => {
    const { activity, highlightedComment } = this.state;

    if (!objects.isEmpty(activity) && !activity.ListComment) {
      activity.ListComment = [];
    }

    if (this.props.activity.isCommentsLoading) {
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
            highlighted={comment.ID === highlightedComment}
          />
        </Column>
      </FadeAndSlideTransition>
    ));
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity } = this.state;

    if (this.props.activity.isActivityLoading) {
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
          <Column md={4} offsetMd={4} xs={12}>
            <PostForm onSubmit={this.handleCommentSubmit} />
          </Column>
        </Row>
        <TransitionGroup component={Row}>
          {this.renderComments()}
        </TransitionGroup>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps('activity'),
  mapActionsToProps(activityActions)
)(withRouter(ActivityPage));
