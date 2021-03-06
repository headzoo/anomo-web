import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { CardFooter } from 'lib/bootstrap';
import { LikeIcon } from 'lib/icons';
import { Pluralize, Number, Link } from 'lib';

/**
 *
 */
class ActivityCardFooter extends React.PureComponent {
  static propTypes = {
    loading:        PropTypes.bool,
    activity:       PropTypes.object.isRequired,
    comment:        PropTypes.bool,
    onLikeClick:    PropTypes.func,
    onCommentClick: PropTypes.func
  };

  static defaultProps = {
    loading:        false,
    comment:        false,
    onLikeClick:    () => {},
    onCommentClick: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, loading, comment, onLikeClick, onCommentClick } = this.props;

    const { RefID, ActionType, Comment, Like, IsLike, IsComment, LikeIsLoading } = activity;
    const comments  = parseInt(Comment || 0, 10);
    const likes     = parseInt(Like || 0, 10);
    const isLiked   = !!(IsLike && IsLike === '1');
    const isComment = !!(IsComment && IsComment === '1');

    const commentClasses = classNames('card-activity-comment', {
      'card-activity-comment-commented': isComment
    });

    if (loading || objects.isEmpty(activity)) {
      return (
        <CardFooter>
          <div className="card-activity-like">
            <LikeIcon />&nbsp;<Number value={0} />&nbsp;Likes
          </div>
          <div className={commentClasses}>
            {!comment && (
              <span>
                <Number value={0} />&nbsp;Comments
              </span>
            )}
          </div>
        </CardFooter>
      );
    }

    return (
      <CardFooter>
        <div className="card-activity-like">
          <LikeIcon
            liked={isLiked}
            loading={LikeIsLoading || false}
            onClick={onLikeClick}
          />&nbsp;
          <Number value={likes} />&nbsp;
          <Pluralize number={likes} singular="Like" plural="Likes" />
        </div>
        <div className={commentClasses}>
          {!comment && (
            <Link
              name="activity"
              state={{ activity }}
              onClick={onCommentClick}
              params={{ refID: RefID || '0', actionType: ActionType || '0' }}
            >
              <Number value={comments} />&nbsp;
              <Pluralize number={comments} plural="Comments" singular="Comment" />
            </Link>
          )}
        </div>
      </CardFooter>
    );
  }
}

export default ActivityCardFooter;
