import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'utils';
import { ActivityCard } from 'lib/cards';

/**
 *
 */
class PinnedActivities extends React.PureComponent {
  static propTypes = {
    pinnedActivities: PropTypes.array.isRequired
  };

  /**
   * @returns {*}
   */
  render() {
    const { pinnedActivities } = this.props;

    return (
      <div>
        {pinnedActivities.map(a => (
          <ActivityCard key={a.ActivityID} activity={a} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    pinnedActivities: state.ui.pinnedActivities
  }
);

export default connect(mapStateToProps)(PinnedActivities);
