import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import objects from 'utils/objects';

/**
 *
 */
class Container extends React.PureComponent {
  static propTypes = {
    fluid:     PropTypes.bool,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    fluid:     false,
    className: '',
    children:  ''
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  /**
   * @returns {*}
   */
  render() {
    const { fluid, className, children, ...props } = this.props;

    const classes = classNames({
      'container':       !fluid,
      'container-fluid': fluid
    }, className);

    return (
      <div
        className={classes}
        ref={this.container}
        {...objects.propsFilter(props, Container.propTypes)}
      >
        {children}
      </div>
    );
  }
}

export default Container;
