import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapStateToProps, mapActionsToProps } from 'utils/state';
import { Badge } from 'lib/bootstrap';
import { Link, withRouter } from 'lib';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class Nav extends React.PureComponent {
  static propTypes = {
    user:           PropTypes.object.isRequired,
    history:        PropTypes.object.isRequired,
    activity:       PropTypes.object.isRequired,
    notifications:  PropTypes.object.isRequired,
    activityFetch:  PropTypes.func.isRequired,
    uiVisibleModal: PropTypes.func.isRequired
  };

  /**
   *
   */
  handleNotificationsClick = () => {
    const { notifications, uiVisibleModal } = this.props;

    if (notifications.newNumber > 0) {
      uiVisibleModal('notifications', true);
    }
  };

  /**
   *
   */
  handleFeedClick = () => {
    const { history, activityFetch } = this.props;

    activityFetch(true);
    history.push(routes.route('home'));
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, activity, notifications } = this.props;

    const navItems = [
      { name: 'about', label: 'About' }
    ];

    if (activity.newNumber > 99) {
      activity.newNumber = '99+';
    }
    if (notifications.newNumber > 99) {
      notifications.newNumber = '99+';
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <Link name="home" className="navbar-brand">
          Anomo
        </Link>
        <button
          type="button"
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbar-nav"
          aria-controls="navbar-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbar-nav">
          <Badge
            onClick={this.handleFeedClick}
            className="nav-badge nav-badge-with-number clickable"
          >
            <span>Feed</span>
            <Badge className="nav-notifications-badge">
              {activity.newNumber}
            </Badge>
          </Badge>
          <Badge
            onClick={this.handleNotificationsClick}
            className="nav-badge nav-badge-with-number clickable"
          >
            <span>Notifications</span>
            <Badge className="nav-notifications-badge">
              {notifications.newNumber}
            </Badge>
          </Badge>
          <ul className="navbar-nav">
            {navItems.map(item => (
              <li key={item.name} className="nav-item">
                <Link name={item.name} className="nav-link">
                  <Badge className="nav-badge">
                    {item.label}
                  </Badge>
                </Link>
              </li>
            ))}
            {user.isAuthenticated ? (
              <li className="nav-item">
                <Link name="logout" className="nav-link">
                  <Badge className="nav-badge">
                    Logout
                  </Badge>
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link name="login" className="nav-link">
                  <Badge className="nav-badge">
                    Login
                  </Badge>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default connect(
  mapStateToProps('user', 'activity', 'notifications'),
  mapActionsToProps(uiActions, activityActions)
)(withRouter(Nav));
