import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect, mapStateToProps } from 'utils';
import routes from 'store/routes';

/**
 *
 */
class PrivateRoute extends React.PureComponent {
  static propTypes = {
    user:      PropTypes.object.isRequired,
    component: PropTypes.any.isRequired // eslint-disable-line
  };

  /**
   * @returns {*}
   */
  render() {
    const { component: Component, user, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props => (
          user.isAuthenticated
            ? <Component {...props} />
            : <Redirect to={routes.route('login')} />
        )}
      />
    );
  }
}

export default connect(mapStateToProps('user'))(PrivateRoute);
