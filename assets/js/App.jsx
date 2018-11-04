import React from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route } from 'react-router-dom';
import { userRefresh } from 'actions/userActions';
import { errorMessage, windowResize } from 'actions/uiActions';
import { connect, mapStateToProps } from 'utils/state';
import { browser } from 'utils';
import history from 'store/history';
import routes from 'store/routes';
import HomePage from 'pages/HomePage';
import ActivityPage from 'pages/ActivityPage';
import LoginPage from 'pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';

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

    return (
      <Router history={history}>
        <Switch>
          <Route exact path={routes.path('home')} component={HomePage} />
          <Route exact path={routes.path('activity')} component={ActivityPage} />
          <Route exact path={routes.path('login')} component={LoginPage} />
          <Route exact path={routes.path('logout')} component={LogoutPage} />
        </Switch>
      </Router>
    );
  }
}

export default connect(mapStateToProps('ui'))(App);
