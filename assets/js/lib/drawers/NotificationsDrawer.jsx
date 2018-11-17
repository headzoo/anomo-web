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
    deviceSize:      PropTypes.string.isRequired,
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
    const { deviceSize, open, ...props } = this.props;

    return (
      <Drawer
        open={open}
        level={null}
        handler={false}
        onMaskClick={this.close}
        className="drawer-notifications"
        width={deviceSize === 'xs' ? '75vw' : '15vw'}
        {...props}
      >
        <Sidebar />
      </Drawer>
    );
  }
}

const mapStateToProps = state => (
  {
    deviceSize: state.ui.deviceSize
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(uiActions)
)(NotificationsDrawer);
