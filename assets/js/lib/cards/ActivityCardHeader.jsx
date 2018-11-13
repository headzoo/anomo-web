import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { dates, objects } from 'utils';
import { CardHeader } from 'lib/bootstrap';
import { Avatar, Shimmer, Icon } from 'lib';

/**
 *
 */
class ActivityCardHeader extends React.PureComponent {
  static propTypes = {
    activity:           PropTypes.object.isRequired,
    followingUserNames: PropTypes.array.isRequired,
    onUserClick:        PropTypes.func,
    onMenuClick:        PropTypes.func
  };

  static defaultProps = {
    onUserClick: () => {},
    onMenuClick: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, onUserClick, onMenuClick, followingUserNames } = this.props;

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
        <div className="card-activity-avatar" onClick={onUserClick}>
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
          <div className="card-activity-username" onClick={onUserClick}>
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
          <div className="card-activity-ellipsis" onClick={onMenuClick}>
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
  }
}

export default ActivityCardHeader;
