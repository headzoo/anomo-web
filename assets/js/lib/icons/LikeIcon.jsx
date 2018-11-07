import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'lib';

/**
 *
 */
class LikeIcon extends React.PureComponent {
  static propTypes = {
    liked:     PropTypes.bool,
    loading:   PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    liked:     false,
    loading:   false,
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { liked, loading, className, ...props } = this.props;

    const classes = classNames('icon-like', {
      'icon-like-liked':   liked,
      'icon-like-loading': loading
    }, className);

    return (
      <Icon name="heart" className={classes} {...props} regular={liked} />
    );
  }
}

export default LikeIcon;
