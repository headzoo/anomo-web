import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapStateToProps } from 'utils';

/**
 *
 */
class ActivityPage extends React.PureComponent {
  static propTypes = {};

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    return (
      <div></div>
    );
  }
}

export default connect(mapStateToProps())(ActivityPage);
