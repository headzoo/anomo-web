import React from 'react';
import PropTypes from 'prop-types';
import { userLogin } from 'actions/userActions';
import { formSubmitting, formError } from 'actions/formActions';
import { connect, mapStateToProps } from 'utils';
import { Row, Column, Card, CardBody, CardHeader, CardText, Button } from 'lib/bootstrap';
import { Form, Input } from 'lib/forms';
import { Page, withRouter } from 'lib';
import routes from 'store/routes';

/**
 *
 */
class LoginPage extends React.PureComponent {
  static propTypes = {
    user:     PropTypes.object.isRequired,
    forms:    PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { user, history, dispatch } = this.props;

    if (user.isSending !== prevProps.user.isSending) {
      dispatch(formSubmitting('login', user.isSending));
    }
    if (user.errorMessage !== prevProps.user.errorMessage) {
      dispatch(formError('login', user.errorMessage));
    }
    if (user.isAuthenticated !== prevProps.user.isAuthenticated && user.isAuthenticated) {
      history.push(routes.route('home'));
    }
  };

  /**
   * @param {Event} e
   * @param {*} values
   */
  handleSubmit = (e, values) => {
    const { dispatch } = this.props;

    e.preventDefault();
    dispatch(userLogin(values.username, values.password));
  };

  /**
   * @returns {*}
   */
  renderForm = () => {
    const { forms } = this.props;
    const { login } = forms;

    return (
      <Form
        name="login"
        onSubmit={this.handleSubmit}
        disabled={login.isSubmitted || login.successMessage !== ''}
        required
      >
        <Row>
          <Column>
            <Input
              name="username"
              type="text"
              label="Username"
              id="login-username"
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Input
              name="password"
              type="password"
              label="Password"
              id="login-password"
            />
          </Column>
        </Row>
        <Row>
          <Column className="gutter-top">
            <Button
              disabled={login.isSubmitting || login.isSubmitted || !login.isComplete}
              block
              lg
            >
              Login
            </Button>
          </Column>
        </Row>
      </Form>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Page title="Login">
        <Row>
          <Column className="v-middle" sm={6} xs={12} offsetSm={3}>
            <Card fullWidth>
              <CardHeader icon="lock">
                Login
              </CardHeader>
              <CardBody>
                <CardText>
                  {this.renderForm()}
                </CardText>
              </CardBody>
            </Card>
          </Column>
        </Row>
      </Page>
    );
  }
}

export default connect(mapStateToProps('user', 'forms'))(
  withRouter(LoginPage)
);
