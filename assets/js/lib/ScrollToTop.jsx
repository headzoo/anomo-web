import React from 'react';
import { withRouter } from 'react-router-dom';
import { browser } from 'utils';

/**
 *
 */
class ScrollToTop extends React.PureComponent {
  /**
   * Called after the component updates
   *
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { location: prevLocation } = prevProps;

    // The hash value can change without causing the scroll.
    if (location.pathname !== prevLocation.pathname || location.search !== prevLocation.search) {
      browser.scrollTop();
    }
  }

  /**
   * @returns {*}
   */
  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
