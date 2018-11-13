import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Moment from 'react-moment';
import YouTube from 'react-youtube';
import { dates, objects, connect, mapActionsToProps } from 'utils';
import { Card, CardHeader, CardBody, CardFooter, CardText } from 'lib/bootstrap';
import { LikeIcon } from 'lib/icons';
import { Image, Avatar, Message, Video, Shimmer, Poll, Number, Pluralize, Link, Icon, withRouter } from 'lib';
import routes from 'store/routes';
import * as activityActions from 'actions/activityActions';
import * as uiActions from 'actions/uiActions';

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
  renderHeader = () => {
    const { activity, followingUserNames } = this.props;

    if (activity.IsAnonymous === '1') {
      activity.FromUserName = 'Anonymous';
      activity.Avatar = '/images/anonymous-avatar-sm.jpg';
    }

    const isFollowing  = followingUserNames.indexOf(activity.FromUserName) !== -1;
    const isLoading    = objects.isEmpty(activity) || activity.isLoading;
    const birthday     = dates.getAge(activity.BirthDate || '1980-12-10');
    const neighborhood = activity.NeighborhoodName || 'Earth';
    const location     = `${birthday} · ${neighborhood}`;

    return (
      <CardHeader>
        <div className="card-activity-avatar" onClick={this.handleUserClick}>
          {isLoading ? (
            <Shimmer className="card-activity-shimmer-avatar" />
          ) : (
            <span className={isFollowing ? 'avatar-following' : ''}>
              <Avatar
                src={activity.Avatar || '/images/anonymous-avatar-sm.jpg'}
              />
            </span>
          )}
        </div>
        <div className="card-activity-user">
          <div className="card-activity-username" onClick={this.handleUserClick}>
            {isLoading ? (
              <Shimmer className="card-activity-shimmer" />
            ) : activity.FromUserName}
          </div>
          <div className="card-activity-location">
            {isLoading ? (
              <Shimmer className="card-activity-shimmer" />
            ) : location}
          </div>
        </div>
        <div className="card-activity-date">
          <div className="card-activity-ellipsis" onClick={this.handleMenuClick}>
            <Icon name="ellipsis-h" />
          </div>
          {!isLoading && (
            <Moment fromNow>
              {activity.CreatedDate}
            </Moment>
          )}
        </div>
      </CardHeader>
    );
  };

  /**
   * @returns {*}
   */
  renderBody = () => {
    const { activity } = this.props;

    if (objects.isEmpty(activity) || activity.isLoading) {
      return (
        <CardBody>
          <CardText>
            <Shimmer className="card-activity-shimmer" />
            <Shimmer className="card-activity-shimmer-short" />
          </CardText>
        </CardBody>
      );
    }

    return (
      <CardBody onClick={this.handleBodyClick}>
        <CardText>
          {(activity.Message && activity.Message.message) && (
            <Message text={activity.Message.message} tags={activity.Message.message_tags} />
          )}
          {activity.Poll && (
            <Poll poll={activity.Poll} onAnswer={this.handlePollAnswer} />
          )}
          {activity.Image && (
            <Image
              data={{ src: activity.Image, alt: 'Image' }}
              onClick={this.handleImageClick}
            />
          )}
          {activity.VideoID && (
            <YouTube
              videoId={activity.VideoID}
            />
          )}
          {activity.VideoURL && (
            <Video source={activity.VideoURL} poster={activity.VideoThumbnail} />
          )}
        </CardText>
      </CardBody>
    );
  };

  /**
   * @returns {*}
   */
  renderFooter = () => {
    const { activity } = this.props;

    const comments  = parseInt(activity.Comment || 0, 10);
    const likes     = parseInt(activity.Like || 0, 10);
    const isLiked   = (activity.IsLike && activity.IsLike === '1');
    const isComment = (activity.IsComment && activity.IsComment === '1');

    const commentClasses = classNames('card-activity-comment', {
      'card-activity-comment-commented': isComment
    });

    return (
      <CardFooter>
        <div className="card-activity-like">
          <LikeIcon
            liked={isLiked}
            loading={activity.LikeIsLoading}
            onClick={this.handleHeartClick}
          />&nbsp;
          {likes}&nbsp;
          <Pluralize number={likes} singular="Like" plural="Likes" />
        </div>
        <div className={commentClasses}>
          <Link
            name="activity"
            state={{ activity }}
            params={{ refID: activity.RefID, actionType: activity.ActionType }}
          >
            <Number value={comments} />&nbsp;
            <Pluralize number={comments} plural="Comments" singular="Comment" />
          </Link>
        </div>
      </CardFooter>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, className } = this.props;

    return (
      <Card
        key={`activity_${activity.RefID}`}
        className={classNames('card-activity  card-activity-clickable', className)}
      >
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
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
