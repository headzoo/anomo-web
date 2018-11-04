import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image } from 'lib';

/**
 *
 */
class Avatar extends React.PureComponent {
  static propTypes = {
    src:       PropTypes.string.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { src, className, ...props } = this.props;

    const data = {
      src,
      alt: 'Avatar'
    };

    return (
      <Image className={classNames('avatar', className)} data={data} circle {...props} />
    );
  }
}

export default Avatar;
