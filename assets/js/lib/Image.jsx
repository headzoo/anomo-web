import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { withConfig } from 'lib';

/**
 *
 */
class Image extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object.isRequired,
    data:   PropTypes.shape({
      alt: PropTypes.string,
      src: PropTypes.string
    }).isRequired,
    circle:    PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    circle:    false,
    className: ''
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      src: props.data.src
    };
    this.isErrored = false;
  }

  /**
   *
   */
  handleError = () => {
    const { config } = this.props;

    if (!this.isErrored) {
      this.isErrored = true;
      this.setState({
        src: config.styles.placeholderImage
      });
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { data, circle, className, ...props } = this.props;
    const { src } = this.state;

    const classes = classNames(className, {
      'circle': circle
    });

    return (
      <img
        src={src}
        alt={data.alt}
        className={classes}
        {...objects.propsFilter(props, Image.propTypes)}
        onError={this.handleError}
      />
    );
  }
}

export default withConfig(Image);
