import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class CardTitle extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { className, children, ...props } = this.props;

    return (
      <h5 className={classNames('card-title', className)} {...props}>
        {children}
      </h5>
    );
  }
}

export default CardTitle;
