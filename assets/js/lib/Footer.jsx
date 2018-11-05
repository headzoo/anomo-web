import React from 'react';
import { connect, mapStateToProps } from 'utils';

/**
 *
 */
class Footer extends React.PureComponent {
  /**
   * @returns {*}
   */
  render() {
    return (
      <footer>
        &nbsp;
      </footer>
    );
  }
}

export default connect(mapStateToProps())(Footer);
