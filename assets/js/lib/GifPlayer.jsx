import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Image from './Image';
import Icon from './Icon';
import Loading from './Loading';

/**
 *
 */
class GifPlayer extends React.PureComponent {
  static propTypes = {
    src:          PropTypes.string.isRequired,
    poster:       PropTypes.string.isRequired,
    contentWidth: PropTypes.number.isRequired
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      src:     props.src,
      styles:  { height: 250 },
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
   * @param {number} width
   * @param {number} height
   * @returns {*}
   */
  getImageStyles = (width, height) => {
    const { contentWidth } = this.props;

    if (!width || !height) {
      return {};
    }

    const ratio  = width / contentWidth;

    return {
      height: Math.round(height / ratio)
    };
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
  handleGifLoad = () => {
    this.setState({ loaded: true });
  };

  /**
   * @param {Event} e
   */
  handlePosterLoad = (e) => {
    const styles = this.getImageStyles(e.target.width, e.target.height);
    this.setState({ styles });
  };

  /**
   * @returns {*}
   */
  renderPoster = () => {
    const { poster } = this.props;
    const { styles, src } = this.state;

    return (
      <div
        style={styles}
        className="activity-gif-player-poster"
        onClick={e => this.handlePlayClick(e, true)}
      >
        <Image
          key="poster"
          data={{ src: poster, alt: 'Poster' }}
          onLoad={this.handlePosterLoad}
        />
        <Image
          key="gif_pre_load"
          style={{ opacity: 0 }}
          data={{ src, alt: 'Gif' }}
          onLoad={this.handleGifLoad}
        />
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
    const { styles } = this.state;

    return (
      <div className="activity-gif-player-gif" style={styles}>
        <Image
          key="gif_playing"
          data={{ src, alt: 'Gif' }}
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

const mapStateToProps = state => (
  {
    contentWidth: state.ui.contentWidth
  }
);

export default connect(mapStateToProps)(GifPlayer);
