import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { objects } from 'utils';
import { CardHeader } from 'lib/bootstrap';
import { Avatar, Shimmer, Icon, Age, Neighborhood } from 'lib';

/**
 *
 */
class ActivityCardHeader extends React.PureComponent {
  static propTypes = {
    loading:            PropTypes.bool,
    activity:           PropTypes.object.isRequired,
    followingUserNames: PropTypes.array.isRequired,
    onUserClick:        PropTypes.func,
    onMenuClick:        PropTypes.func
  };

  static defaultProps = {
    loading:     false,
    onUserClick: () => {},
    onMenuClick: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, loading, onUserClick, onMenuClick, followingUserNames } = this.props;

    if (activity.IsAnonymous === '1') {
      activity.FromUserName = 'Anonymous';
      activity.Avatar = '/images/anonymous-avatar-sm.jpg';
    }

    const isFollowing  = followingUserNames.indexOf(activity.FromUserName) !== -1;
    const isLoading    = loading || objects.isEmpty(activity);

    return (
      <CardHeader>
        <div className="card-activity-avatar" onClick={onUserClick}>
          {isLoading ? (
            <Shimmer className="card-activity-shimmer-avatar" />
          ) : (
            <Avatar
              src={activity.Avatar}
              following={isFollowing}
              md
            />
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
            ) : (
              <span>
                <Age date={activity.BirthDate} /> &middot; <Neighborhood name={activity.NeighborhoodName} />
              </span>
            )}
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
