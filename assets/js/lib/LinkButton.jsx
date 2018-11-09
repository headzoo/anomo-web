import React from 'react';
import PropTypes from 'prop-types';
import { objects } from 'utils';
import { Button } from 'lib/bootstrap';
import { withRouter } from 'lib';
import routes from 'store/routes';

/**
 *
 */
class LinkButton extends React.PureComponent {
  static propTypes = {
    name:     PropTypes.string.isRequired,
    params:   PropTypes.object,
    children: PropTypes.node,
    onClick:  PropTypes.func,
    history:  PropTypes.object.isRequired
  };

  static defaultProps = {
    params:   {},
    children: '',
    onClick:  () => {}
  };

  /**
   * @param {Event} e
   */
  handleClick = (e) => {
    const { name, params, history, onClick } = this.props;

    onClick(e);
    if (!e.defaultPrevented) {
      e.preventDefault();
      history.push(routes.route(name, params));
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { children, ...props } = this.props;

    const ignoreProps = ['location', 'match', 'routerParams', 'routerQuery', 'staticContext'];

    return (
      <Button
        onClick={this.handleClick}
        {...objects.propsFilter(props, LinkButton.propTypes, ignoreProps)}
      >
        {children}
      </Button>
    );
  }
}

export default withRouter(LinkButton);
