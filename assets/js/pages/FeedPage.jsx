import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapActionsToProps } from 'utils';
import { Row, Column } from 'lib/bootstrap';
import { PostForm } from 'lib/forms';
import { Page, Feed, Loading, withRouter } from 'lib';
import * as userActions from 'actions/userActions';
import * as activityActions from 'actions/activityActions';

/**
 *
 */
class FeedPage extends React.PureComponent {
  static propTypes = {
    activities:       PropTypes.array.isRequired,
    isRefreshing:     PropTypes.bool.isRequired,
    activityFetch:    PropTypes.func.isRequired,
    userSubmitStatus: PropTypes.func.isRequired
  };

  /**
   *
   */
  handleNext = () => {
    const { activityFetch } = this.props;

    activityFetch();
  };

  /**
   *
   */
  handleRefresh = () => {
    const { activityFetch } = this.props;

    activityFetch(true);
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handlePostSubmit = (e, values) => {
    const { userSubmitStatus } = this.props;

    e.preventDefault();
    userSubmitStatus(values.message, values.photo);
  };

  /**
   * @returns {*}
   */
  render() {
    const { activities, isRefreshing } = this.props;

    return (
      <Page title="Anomo">
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <PostForm
              onSubmit={this.handlePostSubmit}
              withUpload
            />
          </Column>
        </Row>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            {isRefreshing && (
              <Loading className="text-center gutter-bottom" />
            )}
            <Feed
              activities={activities}
              onNext={this.handleNext}
              onRefresh={this.handleRefresh}
            />
          </Column>
        </Row>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activities:   state.activity.activities,
    isRefreshing: state.activity.isRefreshing
  };
};

export default connect(
  mapStateToProps,
  mapActionsToProps(activityActions, userActions)
)(withRouter(FeedPage));
