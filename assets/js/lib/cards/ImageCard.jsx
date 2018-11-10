import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Card, CardImage } from 'lib/bootstrap';
import { Link } from 'lib';

/**
 *
 */
class ImageCard extends React.PureComponent {
  static propTypes = {
    activity:  PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, className } = this.props;

    return (
      <Card
        key={`image_${activity.RefID}`}
        className={`${classNames('card-activity', className)} card-activity-clickable`}
      >
        <Link
          name="activity"
          params={{ refID: activity.RefID, actionType: activity.ActionType }}
          state={{ activity }}
        >
          <CardImage data={{ src: activity.Image, alt: '' }} />
        </Link>
      </Card>
    );
  }
}

export default ImageCard;
