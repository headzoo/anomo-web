import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 */
class Pluralize extends React.PureComponent {
  static propTypes = {
    number:   PropTypes.number.isRequired,
    singular: PropTypes.string.isRequired,
    plural:   PropTypes.string.isRequired
  };

  /**
   * @returns {*}
   */
  render() {
    const { number, singular, plural } = this.props;

    if (number === 1) {
      return singular;
    }
    return plural;
  }
}

export default Pluralize;
