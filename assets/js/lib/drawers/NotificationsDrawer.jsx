import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'rc-drawer';
import { connect, mapActionsToProps } from 'utils';
import { Sidebar } from 'lib';
import * as uiActions from 'actions/uiActions';

/**
 *
 */
class NotificationsDrawer extends React.PureComponent {
  static propTypes = {
    open:            PropTypes.bool,
    isMobile:        PropTypes.bool.isRequired,
    uiVisibleDrawer: PropTypes.func.isRequired
  };

  static defaultProps = {
    open: false
  };

  /**
   *
   */
  close = () => {
    const { uiVisibleDrawer } = this.props;

    uiVisibleDrawer('notifications', false);
  };

  /**
   * @returns {*}
   */
  render() {
    const { isMobile, open, ...props } = this.props;

    return (
      <Drawer
        open={open}
        level={null}
        handler={false}
        onMaskClick={this.close}
        className="drawer-notifications"
        width={isMobile ? '75vw' : '20vw'}
        {...props}
      >
        <Sidebar />
      </Drawer>
    );
  }
}

const mapStateToProps = state => (
  {
    isMobile: state.ui.device.isMobile
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions)
)(NotificationsDrawer);
