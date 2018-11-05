import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Loading } from 'lib';

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

    if (loading) {
      return (
        <div className="icon-like-loading">
          <Loading size={18} />
        </div>
      );
    }

    const classes = classNames('icon-like', {
      'icon-like-liked': liked
    }, className);

    return (
      <Icon name="heart" className={classes} {...props} regular={liked} />
    );
  }
}

export default LikeIcon;
