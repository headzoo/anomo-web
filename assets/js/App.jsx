import React from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route } from 'react-router-dom';
import { userRefresh } from 'actions/userActions';
import { errorMessage, windowResize } from 'actions/uiActions';
import { connect, mapStateToProps } from 'utils/state';
import { browser } from 'utils';
import { PrivateRoute, ScrollToTop, Mask, Loading } from 'lib';
import history from 'store/history';
import routes from 'store/routes';
import FeedPage from 'pages/FeedPage';
import ActivityPage from 'pages/ActivityPage';
import ProfilePage from 'pages/ProfilePage';
import LoginPage from 'pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';
import AboutPage from 'pages/AboutPage';

/**
 *
 */
class App extends React.PureComponent {
  static propTypes = {
    ui:       PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

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
          <Switch>
            <PrivateRoute exact path={routes.path('home')} component={FeedPage} />
            <PrivateRoute exact path={routes.path('activity')} component={ActivityPage} />
            <PrivateRoute exact path={routes.path('profile')} component={ProfilePage} />
            <Route exact path={routes.path('login')} component={LoginPage} />
            <Route exact path={routes.path('logout')} component={LogoutPage} />
            <Route exact path={routes.path('about')} component={AboutPage} />
          </Switch>
        </ScrollToTop>
      </Router>
    );
  }
}

export default connect(mapStateToProps('ui'))(App);
