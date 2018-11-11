import React from 'react';
import PropTypes from 'prop-types';
import { objects, browser, connect, mapStateToProps, mapActionsToProps } from 'utils';
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
    const { match, location, history, activityGet, activityReset, activityIsActivityLoading } = this.props;
    const { activity, highlightedComment } = this.state;

    if (match.params.refID !== prevProps.match.params.refID) {
      activityReset();
      activityIsActivityLoading(true);
      activityGet(match.params.refID, match.params.actionType);
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
    const { activity, highlightedComment } = this.state;

    if (!activity.ListComment) {
      activity.ListComment = [];
    }

    if (this.props.activity.isCommentsLoading) {
      return (
        <Column key={0} className="text-center" md={4} offsetMd={4} xs={12}>
          <Loading />
        </Column>
      );
    }

    return activity.ListComment.map(comment => (
      <Column key={comment.ID} md={4} offsetMd={4} xs={12}>
        <CommentCard
          comment={comment}
          activity={activity}
          highlighted={comment.ID === highlightedComment}
        />
      </Column>
    ));
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity } = this.state;

    if (objects.isEmpty(activity)) {
      // return null;
    }
    if (this.props.activity.isActivityLoading) {
      return <Loading middle />;
    }

    return (
      <Page key={`page_${activity.ActivityID}`} title={activity.FromUserName || ''}>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <ActivityCard activity={activity} clickableImage clickable={false} />
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
