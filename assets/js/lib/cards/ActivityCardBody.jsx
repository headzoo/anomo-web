import React from 'react';
import PropTypes from 'prop-types';
import { objects } from 'utils';
import YouTube from 'react-youtube';
import { CardBody, CardText } from 'lib/bootstrap';
import { Image, Message, Video, Shimmer, Poll } from 'lib';

/**
 *
 */
class ActivityCardBody extends React.PureComponent {
  static propTypes = {
    activity:     PropTypes.object.isRequired,
    onClick:      PropTypes.func,
    onPollAnswer: PropTypes.func,
    onImageClick: PropTypes.func
  };

  static defaultProps = {
    onClick:      () => {},
    onPollAnswer: () => {},
    onImageClick: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity, onClick, onImageClick, onPollAnswer } = this.props;

    if (objects.isEmpty(activity) || activity.isLoading) {
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
            <Image
              onClick={onImageClick}
              data={{ src: activity.Image, alt: 'Image' }}
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
