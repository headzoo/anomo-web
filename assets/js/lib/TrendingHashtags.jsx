import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils';
import { Link } from 'lib';

/**
 *
 */
class TrendingHashtags extends React.PureComponent {
  static propTypes = {
    max:              PropTypes.number,
    trendingHashtags: PropTypes.array.isRequired
  };

  static defaultProps = {
    max: 5
  };

  /**
   * @returns {*}
   */
  render() {
    const { max, trendingHashtags } = this.props;

    return (
      <div className="trending-hashtags">
        {trendingHashtags.slice(0, max).map(hashtag => (
          <span key={hashtag}>
            <Link name="hashtag" params={{ hashtag }}>
              #{hashtag}
            </Link>
          </span>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    trendingHashtags: state.activity.trendingHashtags
  }
);

export default connect(mapStateToProps)(TrendingHashtags);
