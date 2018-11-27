import React from 'react';
import PropTypes from 'prop-types';
import Image from './Image';
import Icon from './Icon';
import Loading from './Loading';

/**
 *
 */
class GifPlayer extends React.PureComponent {
  static propTypes = {
    src:    PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      src:     props.src,
      loaded:  false,
      playing: false
    };
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    if (prevProps.src !== this.props.src) {
      this.setState({ src: this.props.src });
    }
  };

  /**
   * @param {Event} e
   * @param {boolean} playing
   */
  handlePlayClick = (e, playing) => {
    this.setState({ playing });
  };

  /**
   *
   */
  handleImageLoad = () => {
    this.setState({ loaded: true });
  };

  /**
   * @returns {*}
   */
  renderPoster = () => {
    const { poster } = this.props;

    const styles = {
      backgroundImage: `url(${poster})`
    };

    return (
      <div
        style={styles}
        className="activity-gif-player-poster"
        onClick={e => this.handlePlayClick(e, true)}
      >
        <div className="activity-gif-player-poster-mask">
          <Icon title="Play" name="play-circle" />
        </div>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderGif = () => {
    const { src, loaded } = this.state;

    return (
      <div className="activity-gif-player-gif">
        <Image
          data={{ src, alt: 'Gif' }}
          onLoad={this.handleImageLoad}
          onClick={e => this.handlePlayClick(e, false)}
        />
        {!loaded && (
          <div className="activity-gif-player-gif-mask">
            <Loading />
          </div>
        )}
      </div>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { playing } = this.state;

    if (!playing) {
      return this.renderPoster();
    }

    return this.renderGif();
  }
}

export default GifPlayer;
