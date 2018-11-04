import React from 'react';
import { reactDisplayName } from 'utils/react';
import { getConfig } from 'store/config';

/**
 * @param {React.Component} WrappedComponent
 * @returns {*}
 */
function withConfig(WrappedComponent) {
  return class extends React.Component {
    static displayName = `withConfig(${reactDisplayName(WrappedComponent)})`;

    /**
     * @returns {*}
     */
    render() {
      return <WrappedComponent config={getConfig()} {...this.props} />;
    }
  };
}

export default withConfig;
