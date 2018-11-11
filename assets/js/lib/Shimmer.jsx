import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class Shimmer extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { className, ...props } = this.props;

    const classes = classNames('shimmer', className);

    return (
      <div className={classes} {...props} />
    );
  }
}

export default Shimmer;
