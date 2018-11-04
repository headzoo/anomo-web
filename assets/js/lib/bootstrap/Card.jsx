import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';

/**
 *
 */
class Card extends React.PureComponent {
  static propTypes = {
    name:       PropTypes.string,
    fullWidth:  PropTypes.bool,
    className:  PropTypes.string,
    children:   PropTypes.node,
    onWaypoint: PropTypes.func
  };

  static defaultProps = {
    name:       '',
    fullWidth:  false,
    className:  '',
    children:   '',
    onWaypoint: null
  };

  /**
   * @returns {*}
   */
  render() {
    const { name, fullWidth, className, children, onWaypoint, ...props } = this.props;

    const classes = classNames({
      'card':       true,
      'full-width': fullWidth
    }, className);

    return (
      <div className={classes} {...props}>
        {onWaypoint && (
          <Waypoint onEnter={e => onWaypoint(e, name)} />
        )}
        {children}
      </div>
    );
  }
}

export default Card;
