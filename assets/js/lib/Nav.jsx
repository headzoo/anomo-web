import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapStateToProps, mapActionsToProps } from 'utils/state';
import { Badge, Button } from 'lib/bootstrap';
import { Form, Input } from 'lib/forms';
import { NavBadge, Link, Icon, withRouter } from 'lib';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class Nav extends React.PureComponent {
  static propTypes = {
    user:              PropTypes.object.isRequired,
    forms:             PropTypes.object.isRequired,
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
   * @param {Event} e
   * @param {*} values
   */
  handleSearchSubmit = (e, values) => {
    const { history } = this.props;

    e.preventDefault();
    if (values.term) {
      history.push(routes.route('search', values));
    }
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
          <li className="nav-item dropdown">
            <Badge
              aria-haspopup="true"
              aria-expanded="false"
              data-toggle="dropdown"
              id="navbarDropdownMenuLink"
              className="nav-badge nav-badge-dropdown dropdown-toggle"
            >
              {user.UserName}
            </Badge>
            <div
              aria-labelledby="navbarDropdownMenuLink"
              className="dropdown-menu nav-badge-dropdown-menu dropdown-menu-right"
            >
              <Link name="logout" className="dropdown-item">
                Logout
              </Link>
            </div>
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
  renderSearch = () => {
    const { forms } = this.props;
    const { search } = forms;

    return (
      <Form
        name="search"
        onSubmit={this.handleSearchSubmit}
        disabled={search.isSubmitting}
        className="form-nav-search form-inline my-2 my-lg-0"
      >
        <Input
          type="search"
          name="term"
          aria-label="Search"
          id="form-nav-search-term"
          placeholder="Search People"
          className="mr-sm-2"
        />
        <Button className="my-2 my-sm-0">
          <Icon name="search" />
        </Button>
      </Form>
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
          <NavBadge
            number={notifications.newNumber}
            onClick={this.handleNotificationsClick}
          >
            Notifications
          </NavBadge>
          {this.renderNavItems()}
        </div>
        {this.renderSearch()}
      </nav>
    );
  }
}

export default connect(
  mapStateToProps('user', 'forms', 'activity', 'notifications'),
  mapActionsToProps(uiActions, activityActions)
)(withRouter(Nav));
