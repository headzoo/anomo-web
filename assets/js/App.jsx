import React from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route } from 'react-router-dom';
import { userRefresh } from 'actions/userActions';
import { errorMessage, windowResize, uiSidebarDocked, uiContentWidth } from 'actions/uiActions';
import { connect } from 'utils/state';
import { browser } from 'utils';
import { NotificationsDrawer } from 'lib/drawers';
import { ActivityModal, UserModal, PostModal, CommentModal } from 'lib/modals';
import { ScrollToTop, Layout, Nav, Sidebar, Mask, Loading } from 'lib';
import history from 'store/history';

/**
 *
 */
class App extends React.PureComponent {
  static propTypes = {
    error:           PropTypes.string.isRequired,
    device:          PropTypes.object.isRequired,
    isLoading:       PropTypes.bool.isRequired,
    sidebarDocked:   PropTypes.bool.isRequired,
    visibleModals:   PropTypes.object.isRequired,
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
    const { isLoading, isAuthenticated, error, sidebarDocked, visibleModals, visibleDrawers } = this.props;

    if (error) {
      return (
        <div>{error}</div>
      );
    }
    if (isLoading) {
      return (
        <Mask visible>
          <Loading label="Loading app" middle />
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
            <Route path="/" component={Layout} />
          </Switch>
          <ActivityModal open={visibleModals.activity !== false} />
          <CommentModal open={visibleModals.comment !== false} />
          <UserModal open={visibleModals.user !== false} />
          <PostModal open={visibleModals.post !== false} />
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
    visibleModals:   state.ui.visibleModals,
    visibleDrawers:  state.ui.visibleDrawers,
    isAuthenticated: state.user.isAuthenticated
  }
);

export default connect(mapStateToProps)(App);
