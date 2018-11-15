import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Moment from 'react-moment';
import { Twemoji } from 'react-emoji-render';
import { connect, mapActionsToProps } from 'utils';
import { Card, CardHeader, CardBody, CardFooter, CardText } from 'lib/bootstrap';
import { Image, Avatar, Icon, Pluralize, Age, Neighborhood, withRouter } from 'lib';
import { LikeIcon } from 'lib/icons';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class CommentCard extends React.PureComponent {
  static propTypes = {
    comment:             PropTypes.object.isRequired,
    activity:            PropTypes.object.isRequired,
    followingUserNames:  PropTypes.array.isRequired,
    className:           PropTypes.string,
    history:             PropTypes.object.isRequired,
    uiVisibleModal:      PropTypes.func.isRequired,
    activityLikeComment: PropTypes.func.isRequired
  };

  static defaultProps = {
    className: ''
  };

  /**
   * @param {Event} e
   */
  handleUserClick = (e) => {
    const { comment, history } = this.props;

    e.preventDefault();
    history.push(routes.route('profile', { id: comment.UserID }));
  };

  /**
   * @param {Event} e
   */
  handleImageClick = (e) => {
    const { comment } = this.props;

    e.preventDefault();
    window.open(comment.Image);
  };

  /**
   * @param {Event} e
   */
  handleHeartClick = (e) => {
    const { comment, activity, activityLikeComment } = this.props;

    e.preventDefault();
    activityLikeComment(comment.ID, activity.RefID, activity.ActionType);
  };

  /**
   * @param {Event} e
   */
  handleMenuClick = (e) => {
    const { comment, activity, uiVisibleModal } = this.props;

    e.preventDefault();
    uiVisibleModal('comment', { comment, activity });
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    const { comment, followingUserNames } = this.props;

    const isFollowing = followingUserNames.indexOf(comment.UserName) !== -1;

    return (
      <CardHeader>
        <div onClick={this.handleUserClick} className="card-comment-avatar">
          <Avatar src={comment.Avatar} following={isFollowing} sm />
        </div>
        <div className="card-comment-user">
          <div className="card-comment-username" onClick={this.handleUserClick}>
            {comment.UserName}
          </div>
          <div className="card-comment-location">
            <Age date={comment.BirthDate} /> &middot; <Neighborhood name={comment.NeighborhoodName} />
          </div>
        </div>
        <div className="card-comment-date">
          <div className="card-comment-ellipsis" onClick={this.handleMenuClick}>
            <Icon name="ellipsis-h" />
          </div>
          <Moment fromNow ago>
            {comment.CreatedDate}
          </Moment>
        </div>
      </CardHeader>
    );
  };

  /**
   * @returns {*}
   */
  renderBody = () => {
    const { comment } = this.props;

    return (
      <CardBody>
        <CardText>
          {comment.Content && (
            <Twemoji text={comment.Content} />
          )}
          {comment.Image && (
            <Image
              data={{ src: comment.Image, alt: 'Image' }}
              onClick={this.handleImageClick}
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
    const { comment } = this.props;

    const likes   = parseInt(comment.NumberOfLike || 0, 10);
    const isLiked = (comment.IsLike && comment.IsLike === '1');

    return (
      <CardFooter>
        <div className="card-activity-like">
          <LikeIcon
            liked={isLiked}
            loading={comment.LikeIsLoading}
            onClick={this.handleHeartClick}
          />&nbsp;
          {likes}&nbsp;
          <Pluralize number={likes} singular="Like" plural="Likes" />
        </div>
      </CardFooter>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { comment, className } = this.props;

    const classes = classNames('card-comment', className);

    return (
      <Card id={`comment-${comment.ID}`} className={classes}>
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
  mapActionsToProps(uiActions, activityActions)
)(withRouter(CommentCard));
