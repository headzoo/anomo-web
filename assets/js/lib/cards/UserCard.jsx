import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardText } from 'lib/bootstrap';
import { Avatar, Link, Age, Neighborhood } from 'lib';

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

    const coverStyles = {
      backgroundImage: `url(${user.CoverPicture || ''})`
    };

    return (
      <Card>
        <CardBody>
          <CardText>
            <Link name="profile" params={{ id: user.UserID }}>
              <div className="card-profile-cover-container" style={coverStyles}>
                <div className="card-profile-cover-info">
                  <Avatar src={user.Avatar} />
                  <h1>{user.UserName}</h1>
                  <div className="card-profile-location">
                    <Age date={user.BirthDate} /> &middot; <Neighborhood name={user.NeighborhoodName} />
                  </div>
                </div>
                <div className="card-profile-cover-mask" />
              </div>
            </Link>
          </CardText>
        </CardBody>
      </Card>
    );
  }
}

export default UserCard;
