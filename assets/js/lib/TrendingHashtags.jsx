import React from 'react';
import PropTypes from 'prop-types';
import { strings, connect } from 'utils';
import { Row, Column } from 'lib/bootstrap';
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

    if (trendingHashtags.length === 0) {
      return null;
    }

    return (
      <Row>
        <Column className="gutter-bottom">
          <div className="trending-hashtags">
            {trendingHashtags.slice(0, max).map(hashtag => (
              <span key={hashtag}>
                <Link name="hashtag" params={{ hashtag }} title={`#${hashtag}`}>
                  #{strings.truncate(hashtag, 12)}
                </Link>
              </span>
            ))}
          </div>
        </Column>
      </Row>
    );
  }
}

const mapStateToProps = state => (
  {
    trendingHashtags: state.activity.trendingHashtags
  }
);

export default connect(mapStateToProps)(TrendingHashtags);
