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
    ui:                PropTypes.object.isRequired,
    user:              PropTypes.object.isRequired,
    forms:             PropTypes.object.isRequired,
    history:           PropTypes.object.isRequired,
    location:          PropTypes.object.isRequired,
    activity:          PropTypes.object.isRequired,
    notifications:     PropTypes.object.isRequired,
    activityFeedFetch: PropTypes.func.isRequired,
    uiVisibleDrawer:   PropTypes.func.isRequired
  };

  /**
   *
   */
  handleNotificationsClick = () => {
    const { uiVisibleDrawer } = this.props;

    uiVisibleDrawer('notifications', true);
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
        {!user.isAuthenticated && (
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
    const { ui, user, activity, location, notifications } = this.props;
    const { feeds } = activity;

    const isXs = ui.deviceSize === 'xs';
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
        {isXs ? (
          <span className="navbar-toggler-icon" onClick={this.handleNotificationsClick} />
        ) : (
          <Link name="home" className="navbar-brand">
            anomo
          </Link>
        )}
        <div className="nav-badges">
          <NavBadge
            number={notifications.newNumber}
            onClick={this.handleNotificationsClick}
          >
            {user.UserName}
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
          {!isXs && (
            <NavBadge
              number={feeds.popular.newNumber}
              active={activeFeed === 'popular'}
              onClick={e => this.handleFeedClick(e, 'popular')}
            >
              Popular
            </NavBadge>
          )}
          {!isXs && this.renderNavItems()}
        </div>
        {!isXs && this.renderSearch()}
      </nav>
    );
  }
}

export default connect(
  mapStateToProps('ui', 'user', 'forms', 'activity', 'notifications'),
  mapActionsToProps(uiActions, activityActions)
)(withRouter(Nav));
