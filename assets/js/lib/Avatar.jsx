import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image } from 'lib';

/**
 *
 */
class Avatar extends React.PureComponent {
  static propTypes = {
    src:       PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    src:       '/images/anonymous-avatar-sm.jpg',
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { src, className, ...props } = this.props;

    const data = {
      src: src || '/images/anonymous-avatar-sm.jpg',
      alt: 'Avatar'
    };

    return (
      <Image className={classNames('avatar', className)} data={data} circle {...props} />
    );
  }
}

export default Avatar;
