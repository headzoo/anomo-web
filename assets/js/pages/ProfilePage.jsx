import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapStateToProps } from 'utils';
import { Row, Column } from 'lib/bootstrap';
import { Page, withRouter } from 'lib';

/**
 *
 */
class ProfilePage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { match } = this.props;

    return (
      <Page title={match.params.userName}>
        {match.params.userName}
      </Page>
    );
  }
}

export default connect(mapStateToProps())(withRouter(ProfilePage));
