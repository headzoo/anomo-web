import React from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route } from 'react-router-dom';
import { userRefresh } from 'actions/userActions';
import { errorMessage, windowResize, uiSidebarDocked, uiContentWidth } from 'actions/uiActions';
import { connect } from 'utils/state';
import { browser } from 'utils';
import { NotificationsDrawer } from 'lib/drawers';
import { PrivateRoute, ScrollToTop, Nav, Sidebar, Mask, Loading } from 'lib';
import history from 'store/history';
import routes from 'store/routes';
import FeedPage from 'pages/FeedPage';
import HashtagPage from 'pages/HashtagPage';
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
    error:           PropTypes.string.isRequired,
    device:          PropTypes.object.isRequired,
    isLoading:       PropTypes.bool.isRequired,
    sidebarDocked:   PropTypes.bool.isRequired,
    visibleDrawers:  PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    dispatch:        PropTypes.func.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    const { dispatch } = props;
    const { innerWidth } = window;

    if (innerWidth < 576) {
      dispatch(uiContentWidth(innerWidth - 44));
      dispatch(uiSidebarDocked(false));
    } else {
      dispatch(uiSidebarDocked(
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
    dispatch(windowResize(window.innerWidth));
    this.resizeOff = browser.on('resize', this.handleResize);
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { device, dispatch } = this.props;

    if (device.size !== prevProps.device.size) {
      if (device.isMobile) {
        dispatch(uiContentWidth(window.innerWidth - 44));
      } else {
        const navbar = document.querySelector('#navbar');
        if (navbar) {
          dispatch(uiContentWidth(navbar.width || 551));
        }
      }
    }
  };

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
    const { isLoading, isAuthenticated, error, sidebarDocked, visibleDrawers } = this.props;

    if (error) {
      return (
        <div>{error}</div>
      );
    }
    if (isLoading) {
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
          {(sidebarDocked && isAuthenticated) ? (
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
            <PrivateRoute exact path={routes.path('hashtag')} component={HashtagPage} />
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

const mapStateToProps = state => (
  {
    error:           state.ui.errorMessage,
    device:          state.ui.device,
    isLoading:       state.ui.isLoading,
    sidebarDocked:   state.ui.sidebarDocked,
    visibleDrawers:  state.ui.visibleDrawers,
    isAuthenticated: state.user.isAuthenticated
  }
);

export default connect(mapStateToProps)(App);
