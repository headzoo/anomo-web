import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects, browser } from 'utils';
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
    className: PropTypes.string,
    onLoad:    PropTypes.func,
    onError:   PropTypes.func
  };

  static defaultProps = {
    circle:    false,
    className: '',
    onLoad:    () => {},
    onError:   () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      src: props.data.src
    };
    this.img = React.createRef();
    this.isErrored = false;
  }

  /**
   *
   */
  componentDidMount = () => {
    this.loadOff  = browser.on(this.img.current, 'load', this.handleLoad);
    this.errorOff = browser.on(this.img.current, 'error', this.handleError);
  };

  /**
   *
   */
  componentWillUnmount = () => {
    this.loadOff();
    this.errorOff();
  };

  /**
   * @returns {number}
   */
  height = () => {
    return this.img.current.offsetHeight;
  };

  /**
   * @param {Event} e
   */
  handleLoad = (e) => {
    const { onLoad } = this.props;

    onLoad(e);
  };

  /**
   * @param {Event} e
   */
  handleError = (e) => {
    const { config, onError } = this.props;

    if (!this.isErrored) {
      onError(e);
      if (!e.defaultPrevented) {
        this.isErrored = true;
        this.setState({
          src: config.styles.placeholderImage
        });
      }
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { data, circle, config, className, ...props } = this.props;
    let { src } = this.state;

    const classes = classNames(className, {
      'circle': circle
    });

    if (config.https) {
      src = src.replace('http://', 'https://');
    }

    return (
      <img
        src={src}
        alt={data.alt}
        ref={this.img}
        className={classes}
        {...objects.propsFilter(props, Image.propTypes)}
      />
    );
  }
}

export default withConfig(Image);
