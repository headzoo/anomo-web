import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'lib';

/**
 *
 */
class CollapseButton extends React.PureComponent {
  static propTypes = {
    collapsed: PropTypes.bool,
    onClick:   PropTypes.func
  };

  static defaultProps = {
    collapsed: false,
    onClick:   () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { collapsed, onClick, ...props } = this.props;

    return (
      <span title="Click to collapse." {...props} onClick={onClick}>
        <Icon name={collapsed ? 'caret-up' : 'caret-down'} />
      </span>
    );
  }
}

export default CollapseButton;
