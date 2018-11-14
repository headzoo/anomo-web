import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 */
class Neighborhood extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string
  };

  static defaultProps = {
    name: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { name } = this.props;

    return name || 'Earth';
  }
}

export default Neighborhood;
