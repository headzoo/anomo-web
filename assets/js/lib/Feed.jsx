import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect, mapStateToProps } from 'utils';
import { TransitionGroup, FadeAndSlideTransition } from 'lib/animation';
import { Row, Column } from 'lib/bootstrap';
import { ActivityCard } from 'lib/cards';
import { Loading } from 'lib';

/**
 *
 */
class Feed extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.array.isRequired,
    onNext:     PropTypes.func
  };

  static defaultProps = {
    onNext: () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { activities, onNext } = this.props;

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
            a.ActionType !== '28' ? (
              <FadeAndSlideTransition key={a.ActivityID} duration={150}>
                <Column>
                  <ActivityCard activity={a} />
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
