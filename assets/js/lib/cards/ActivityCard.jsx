import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Moment from 'react-moment';
import YouTube from 'react-youtube';
import { Twemoji } from 'react-emoji-render';
import { dates, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Card, CardHeader, CardBody, CardFooter, CardText } from 'lib/bootstrap';
import { LikeIcon } from 'lib/icons';
import { Image, Avatar, Number, Pluralize, Link, Icon, withRouter } from 'lib';
import routes from 'store/routes';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class ActivityCard extends React.PureComponent {
  static propTypes = {
    activity:       PropTypes.object.isRequired,
    className:      PropTypes.string,
    history:        PropTypes.object.isRequired,
    activityLike:   PropTypes.func.isRequired,
    clickable:      PropTypes.bool,
    clickableImage: PropTypes.bool
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
   * @returns {*}
   */
  renderHeader = () => {
    const { activity } = this.props;

    if (activity.IsAnonymous === '1') {
      activity.FromUserName = 'Anonymous';
      activity.Avatar = '/images/anonymous-avatar-sm.jpg';
    }

    return (
      <CardHeader>
        <div className="card-activity-avatar" onClick={this.handleUserClick}>
          <Avatar src={activity.Avatar || ''} />
        </div>
        <div className="card-activity-user">
          <div className="card-activity-username" onClick={this.handleUserClick}>
            {activity.FromUserName}
          </div>
          <div className="card-activity-location">
            {dates.getAge(activity.BirthDate || '1980-12-10')} &middot; {activity.NeighborhoodName || 'Earth'}
          </div>
        </div>
        <div className="card-activity-date">
          <div className="card-activity-ellipsis">
            <Icon name="ellipsis-h" />
          </div>
          <Moment fromNow>
            {activity.CreatedDate}
          </Moment>
        </div>
      </CardHeader>
    );
  };

  /**
   * @returns {*}
   */
  renderBody = () => {
    const { activity } = this.props;

    return (
      <CardBody>
        <CardText>
          {(activity.Message && activity.Message.message) && (
            <Twemoji text={activity.Message.message} />
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
          <Number value={comments} />&nbsp;
          <Pluralize number={comments} plural="Comments" singular="Comment" />
        </div>
      </CardFooter>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, clickable, className } = this.props;

    if (!clickable) {
      return (
        <Card key={activity.RefID} className={classNames('card-activity', className)}>
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderFooter()}
        </Card>
      );
    }

    return (
      <Card key={activity.RefID} className={`${classNames('card-activity', className)} card-activity-clickable`}>
        <Link
          name="activity"
          params={{ refID: activity.RefID, actionType: activity.ActionType }}
          state={{ activity }}
        >
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderFooter()}
        </Link>
      </Card>
    );
  }
}

export default connect(
  mapStateToProps(),
  mapActionsToProps(activityActions)
)(withRouter(ActivityCard));
