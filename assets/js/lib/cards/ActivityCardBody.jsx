import React from 'react';
import PropTypes from 'prop-types';
import { objects } from 'utils';
import YouTube from 'react-youtube';
import { CardBody, CardText } from 'lib/bootstrap';
import { ActivityImage, Message, Video, Shimmer, Poll } from 'lib';

/**
 *
 */
class ActivityCardBody extends React.PureComponent {
  static propTypes = {
    loading:      PropTypes.bool,
    activity:     PropTypes.object.isRequired,
    onClick:      PropTypes.func,
    onPollAnswer: PropTypes.func,
    onImageClick: PropTypes.func
  };

  static defaultProps = {
    loading:      false,
    onClick:      () => {},
    onPollAnswer: () => {},
    onImageClick: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, loading, onClick, onImageClick, onPollAnswer } = this.props;

    if (loading || objects.isEmpty(activity)) {
      return (
        <CardBody>
          <CardText>
            <Shimmer className="card-activity-shimmer" />
            <Shimmer className="card-activity-shimmer-short" />
          </CardText>
        </CardBody>
      );
    }

    return (
      <CardBody onClick={onClick}>
        <CardText>
          {(activity.Message && activity.Message.message) && (
            <Message
              text={activity.Message.message}
              tags={activity.Message.message_tags}
            />
          )}
          {activity.Poll && (
            <Poll
              poll={activity.Poll}
              onAnswer={onPollAnswer}
            />
          )}
          {activity.Image && (
            <ActivityImage
              activity={activity}
              onClick={onImageClick}
            />
          )}
          {(activity.VideoID && activity.VideoSource === 'youtube') && (
            <YouTube
              videoId={activity.VideoID}
            />
          )}
          {(activity.VideoURL && activity.VideoSource !== 'youtube') && (
            <Video
              source={activity.VideoURL}
              poster={activity.VideoThumbnail}
            />
          )}
        </CardText>
      </CardBody>
    );
  }
}

export default ActivityCardBody;
