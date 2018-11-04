import React from 'react';
import PropTypes from 'prop-types';
import { Link as ReactRouterLink } from 'react-router-dom';
import * as routes from 'store/routes';

/**
 *
 */
class Link extends React.PureComponent {
  static propTypes = {
    name:     PropTypes.string.isRequired,
    hash:     PropTypes.string,
    state:    PropTypes.object,
    params:   PropTypes.object,
    search:   PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    hash:     '',
    state:    {},
    params:   {},
    search:   '',
    children: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { name, params, hash, state, search, children, ...props } = this.props;

    const pathname = routes.route(name, params);

    return (
      <ReactRouterLink to={{ pathname, search, state, hash }} {...props}>
        {children}
      </ReactRouterLink>
    );
  }
}

export default Link;
