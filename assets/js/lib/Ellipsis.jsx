import React from 'react';
import PropTypes from 'prop-types';
import { strings } from 'utils';

/**
 *
 */
class Ellipsis extends React.PureComponent {
  static propTypes = {
    char:     PropTypes.string,
    count:    PropTypes.number,
    speed:    PropTypes.number,
    animated: PropTypes.bool
  };

  static defaultProps = {
    char:     '.',
    count:    3,
    speed:    250,
    animated: false
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      count: props.animated ? 1 : props.count
    };
    this.interval = 0;
  }

  /**
   *
   */
  componentDidMount = () => {
    const { animated, speed } = this.props;

    if (animated) {
      this.interval = setInterval(() => {
        let { count } = this.state;
        count += 1;
        if (count > this.props.count) {
          count = 1;
        }
        this.setState({ count });
      }, speed);
    }
  };

  /**
   *
   */
  componentWillUnmount = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { char, ...props } = this.props;
    const { count } = this.state;

    delete props.count;
    delete props.animated;

    return (
      <span {...props}>
        {strings.repeat(char, count)}
      </span>
    );
  }
}

export default Ellipsis;
