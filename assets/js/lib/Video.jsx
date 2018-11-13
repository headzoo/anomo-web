import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects } from 'utils';
import { Icon } from 'lib';

/**
 *
 */
class Video extends React.PureComponent {
  static propTypes = {
    source:    PropTypes.string.isRequired,
    poster:    PropTypes.string.isRequired,
    playing:   PropTypes.bool,
    muted:     PropTypes.bool,
    volume:    PropTypes.number,
    showIcon:  PropTypes.bool,
    className: PropTypes.string,
    onClick:   PropTypes.func
  };

  static defaultProps = {
    muted:     false,
    volume:    0.5,
    playing:   false,
    showIcon:  true,
    className: '',
    onClick:   () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false
    };
  }

  /**
   * Called after the component mounts
   */
  componentDidMount() {
    const { muted, volume, playing } = this.props;

    this.video.muted  = muted;
    this.video.volume = volume;
    if (playing) {
      this.video.play();
      this.setState({ isPlaying: true });
    }
  }

  /**
   * Called after the component updates
   *
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    const { muted, volume, playing } = this.props;

    if (prevProps.muted !== muted) {
      this.video.muted = muted;
    }
    if (prevProps.volume !== volume) {
      this.video.volume = volume;
    }
    if (prevProps.playing !== playing) {
      if (playing) {
        this.video.play();
        this.setState({ isPlaying: true });
      } else {
        this.video.pause();
        this.setState({ isPlaying: false });
      }
    }
  }

  /**
   * @param {Event} e
   */
  handleClick = (e) => {
    const { onClick } = this.props;
    const { isPlaying } = this.state;

    onClick(e);
    if (!e.defaultPrevented) {
      this.setState({ isPlaying: !isPlaying }, () => {
        if (this.state.isPlaying) {
          this.video.play();
        } else {
          this.video.pause();
        }
      });
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { source, poster, showIcon, className, ...props } = this.props;
    const { isPlaying } = this.state;

    return (
      <div className={classNames('video', className)} onClick={this.handleClick}>
        {(showIcon && !isPlaying) && (
          <Icon name="play" size={2} />
        )}
        <video
          poster={poster}
          controls={isPlaying}
          ref={ref => this.video = ref}
          {...objects.propsFilter(props, Video.propTypes)}
        >
          <source src={source} type="video/mp4" />
        </video>
      </div>
    );
  }
}

export default Video;
