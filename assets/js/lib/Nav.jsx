import React from 'react';
import PropTypes from 'prop-types';
import { browser, connect, mapActionsToProps } from 'utils';
import { Button } from 'lib/bootstrap';
import { Form, Input } from 'lib/forms';
import { MenuIcon } from 'lib/icons';
import { Icon, withRouter } from 'lib';
import routes from 'store/routes';
import * as uiActions from 'actions/uiActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class Nav extends React.PureComponent {
  static propTypes = {
    deviceSize:        PropTypes.string.isRequired,
    isAuthenticated:   PropTypes.bool.isRequired,
    activeFeed:        PropTypes.string.isRequired,
    sidebarDocked:     PropTypes.bool.isRequired,
    visibleDrawers:    PropTypes.object.isRequired,
    location:          PropTypes.object.isRequired,
    history:           PropTypes.object.isRequired,
    notifications:     PropTypes.object.isRequired,
    activityFeedFetch: PropTypes.func.isRequired,
    uiVisibleModal:    PropTypes.func.isRequired,
    uiVisibleDrawer:   PropTypes.func.isRequired
  };

  /**
   *
   */
  handleMenuClick = () => {
    const { deviceSize, sidebarDocked, visibleDrawers, uiVisibleDrawer } = this.props;

    if (deviceSize === 'xs' || !sidebarDocked) {
      uiVisibleDrawer('notifications', !visibleDrawers.notifications);
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
   *
   */
  handleBrandClick = () => {
    const { activeFeed, history, location } = this.props;

    const feedRoutes = [
      routes.route('recent'),
      routes.route('popular'),
      routes.route('following')
    ];

    if (feedRoutes.indexOf(location.pathname) === -1) {
      history.push(routes.route(activeFeed));
    } else {
      browser.scroll();
    }
  };

  /**
   *
   */
  handleWriteClick = () => {
    const { uiVisibleModal } = this.props;

    uiVisibleModal('post', true);
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
    const { isAuthenticated, notifications } = this.props;

    if (notifications.newNumber > 99) {
      notifications.newNumber = '99+';
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <MenuIcon onClick={this.handleMenuClick} />

        <ul className="nav navbar-nav mx-auto">
          <li className="nav-item" style={{ margin: '-15px 0' }}>
            <div className="navbar-brand clickable" onClick={this.handleBrandClick}>
              s
            </div>
          </li>
        </ul>
        <ul className="navbar-nav">
          {isAuthenticated && (
            <li className="nav-item">
              <Icon
                name="edit"
                title="Add to conversation"
                className="icon-write clickable"
                onClick={this.handleWriteClick}
              />
            </li>
          )}
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = state => (
  {
    deviceSize:      state.ui.deviceSize,
    activeFeed:      state.ui.activeFeed,
    sidebarDocked:   state.ui.sidebarDocked,
    visibleDrawers:  state.ui.visibleDrawers,
    notifications:   state.notifications,
    isAuthenticated: state.user.isAuthenticated
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions, activityActions)
)(withRouter(Nav));
