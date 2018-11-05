import React from 'react';
import PropTypes from 'prop-types';
import { objects, connect, mapStateToProps, mapActionsToProps } from 'utils';
import { ActivityCard } from 'lib/cards';
import { Row, Column } from 'lib/bootstrap';
import { Page, withRouter } from 'lib';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class ActivityPage extends React.PureComponent {
  static propTypes = {
    activity:      PropTypes.object.isRequired,
    match:         PropTypes.object.isRequired,
    location:      PropTypes.object.isRequired,
    activityGet:   PropTypes.func.isRequired,
    activityReset: PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      activity: {}
    };
  }

  /**
   *
   */
  componentDidMount = () => {
    const { location, match, activityGet } = this.props;
    const { state } = location;

    if (state.activity) {
      this.setState({ activity: state.activity }, () => {
        activityGet(match.params.refID, match.params.actionType);
      });
    } else {
      activityGet(match.params.refID, match.params.actionType);
    }
  };

  /**
   * @param {*} prevProps
   * @param {*} prevState
   */
  componentDidUpdate = (prevProps, prevState) => {
    const { activity } = this.state;

    if (!objects.isEmpty(this.props.activity.activity)
      && !objects.isEqual(this.props.activity.activity, activity)
      && objects.isEqual(prevState.activity, activity)) {
      this.setState({ activity: this.props.activity.activity });
    }
  };

  /**
   *
   */
  componentWillUnmount = () => {
    const { activityReset } = this.props;

    activityReset();
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity } = this.state;

    if (objects.isEmpty(activity)) {
      return null;
    }

    return (
      <Page title="Activity">
        <Row>
          <Column className="gutter-top" xs={4} offsetXs={4}>
            <ActivityCard activity={activity} />
          </Column>
        </Row>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps('activity'),
  mapActionsToProps(activityActions)
)(withRouter(ActivityPage));
