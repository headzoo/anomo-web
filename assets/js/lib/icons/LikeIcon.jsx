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
    className: PropTypes.string
  };

  static defaultProps = {
    liked:     false,
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { liked, className, ...props } = this.props;

    const classes = classNames('icon-like', {
      'icon-like-liked': liked
    }, className);

    return (
      <Icon name="heart" className={classes} {...props} regular={liked} />
    );
  }
}

export default LikeIcon;
