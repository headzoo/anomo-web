import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class Table extends React.PureComponent {
  static propTypes = {
    striped:   PropTypes.bool,
    bordered:  PropTypes.bool,
    hover:     PropTypes.bool,
    sm:        PropTypes.bool,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    striped:   false,
    bordered:  false,
    hover:     false,
    sm:        false,
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { striped, bordered, hover, sm, className, children, ...props } = this.props;

    const classes = classNames('table', className, {
      'table-striped':  striped,
      'table-bordered': bordered,
      'table-hover':    hover,
      'table-sm':       sm
    });

    return (
      <div className="table-responsive">
        <table className={classes} {...props}>
          {children}
        </table>
      </div>
    );
  }
}

export default Table;
