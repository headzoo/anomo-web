import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapStateToProps } from 'utils/state';
import { Link } from 'lib';

/**
 *
 */
class Nav extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { user } = this.props;

    const navItems = [];

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link name="home" className="navbar-brand">
          Anomo
        </Link>
        <button
          type="button"
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbar-nav"
          aria-controls="navbar-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbar-nav">
          <ul className="navbar-nav">
            {navItems.map(item => (
              <li key={item.name} className="nav-item">
                <Link name={item.name} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
            {user.isAuthenticated ? (
              <li className="nav-item">
                <Link name="logout" className="nav-link">
                  Logout
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link name="login" className="nav-link">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps('user'))(Nav);
