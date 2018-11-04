import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapStateToProps } from 'utils/state';
import { userLogout } from 'actions/userActions';
import { withRouter } from 'lib';
import * as routes from 'store/routes';

/**
 *
 */
class LogoutPage extends React.PureComponent {
  static propTypes = {
    history:  PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);

    const { history, dispatch } = props;

    dispatch(userLogout());
    history.push(routes.route('login'));
  }

  /**
   * @returns {*}
   */
  render() {
    return null;
  }
}

export default connect(mapStateToProps())(
  withRouter(LogoutPage)
);
