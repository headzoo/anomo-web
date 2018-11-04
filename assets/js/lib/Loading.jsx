import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withConfig } from 'lib';

/**
 *
 */
class Loading extends React.PureComponent {
  static propTypes = {
    size:        PropTypes.number,
    color:       PropTypes.string,
    middle:      PropTypes.bool,
    strokeWidth: PropTypes.number
  };

  static defaultProps = {
    size:        57,
    color:       '',
    middle:      false,
    strokeWidth: 10
  };

  /**
   * @returns {*}
   */
  render() {
    const { config, size, color, middle, strokeWidth, ...props } = this.props;

    return (
      <div className={classNames('loader', { 'middle': middle })} {...props}>
        <svg
          width={size}
          height={size}
          style={{ background: 'none' }}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid"
        >
          <circle
            r="35"
            cx="50"
            cy="50"
            fill="none"
            stroke={color || config.styles.primaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray="164.93361431346415 56.97787143782138"
            transform="rotate(132 50 50)"
          >
            <animateTransform
              dur="1s"
              begin="0s"
              type="rotate"
              calcMode="linear"
              keyTimes="0;1"
              attributeName="transform"
              repeatCount="indefinite"
              values="0 50 50;360 50 50"
            />
          </circle>
        </svg>
      </div>
    );
  }
}

export default withConfig(Loading);
