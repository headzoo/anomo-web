import React from 'react';
import { withRouter as ReactWithRouter } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import queryString from 'query-string';
import { strings, react } from 'utils';

/**
 * @param {React.Component} WrappedComponent
 * @returns {*}
 */
function withRouter(WrappedComponent) {
  return ReactWithRouter(class extends React.Component {
    static displayName = `withRouter(${react.displayName(WrappedComponent)})`;

    /**
     * @param {*} props
     */
    constructor(props) {
      super(props);
      this.wrappedRef = React.createRef();

      const routerParams = {};
      Object.keys(props.match.params).forEach((key) => {
        routerParams[key] = strings.decodeURI(props.match.params[key]);
      });

      const routerQuery = queryString.parse(props.location.search);

      this.state = {
        routerParams,
        routerQuery
      };
    }

    /**
     * Called after the component updates
     */
    componentDidUpdate() {
      const { match, location } = this.props;

      const routerParams = {};
      Object.keys(match.params).forEach((key) => {
        routerParams[key] = strings.decodeURI(match.params[key]);
      });

      const routerQuery = queryString.parse(location.search);

      /* eslint-disable react/no-did-update-set-state, react/destructuring-assignment */
      if (!isEqual(routerParams, this.state.routerParams) || !isEqual(routerQuery, this.state.routerQuery)) {
        this.setState({ routerParams, routerQuery });
      }
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
      const { routerParams, routerQuery } = this.state;

      return (
        <WrappedComponent
          ref={this.wrappedRef}
          routerParams={routerParams}
          routerQuery={routerQuery}
          {...this.props}
        />
      );
    }
  });
}

export default withRouter;
