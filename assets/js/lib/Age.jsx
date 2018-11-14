import React from 'react';
import PropTypes from 'prop-types';
import { dates } from 'utils';

/**
 *
 */
class Age extends React.PureComponent {
  static propTypes = {
    date: PropTypes.string
  };

  static defaultProps = {
    date: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { date } = this.props;

    return dates.getAge(date || '1980-12-10');
  }
}

export default Age;
