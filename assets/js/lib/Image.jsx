import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects, browser } from 'utils';
import { getConfig } from 'store/config';

/**
 *
 */
class Image extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
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
      src: (getConfig().https) ? props.data.src.replace('http://', 'https://') : props.data.src
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
    const { onError } = this.props;

    if (!this.isErrored) {
      onError(e);
      if (!e.defaultPrevented) {
        this.isErrored = true;
        this.setState({
          src: getConfig().styles.placeholderImage
        });
      }
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
        ref={this.img}
        className={classes}
        {...objects.propsFilter(props, Image.propTypes)}
      />
    );
  }
}

export default Image;
