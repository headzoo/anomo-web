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
     * @param {*} props
     */
    constructor(props) {
      super(props);
      this.wrappedRef = React.createRef();
    }

    /**
     * @returns {*}
     */
    getWrappedInstance = () => {
      return this.wrappedRef.current;
    };

    /**
     * @returns {*}
     */
    render() {
      return <WrappedComponent ref={this.wrappedRef} config={getConfig()} {...this.props} />;
    }
  };
}

export default withConfig;
