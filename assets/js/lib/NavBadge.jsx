import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'lib/bootstrap';

/**
 *
 */
class NavBadge extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    number:   PropTypes.number,
    active:   PropTypes.bool,
    onClick:  PropTypes.func
  };

  static defaultProps = {
    active:  false,
    number:  0,
    onClick: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { children, number, active, onClick, ...props } = this.props;

    return (
      <Badge
        onClick={onClick}
        theme={active ? 'info' : 'dark'}
        className="nav-badge nav-badge-with-number clickable"
        {...props}
      >
        <span>{children}</span>
        <Badge className="nav-notifications-badge">
          {number}
        </Badge>
      </Badge>
    );
  }
}

export default NavBadge;
