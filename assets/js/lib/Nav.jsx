import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapStateToProps, mapActionsToProps } from 'utils/state';
import { Badge } from 'lib/bootstrap';
import { NavBadge, Link, withRouter } from 'lib';
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
  renderNavItems = () => {
    const { user } = this.props;

    const navItems = [
      { name: 'about', label: 'About' }
    ];

    return (
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
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, location, notifications } = this.props;
    const { feeds } = activity;

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
          <NavBadge
            number={notifications.newNumber}
            onClick={this.handleNotificationsClick}
          >
            Notifications
          </NavBadge>
          <NavBadge
            number={feeds.recent.newNumber}
            active={activeFeed === 'recent'}
            onClick={e => this.handleFeedClick(e, 'recent')}
          >
            Recent
          </NavBadge>
          <NavBadge
            number={feeds.following.newNumber}
            active={activeFeed === 'following'}
            onClick={e => this.handleFeedClick(e, 'following')}
          >
            Following
          </NavBadge>
          <NavBadge
            number={feeds.popular.newNumber}
            active={activeFeed === 'popular'}
            onClick={e => this.handleFeedClick(e, 'popular')}
          >
            Popular
          </NavBadge>
          {this.renderNavItems()}
        </div>
      </nav>
    );
  }
}

export default connect(
  mapStateToProps('user', 'activity', 'notifications'),
  mapActionsToProps(uiActions, activityActions)
)(withRouter(Nav));
