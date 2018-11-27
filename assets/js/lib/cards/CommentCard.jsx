import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Moment from 'react-moment';
import { numbers, connect, mapActionsToProps } from 'utils';
import { Card, CardHeader, CardBody, CardFooter, CardText } from 'lib/bootstrap';
import { Message, Image, Avatar, Icon, Pluralize, Ellipsis, UserBadge, Link, Age, Neighborhood, withRouter } from 'lib';
import { LikeIcon } from 'lib/icons';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class CommentCard extends React.PureComponent {
  static propTypes = {
    id:                      PropTypes.string.isRequired,
    comment:                 PropTypes.object.isRequired,
    activity:                PropTypes.object.isRequired,
    followingUserNames:      PropTypes.array.isRequired,
    tags:                    PropTypes.array,
    className:               PropTypes.string,
    active:                  PropTypes.bool,
    history:                 PropTypes.object.isRequired,
    uiVisibleModal:          PropTypes.func.isRequired,
    activityLikeComment:     PropTypes.func.isRequired,
    activityCommentLikeList: PropTypes.func.isRequired,
    onReplyClick:            PropTypes.func
  };

  static defaultProps = {
    tags:         [],
    active:       false,
    className:    '',
    onReplyClick: () => {}
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
   *
   */
  handleLikesClick = () => {
    const { comment, activity, activityCommentLikeList } = this.props;

    activityCommentLikeList(comment.ID, activity.RefID, activity.ActionType);
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    const { comment, activity, followingUserNames } = this.props;

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
          <Link
            name="activity"
            hash={`#comment-${comment.ID}`}
            params={{ refID: activity.RefID, actionType: activity.ActionType  }}
          >
            <Moment fromNow ago>
              {comment.CreatedDate}
            </Moment>
          </Link>
        </div>
      </CardHeader>
    );
  };

  /**
   * @returns {*}
   */
  renderBody = () => {
    const { comment, tags } = this.props;

    return (
      <CardBody>
        <CardText>
          {comment.Content && (
            <Message text={comment.Content} tags={tags} />
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
    const { comment, onReplyClick } = this.props;

    const numLikes      = numbers.parseAny(comment.NumberOfLike);
    const isLiked       = (comment.IsLike && comment.IsLike === '1');
    const isListLoading = (comment.isCommentListLoading || false);

    return (
      <CardFooter>
        <div className="card-activity-like">
          <LikeIcon
            liked={isLiked}
            loading={comment.LikeIsLoading}
            onClick={this.handleHeartClick}
          />&nbsp;
          {numLikes}&nbsp;
          {isListLoading ? (
            <span>Loading<Ellipsis animated /></span>
          ) : (
            <span title="View likes" className="clickable" onClick={this.handleLikesClick}>
              <Pluralize
                number={numLikes}
                singular="Like"
                plural="Likes"
              />
            </span>
          )}
        </div>
        <div className="clickable" onClick={e => onReplyClick(e, comment)}>
          Reply
        </div>
      </CardFooter>
    );
  };

  /**
   * @returns {*}
   */
  renderLikes = () => {
    const { comment } = this.props;

    if (!comment.LikeList || comment.LikeList.length === 0) {
      return null;
    }

    return (
      <CardFooter className="card-activity-like-list">
        <ul className="list-group">
          {comment.LikeList.map(u => (
            <li key={u.UserID} className="list-group-item">
              <UserBadge user={u} />
            </li>
          ))}
        </ul>
      </CardFooter>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { id, active, className } = this.props;

    const classes = classNames('card-comment', className, {
      'active': active
    });

    return (
      <Card id={id} className={classes}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
        {this.renderLikes()}
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
