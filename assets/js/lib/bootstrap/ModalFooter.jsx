import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';

/**
 *
 */
class ModalFooter extends React.PureComponent {
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
      <div
        className={classNames('modal-footer', className)}
        {...objects.propsFilter(props, ModalFooter.propTypes)}
      >
        {children}
      </div>
    );
  }
}

export default ModalFooter;
