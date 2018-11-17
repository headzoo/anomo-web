import React from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route } from 'react-router-dom';
import { userRefresh } from 'actions/userActions';
import { errorMessage, windowResize, uiSidebarDocked } from 'actions/uiActions';
import { activityIntervalStart } from 'actions/activityActions';
import { notificationsIntervalStart } from 'actions/notificationsActions';
import { connect, mapStateToProps } from 'utils/state';
import { browser } from 'utils';
import { NotificationsDrawer } from 'lib/drawers';
import { PrivateRoute, ScrollToTop, Nav, Sidebar, Mask, Loading } from 'lib';
import history from 'store/history';
import routes from 'store/routes';
import FeedPage from 'pages/FeedPage';
import ActivityPage from 'pages/ActivityPage';
import ProfilePage from 'pages/ProfilePage';
import EditProfilePage from 'pages/EditProfilePage';
import SettingsPage from 'pages/SettingsPage';
import SearchPage from 'pages/SearchPage';
import LoginPage from 'pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';
import AboutPage from 'pages/AboutPage';
import NotFoundPage from 'pages/NotFoundPage';

/**
 *
 */
class App extends React.PureComponent {
  static propTypes = {
    ui:       PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    if (window.innerWidth < 576) {
      props.dispatch(uiSidebarDocked(false));
    } else {
      props.dispatch(uiSidebarDocked(
        browser.storage.get(browser.storage.KEY_SIDEBAR_DOCKED, false)
      ));
    }
  }

  /**
   *
   */
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(userRefresh());
    dispatch(activityIntervalStart());
    dispatch(notificationsIntervalStart());
    dispatch(windowResize(window.innerWidth));
    this.resizeOff = browser.on('resize', this.handleResize);
  }

  /**
   *
   */
  componentWillUnmount() {
    this.resizeOff();
  }

  /**
   *
   */
  handleResize = () => {
    const { dispatch } = this.props;

    dispatch(windowResize(window.innerWidth));
  };

  /**
   * @param {Error} error
   * @param {React.ErrorInfo} info
   */
  componentDidCatch(error, info) {
    const { dispatch } = this.props;

    dispatch(errorMessage(error.toString(), info));
  }

  /**
   * @returns {*}
   */
  render() {
    const { ui } = this.props;
    const { visibleDrawers } = ui;

    if (ui.errorMessage) {
      return (
        <div>{ui.errorMessage}</div>
      );
    }
    if (ui.isLoading) {
      return (
        <Mask visible>
          <Loading middle />
        </Mask>
      );
    }

    return (
      <Router history={history}>
        <ScrollToTop>
          <Nav />
          {ui.sidebarDocked ? (
            <div className="sidebar-docker">
              <Sidebar />
            </div>
          ) : (
            <NotificationsDrawer open={visibleDrawers.notifications !== false} />
          )}
          <Switch>
            <PrivateRoute exact path={routes.path('home')} component={FeedPage} />
            <PrivateRoute exact path={routes.path('popular')} component={FeedPage} />
            <PrivateRoute exact path={routes.path('following')} component={FeedPage} />
            <PrivateRoute exact path={routes.path('activity')} component={ActivityPage} />
            <PrivateRoute exact path={routes.path('editProfile')} component={EditProfilePage} />
            <PrivateRoute exact path={routes.path('profile')} component={ProfilePage} />
            <PrivateRoute exact path={routes.path('settings')} component={SettingsPage} />
            <PrivateRoute exact path={routes.path('search')} component={SearchPage} />
            <Route exact path={routes.path('login')} component={LoginPage} />
            <Route exact path={routes.path('logout')} component={LogoutPage} />
            <Route exact path={routes.path('about')} component={AboutPage} />
            <Route exact path="*" component={NotFoundPage} />
          </Switch>
        </ScrollToTop>
      </Router>
    );
  }
}

export default connect(mapStateToProps('ui'))(App);
