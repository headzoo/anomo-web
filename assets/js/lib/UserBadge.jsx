import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects, connect } from 'utils';
import { Link, Avatar } from 'lib';

/**
 *
 */
class UserBadge extends React.PureComponent {
  static propTypes = {
    user:               PropTypes.object.isRequired,
    followingUserNames: PropTypes.array.isRequired,
    className:          PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, className, followingUserNames, ...props } = this.props;

    const isFollowing = followingUserNames.indexOf(user.UserName) !== -1;

    return (
      <Link
        name="profile"
        params={{ id: user.UserID }}
        className={classNames('user-badge', className)}
        {...objects.propsFilter(props, UserBadge.propTypes, 'dispatch')}
      >
        <Avatar src={user.Avatar} following={isFollowing} sm />
        <span>{user.UserName}</span>
      </Link>
    );
  }
}

const mapStateToProps = state => (
  {
    followingUserNames: state.user.followingUserNames
  }
);

export default connect(mapStateToProps)(UserBadge);
