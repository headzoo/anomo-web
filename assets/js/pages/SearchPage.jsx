import React from 'react';
import PropTypes from 'prop-types';
import { connect, mapActionsToProps } from 'utils';
import { Row, Column } from 'lib/bootstrap';
import { UserCard } from 'lib/cards';
import { Page, Loading } from 'lib';
import * as userActions from 'actions/userActions';

/**
 *
 */
class SearchPage extends React.PureComponent {
  static propTypes = {
    searchResults:   PropTypes.array.isRequired,
    isSearchSending: PropTypes.bool.isRequired,
    userSearch:      PropTypes.func.isRequired
  };

  static defaultProps = {};

  /**
   *
   */
  componentDidMount = () => {
    const { userSearch } = this.props;

    userSearch();
  };

  /**
   * @returns {*}
   */
  render() {
    const { isSearchSending, searchResults } = this.props;

    return (
      <Page title="Search">
        <Row>
          <Column>
            {isSearchSending ? (
              <Loading className="text-center" />
            ) : (
              <Row className="profile-user-cards">
                {searchResults.map(user => (
                  <Column key={user.UserID}>
                    <UserCard user={user} />
                  </Column>
                ))}
              </Row>
            )}
          </Column>
        </Row>
      </Page>
    );
  }
}

const mapStateToProps = state => (
  {
    searchResults:   state.user.searchResults,
    isSearchSending: state.user.isSearchSending
  }
);

export default connect(
  mapStateToProps,
  mapActionsToProps(userActions)
)(SearchPage);
