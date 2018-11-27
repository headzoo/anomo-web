import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container, Row, Column } from 'lib/bootstrap';
import { PrivateRoute } from 'lib';
import FeedPage from 'pages/FeedPage';
import HashtagPage from 'pages/HashtagPage';
import ActivityPage from 'pages/ActivityPage';
import ProfilePage from 'pages/ProfilePage';
import EditProfilePage from 'pages/EditProfilePage';
import SettingsPage from 'pages/SettingsPage';
import SearchPage from 'pages/SearchPage';
import LoginPage from 'pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';
import AboutPage from 'pages/AboutPage';
import NotFoundPage from 'pages/NotFoundPage';
import routes from '../store/routes';

/**
 *
 */
class Layout extends React.PureComponent {
  /**
   * @returns {*}
   */
  render() {
    return (
      <Container className="page-container" fluid>
        <Row>
          <Column md={4} offsetMd={4} xs={12}>
            <Switch>
              <PrivateRoute exact path={routes.path('home')} component={FeedPage} />
              <PrivateRoute exact path={routes.path('popular')} component={FeedPage} />
              <PrivateRoute exact path={routes.path('following')} component={FeedPage} />
              <PrivateRoute exact path={routes.path('activity')} component={ActivityPage} />
              <PrivateRoute exact path={routes.path('hashtag')} component={HashtagPage} />
              <PrivateRoute exact path={routes.path('editProfile')} component={EditProfilePage} />
              <PrivateRoute exact path={routes.path('profile')} component={ProfilePage} />
              <PrivateRoute exact path={routes.path('settings')} component={SettingsPage} />
              <PrivateRoute exact path={routes.path('settingsNotifications')} component={SettingsPage} />
              <PrivateRoute exact path={routes.path('settingsBlocked')} component={SettingsPage} />
              <PrivateRoute exact path={routes.path('settingsPassword')} component={SettingsPage} />
              <PrivateRoute exact path={routes.path('search')} component={SearchPage} />
              <Route exact path={routes.path('login')} component={LoginPage} />
              <Route exact path={routes.path('logout')} component={LogoutPage} />
              <Route exact path={routes.path('about')} component={AboutPage} />
              <Route exact path="*" component={NotFoundPage} />
            </Switch>
          </Column>
        </Row>
      </Container>
    );
  }
}

export default Layout;
