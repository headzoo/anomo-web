import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Moment from 'react-moment';
import { Twemoji } from 'react-emoji-render';
import { dates } from 'utils';
import { Card, CardHeader, CardBody, CardFooter, CardText } from 'lib/bootstrap';
import { Text, Image, Avatar, Pluralize, Link, withRouter } from 'lib';
import { LikeIcon } from 'lib/icons';
import routes from '../../store/routes';

/**
 *
 */
class CommentCard extends React.PureComponent {
  static propTypes = {
    comment:   PropTypes.object.isRequired,
    className: PropTypes.string,
    history:   PropTypes.object.isRequired
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
    history.push(routes.route('profile', { userName: comment.UserName }));
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
    const { comment, activityLike } = this.props;

    e.preventDefault();
    // activityLike(comment.RefID, comment.ActionType);
  };

  /**
   * @returns {*}
   */
  renderHeader = () => {
    const { comment } = this.props;

    return (
      <CardHeader>
        <div className="card-comment-avatar" onClick={this.handleUserClick}>
          <Avatar src={comment.Avatar || ''} />
        </div>
        <div className="card-comment-user">
          <div className="card-comment-username" onClick={this.handleUserClick}>
            {comment.UserName}
          </div>
          <div className="card-comment-location">
            {dates.getAge(comment.BirthDate || '1980-12-10')} &middot; {comment.NeighborhoodName || 'Earth'}
          </div>
        </div>
        <div className="card-comment-date">
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

    const likes   = parseInt(comment.Like || 0, 10);
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
    const { className } = this.props;

    return (
      <Card className={classNames('card-comment', className)}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </Card>
    );
  }
}

export default withRouter(CommentCard);
