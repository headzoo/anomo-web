import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Moment from 'react-moment';
import { objects } from 'utils';
import { Card, CardHeader, CardBody, CardFooter, CardText } from 'lib/bootstrap';
import { LikeIcon } from 'lib/icons';
import { Text, Image, Avatar, Number, Pluralize, Link, withRouter } from 'lib';

/**
 *
 */
class ActivityCard extends React.PureComponent {
  static propTypes = {
    activity:  PropTypes.object.isRequired,
    className: PropTypes.string,
    history:   PropTypes.object.isRequired
  };

  static defaultProps = {
    className: ''
  };

  /**
   * @param {Event} e
   */
  handleHeartClick = (e) => {
    e.preventDefault();
    console.log('clicked');
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    const { activity } = this.props;

    return (
      <CardHeader>
        <div className="card-activity-avatar">
          <Avatar src={activity.Avatar} />
        </div>
        <div className="card-activity-user">
          <div className="card-activity-username">
            {activity.FromUserName}
          </div>
          <div className="card-activity-location">
            21 &middot; {activity.NeighborhoodName || 'Earth'}
          </div>
        </div>
        <div className="card-activity-date">
          <Moment fromNow ago>
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
          {activity.Message.message && (
            <Text nl2p>
              {activity.Message.message}
            </Text>
          )}
          {activity.Image && (
            <Image data={{ src: activity.Image, alt: '' }} />
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

    const comments  = parseInt(activity.Comment, 10);
    const likes     = parseInt(activity.Like, 10);
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
    const { activity, className, ...props } = this.props;
console.log(activity);

    return (
      <Card
        className={classNames('card-activity', className)}
        {...objects.propsFilter(props, ActivityCard.propTypes, ['routerParams', 'routerQuery', 'staticContext'])}
      >
        <Link name="activity" params={{ id: activity.ActivityID }}>
          {this.renderHeader()}
          {this.renderBody()}
          {this.renderFooter()}
        </Link>
      </Card>
    );
  }
}

export default withRouter(ActivityCard);
