import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'lib/bootstrap';
import ActivityCardHeader from './ActivityCardHeader';
import ActivityCardBody from './ActivityCardBody';
import ActivityCardFooter from './ActivityCardFooter';

/**
 *
 */
class ActivityPreviewCard extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    comment:  PropTypes.bool
  };

  static defaultProps = {
    comment: false
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, comment } = this.props;

    return (
      <Card className="card-activity card-activity-preview">
        <ActivityCardHeader
          activity={activity}
          followingUserNames={[]}
        />
        <ActivityCardBody
          activity={activity}
        />
        <ActivityCardFooter
          activity={activity}
          comment={comment}
          onCommentClick={(e) => { e.preventDefault(); }}
        />
      </Card>
    );
  }
}

export default ActivityPreviewCard;
