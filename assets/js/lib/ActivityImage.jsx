import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AnimateHeight from 'react-animate-height';
import { objects, connect, mapStateToProps } from 'utils';
import { Button } from 'lib/bootstrap';
import { Image } from 'lib';

/**
 *
 */
class ActivityImage extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      alt: PropTypes.string,
      src: PropTypes.string
    }).isRequired,
    maxHeight: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    maxHeight: 800,
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
    this.img = React.createRef();
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

    if (this.img.current.getWrappedInstance().height() > maxHeight) {
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
   * @returns {*}
   */
  render() {
    const { data, maxHeight, className, ...props } = this.props;
    const { showButton, expanded } = this.state;

    const animateHeight = showButton ? maxHeight : 'auto';
    const classes = classNames('activity-image', className);
    const styles  = {};
    if (!expanded) {
      styles.maxHeight = maxHeight;
    }

    return (
      <AnimateHeight
        style={styles}
        ref={this.wrapper}
        className={classes}
        height={expanded ? 'auto' : animateHeight}
        {...objects.propsFilter(props, ActivityImage.propTypes, 'dispatch')}
      >
        <Image ref={this.img} data={data} onLoad={this.handleUpdate} />
        {(showButton && !expanded) && (
          <div className="activity-image-btn">
            <Button type="button" onClick={this.handleButtonClick}>
              Show More
            </Button>
          </div>
        )}
      </AnimateHeight>
    );
  }
}

export default connect(mapStateToProps())(ActivityImage);
