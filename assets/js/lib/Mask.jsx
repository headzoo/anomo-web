import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects, browser } from 'utils';

/**
 *
 */
class Mask extends React.PureComponent {
  static propTypes = {
    fade:      PropTypes.bool,
    delay:     PropTypes.number,
    visible:   PropTypes.bool,
    className: PropTypes.string,
    children:  PropTypes.node,
    onVisible: PropTypes.func,
    onHidden:  PropTypes.func
  };

  static defaultProps = {
    fade:      false,
    delay:     200,
    visible:   false,
    className: '',
    children:  '',
    onVisible: () => {},
    onHidden:  () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      opacity: props.visible ? 0.5 : 0
    };
  }

  /**
   * Called when the component mounts.
   */
  componentDidMount() {
    const { fade, visible, onVisible, onHidden } = this.props;

    if (!visible) {
      browser.showScrollbars();
      onHidden();
    } else if (visible && fade) {
      browser.hideScrollbars();
      this.doFade();
    } else if (visible) {
      browser.hideScrollbars();
      onVisible();
    }
  }

  /**
   * Called after the component updates.
   *
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { fade, visible, onVisible, onHidden } = this.props;

    if (prevProps.visible !== visible) {
      if (visible) {
        browser.hideScrollbars();
        if (fade) {
          this.doFade();
        } else {
          onVisible();
        }
      } else {
        browser.showScrollbars();
        onHidden();
      }
    }
  }

  /**
   *
   */
  componentWillUnmount = () => {
    browser.showScrollbars();
  };

  /**
   *
   */
  doFade = () => {
    let i = 0;
    const delay = Math.round(this.props.delay / 5);

    const transition = () => {
      i += 1;
      if (i > 5) {
        this.props.onVisible();
        return;
      }
      this.setState({ opacity: (this.state.opacity + 0.1) }, () => {
        clearInterval(this.interval);
        this.interval = setTimeout(transition, delay);
      });
    };

    this.setState({ opacity: 0 }, () => {
      this.interval = setTimeout(transition, delay);
    });
  };

  /**
   * @returns {*}
   */
  render() {
    const { fade, visible, className, children, ...props } = this.props;
    const { opacity } = this.state;

    if (!visible) {
      return null;
    }

    const styles = {};
    if (fade) {
      styles.opacity = opacity;
    }

    return (
      <div
        style={styles}
        className={classNames('mask', className)}
        {...objects.propsFilter(props, Mask.propTypes)}
      >
        {children}
      </div>
    );
  }
}

export default Mask;
