import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'lib';

/**
 *
 */
class NotificationsIcon extends React.PureComponent {
  static propTypes = {
    number:  PropTypes.number,
    onClick: PropTypes.func
  };

  static defaultProps = {
    number:  0,
    onClick: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { number, onClick } = this.props;

    return (
      <div className="icon-notifications" onClick={onClick}>
        <Icon name="bell" />
        <div className={classNames({ active: number })}>
          {number}
        </div>
      </div>
    );
  }
}

export default NotificationsIcon;
