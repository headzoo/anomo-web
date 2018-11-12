import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, mapStateToProps, mapActionsToProps } from 'utils/state';
import { Button } from 'lib/bootstrap';
import { Form, Input } from 'lib/forms';
import { Link, Icon, withRouter } from 'lib';
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
    const { user, notifications } = this.props;

    if (notifications.newNumber > 99) {
      notifications.newNumber = '99+';
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <span className="navbar-toggler-icon" onClick={this.handleNotificationsClick} />
        <ul className="navbar-nav">
          {user.isAuthenticated && (
            <li className="nav-item nav-item-notifications" onClick={this.handleNotificationsClick}>
              <Icon name="bell" />
              <div className={classNames({ active: notifications.newNumber })}>
                {notifications.newNumber}
              </div>
            </li>
          )}
        </ul>
        <ul className="nav navbar-nav mx-auto">
          <li className="nav-item">
            <Link name="home" className="navbar-brand">
              scnstr.com
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default connect(
  mapStateToProps('ui', 'user', 'forms', 'activity', 'notifications'),
  mapActionsToProps(uiActions, activityActions)
)(withRouter(Nav));
