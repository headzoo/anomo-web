import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import themes from 'lib/bootstrap/themes';

/**
 *
 */
class Progress extends React.PureComponent {
  static propTypes = {
    min:       PropTypes.number,
    max:       PropTypes.number,
    value:     PropTypes.number,
    theme:     PropTypes.string,
    striped:   PropTypes.bool,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    min:       0,
    max:       100,
    value:     0,
    theme:     themes[0],
    striped:   false,
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { min, max, value, theme, striped, className, children, ...rest } = this.props;

    const percent = Math.round((value / max) * 100);
    const props = {
      'role':          'progressbar',
      'aria-valuenow': value,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'style':         {
        'width': `${percent}%`
      },
      'className': classNames(
        `progress-bar bg-${theme}`,
        className,
        {
          'progress-bar-striped': striped
        }
      )
    };

    return (
      <div className="progress">
        <div {...props} {...rest} />
        {children && (
          <span className="progress-text justify-content-center d-flex position-absolute w-100">
            {children}
          </span>
        )}
      </div>
    );
  }
}

export default Progress;
