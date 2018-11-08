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
    user:              PropTypes.object.isRequired,
    history:           PropTypes.object.isRequired,
    location:          PropTypes.object.isRequired,
    activity:          PropTypes.object.isRequired,
    notifications:     PropTypes.object.isRequired,
    activityFeedFetch: PropTypes.func.isRequired,
    uiVisibleModal:    PropTypes.func.isRequired
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
   * @param {Event} e
   * @param {string} feedType
   */
  handleFeedClick = (e, feedType) => {
    const { history, activityFeedFetch } = this.props;

    activityFeedFetch(feedType, true);
    history.push(routes.route(feedType));
  };

  /**
   * @returns {*}
   */
  render() {
    const { user, activity, location, notifications } = this.props;
    const { feeds } = activity;

    const navItems = [
      { name: 'about', label: 'About' }
    ];

    if (notifications.newNumber > 99) {
      notifications.newNumber = '99+';
    }

    let activeFeed = '';
    switch (location.pathname) {
      case routes.path('recent'):
        activeFeed = 'recent';
        break;
      case routes.path('popular'):
        activeFeed = 'popular';
        break;
      case routes.path('following'):
        activeFeed = 'following';
        break;
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
          {/* Feeds Start */}
          <Badge
            onClick={e => this.handleFeedClick(e, 'recent')}
            theme={activeFeed === 'recent' ? 'info' : 'dark'}
            className="nav-badge nav-badge-with-number clickable"
          >
            <span>Recent</span>
            <Badge className="nav-notifications-badge">
              {feeds.recent.newNumber}
            </Badge>
          </Badge>
          <Badge
            onClick={e => this.handleFeedClick(e, 'following')}
            theme={activeFeed === 'following' ? 'info' : 'dark'}
            className="nav-badge nav-badge-with-number clickable"
          >
            <span>Following</span>
            <Badge className="nav-notifications-badge">
              {feeds.following.newNumber}
            </Badge>
          </Badge>
          <Badge
            onClick={e => this.handleFeedClick(e, 'popular')}
            theme={activeFeed === 'popular' ? 'info' : 'dark'}
            className="nav-badge nav-badge-with-number clickable"
          >
            <span>Popular</span>
            <Badge className="nav-notifications-badge">
              {feeds.popular.newNumber}
            </Badge>
          </Badge>
          {/* Feeds End */}
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
