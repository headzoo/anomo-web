import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AnimateHeight from 'react-animate-height';
import { objects, connect } from 'utils';
import { Button } from 'lib/bootstrap';
import { Image, Icon } from 'lib';

/**
 *
 */
class ActivityImage extends React.PureComponent {
  static propTypes = {
    activity:     PropTypes.object.isRequired,
    maxHeight:    PropTypes.number,
    className:    PropTypes.string,
    contentWidth: PropTypes.number.isRequired
  };

  static defaultProps = {
    maxHeight: 1000,
    className: ''
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      expanded:   false,
      showButton: false
    };
    this.img     = React.createRef();
    this.wrapper = React.createRef();
  }

  /**
   * Called after the component mounts
   */
  componentDidMount = () => {
    this.handleUpdate();
  };

  /**
   *
   */
  handleUpdate = () => {
    const { maxHeight } = this.props;

    if (this.img.current.height() > maxHeight) {
      this.setState({ showButton: true });
    }
  };

  /**
   * @param {Event} e
   */
  handleButtonClick = (e) => {
    e.stopPropagation();
    this.setState({ expanded: !this.state.expanded });
  };

  /**
   * @param {Event} e
   * @param {string} tool
   */
  handleToolClick = (e, tool) => {
    const { activity } = this.props;

    e.stopPropagation();
    switch (tool) {
      case 'google':
        window.open(`http://images.google.com/searchbyimage?image_url=${encodeURIComponent(activity.Image)}`);
        break;
      case 'open':
        window.open(activity.Image);
        break;
    }
  };

  /**
   * @returns {*}
   */
  getImageStyles = () => {
    const { activity, contentWidth } = this.props;

    if (!activity.ImageWidth || !activity.ImageHeight) {
      return {};
    }

    const ratio  = activity.ImageWidth / contentWidth;
    const height = Math.round(activity.ImageHeight / ratio);

    return {
      height
    };
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, maxHeight, className, ...props } = this.props;
    const { showButton, expanded } = this.state;

    const animateHeight   = showButton ? maxHeight : 'auto';
    const classes         = classNames('activity-image', className);
    const stylesImage     = this.getImageStyles();
    const stylesContainer = {};
    if (!expanded) {
      stylesContainer.maxHeight = maxHeight;
    }

    return (
      <AnimateHeight
        ref={this.wrapper}
        className={classes}
        style={stylesContainer}
        height={expanded ? 'auto' : animateHeight}
        {...objects.propsFilter(props, ActivityImage.propTypes, 'dispatch')}
      >
        <Image
          ref={this.img}
          style={stylesImage}
          data={{ src: activity.Image, alt: '' }}
          onLoad={this.handleUpdate}
        />
        {(showButton && !expanded) && (
          <div className="activity-image-btn">
            <Button type="button" onClick={this.handleButtonClick}>
              Show More
            </Button>
          </div>
        )}
        <div className="activity-image-tools">
          <Button
            theme="none"
            type="button"
            title="Google image search"
            onClick={e => this.handleToolClick(e, 'google')}
          >
            <Icon name="google" fab />
          </Button>
          <Button
            theme="none"
            type="button"
            title="Open in new window"
            onClick={e => this.handleToolClick(e, 'open')}
          >
            <Icon name="external-link-square-alt" />
          </Button>
        </div>
      </AnimateHeight>
    );
  }
}

const mapStateToProps = state => (
  {
    contentWidth: state.ui.contentWidth
  }
);

export default connect(mapStateToProps)(ActivityImage);
