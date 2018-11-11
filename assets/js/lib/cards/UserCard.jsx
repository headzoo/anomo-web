import React from 'react';
import PropTypes from 'prop-types';
import { dates } from 'utils';
import { Card, CardBody, CardText } from 'lib/bootstrap';
import { Avatar } from 'lib';

/**
 *
 */
class UserCard extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    const { user } = this.props;

    return (
      <Card>
        <CardBody>
          <CardText>
            <div className="card-profile-cover-container">
              <div className="card-profile-cover-info">
                <Avatar src={user.Avatar || ''} />
                <h1>{user.UserName}</h1>
                <div className="card-profile-location">
                  {dates.getAge(user.BirthDate || '1980-12-10')} &middot; {user.NeighborhoodName || 'Earth'}
                </div>
              </div>
              <div className="card-profile-cover-mask" />
            </div>
          </CardText>
        </CardBody>
      </Card>
    );
  }
}

export default UserCard;
