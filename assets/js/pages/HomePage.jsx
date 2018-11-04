import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapStateToProps, mapActionsToProps } from 'utils';
import { Row, Column } from 'lib/bootstrap';
import { ActivityCard } from 'lib/cards';
import { Page, Loading, withRouter } from 'lib';
import routes from 'store/routes';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class HomePage extends React.PureComponent {
  static propTypes = {
    user:        PropTypes.object.isRequired,
    activity:    PropTypes.object.isRequired,
    activityGet: PropTypes.func.isRequired,
    history:     PropTypes.object.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount = () => {
    const { user, activityGet, history } = this.props;

    if (user.isAuthenticated) {
      activityGet();
    } else {
      history.push(routes.route('login'));
    }
  };

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { user, activityGet } = this.props;

    if (prevProps.user.isAuthenticated !== user.isAuthenticated && user.isAuthenticated) {
      activityGet();
    }
  };

  /**
   * @returns {*}
   */
  renderLoading = () => {
    return (
      <div style={{ height: 100 }}>
        <Loading middle />
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderFeed = () => {
    const { activity } = this.props;

    return (
      <Row className="gutter-top">
        {activity.activities.map(a => (
          <Column key={a.ActivityID}>
            <ActivityCard activity={a} />
          </Column>
        ))}
      </Row>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { activity } = this.props;

    return (
      <Page title="Anomo">
        <Row>
          <Column xs={4} offsetXs={4}>
            {activity.isLoading ? this.renderLoading() : this.renderFeed()}
          </Column>
        </Row>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps('user', 'activity'),
  mapActionsToProps(activityActions)
)(withRouter(HomePage));
