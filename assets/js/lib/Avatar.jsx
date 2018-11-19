import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image, Icon } from 'lib';

/**
 *
 */
class Avatar extends React.PureComponent {
  static propTypes = {
    src:       PropTypes.string,
    sm:        PropTypes.bool,
    md:        PropTypes.bool,
    lg:        PropTypes.bool,
    following: PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    src:       '/images/anonymous-avatar-sm.jpg',
    sm:        true,
    md:        false,
    lg:        false,
    following: false,
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { src, sm, md, lg, following, className, ...props } = this.props;

    const data = {
      src: src || '/images/anonymous-avatar-sm.jpg',
      alt: 'Avatar'
    };
    const classes = classNames('avatar-container', {
      'sm': sm && !md && !lg,
      'md': md,
      'lg': lg
    });

    return (
      <span className={classes}>
        <Image className={classNames('avatar', className)} data={data} circle {...props} />
        {following && (
          <Icon className="icon-following" name="star" />
        )}
      </span>
    );
  }
}

export default Avatar;
