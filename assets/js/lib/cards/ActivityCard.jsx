import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import YouTube from 'react-youtube';
import { objects, connect, mapActionsToProps } from 'utils';
import { Card, CardBody, CardText } from 'lib/bootstrap';
import { Image, Message, Video, Shimmer, Poll, withRouter } from 'lib';
import routes from 'store/routes';
import * as activityActions from 'actions/activityActions';
import * as uiActions from 'actions/uiActions';
import ActivityCardHeader from './ActivityCardHeader';
import ActivityCardBody from './ActivityCardBody';
import ActivityCardFooter from './ActivityCardFooter';

/**
 *
 */
class ActivityCard extends React.PureComponent {
  static propTypes = {
    activity:           PropTypes.object.isRequired,
    className:          PropTypes.string,
    history:            PropTypes.object.isRequired,
    clickable:          PropTypes.bool,
    clickableImage:     PropTypes.bool,
    followingUserNames: PropTypes.array.isRequired,
    activityLike:       PropTypes.func.isRequired,
    activityAnswerPoll: PropTypes.func.isRequired,
    uiVisibleModal:     PropTypes.func.isRequired
  };

  static defaultProps = {
    className:      '',
    clickable:      true,
    clickableImage: false
  };

  /**
   * @param {Event} e
   */
  handleHeartClick = (e) => {
    const { activity, activityLike } = this.props;

    e.preventDefault();
    activityLike(activity.RefID, activity.ActionType);
  };

  /**
   * @param {Event} e
   */
  handleImageClick = (e) => {
    const { activity, clickableImage } = this.props;

    if (clickableImage) {
      e.preventDefault();
      window.open(activity.Image);
    }
  };

  /**
   * @param {Event} e
   */
  handleUserClick = (e) => {
    const { activity, history } = this.props;

    e.preventDefault();
    if (activity.IsAnonymous !== '1') {
      history.push(routes.route('profile', { id: activity.FromUserID }));
    }
  };

  /**
   * @param {Event} e
   */
  handleMenuClick = (e) => {
    const { activity, uiVisibleModal } = this.props;

    e.preventDefault();
    uiVisibleModal('activity', activity);
  };

  /**
   * @param {Event} e
   */
  handleBodyClick = (e) => {
    const { activity, clickable, history } = this.props;

    if (clickable) {
      e.preventDefault();

      const route = routes.route('activity', { refID: activity.RefID, actionType: activity.ActionType });
      history.push(route, { activity });
    }
  };

  /**
   *
   * @param {Event} e
   * @param {number} answerID
   */
  handlePollAnswer = (e, answerID) => {
    const { activity, activityAnswerPoll } = this.props;

    activityAnswerPoll(activity.Poll.PollQuestionID, answerID);
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, followingUserNames, className } = this.props;

    return (
      <Card
        key={`activity_${activity.RefID}`}
        className={classNames('card-activity  card-activity-clickable', className)}
      >
        <ActivityCardHeader
          activity={activity}
          onUserClick={this.handleUserClick}
          onMenuClick={this.handleMenuClick}
          followingUserNames={followingUserNames}
        />
        <ActivityCardBody
          activity={activity}
          onClick={this.handleBodyClick}
          onImageClick={this.handleImageClick}
          onPollAnswer={this.handlePollAnswer}
        />
        <ActivityCardFooter
          activity={activity}
          onLikeClick={this.handleHeartClick}
        />
      </Card>
    );
  }
}

const mapStateToProps = state => (
  {
    followingUserNames: state.user.followingUserNames
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(activityActions, uiActions)
)(withRouter(ActivityCard));
