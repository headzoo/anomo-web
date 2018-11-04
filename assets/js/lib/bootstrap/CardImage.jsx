import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image } from 'lib';

/**
 *
 */
class CardImage extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      alt: PropTypes.string,
      src: PropTypes.string
    }).isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { data, className, ...props } = this.props;

    return (
      <Image
        data={data}
        className={classNames('card-img-top', className)}
        {...props}
      />
    );
  }
}

export default CardImage;
