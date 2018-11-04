import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class ButtonGroup extends React.PureComponent {
  static propTypes = {
    lg:        PropTypes.bool,
    sm:        PropTypes.bool,
    spaced:    PropTypes.bool,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    lg:        false,
    sm:        false,
    spaced:    false,
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { lg, sm, spaced, className, children, ...props } = this.props;

    const classes = classNames('btn-group', className, {
      'btn-group-sm':     sm,
      'btn-group-lg':     lg,
      'btn-group-spaced': spaced
    });

    return (
      <div className={classes} role="group" {...props}>
        {children}
      </div>
    );
  }
}

export default ButtonGroup;
