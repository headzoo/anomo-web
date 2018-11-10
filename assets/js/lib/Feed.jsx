import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect, mapStateToProps } from 'utils';
import { TransitionGroup, FadeAndSlideTransition } from 'lib/animation';
import { Row, Column } from 'lib/bootstrap';
import { ActivityCard, ImageCard } from 'lib/cards';
import { Loading } from 'lib';
import * as constants from 'anomo/constants';

/**
 *
 */
class Feed extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.array.isRequired,
    isPics:     PropTypes.bool,
    onNext:     PropTypes.func
  };

  static defaultProps = {
    isPics: false,
    onNext: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { activities, isPics, onNext } = this.props;

    return (
      <InfiniteScroll
        next={onNext}
        dataLength={activities.length}
        style={{ overflow: 'hidden' }}
        loader={<Loading className="text-center" />}
        hasMore
      >
        <TransitionGroup component={Row}>
          {activities.map(a => (
            (!a.IsDeleted && a.ActionType !== constants.ACTION_TYPE_JOIN) ? (
              <FadeAndSlideTransition key={a.ActivityID} duration={150}>
                <Column sm={isPics ? 6 : 12}>
                  {isPics ? (
                    <ImageCard activity={a} />
                  ) : (
                    <ActivityCard activity={a} />
                  )}
                </Column>
              </FadeAndSlideTransition>
            ) : null
          ))}
        </TransitionGroup>
      </InfiniteScroll>
    );
  }
}

export default connect(mapStateToProps())(Feed);
