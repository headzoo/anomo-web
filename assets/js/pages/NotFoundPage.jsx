import React from 'react';
import { Container, Row, Column } from 'lib/bootstrap';
import { Page, PageTitle } from 'lib';

/**
 *
 */
class NotFoundPage extends React.PureComponent {
  static propTypes = {};

  static defaultProps = {};

  /**
   * @returns {*}
   */
  render() {
    return (
      <Page title="Not Found">
        <Container>
          <Row>
            <Column className="text-center gutter-top-lg">
              <p className="page-not-found-404">404</p>
              <PageTitle>
                Page Not Found
              </PageTitle>
            </Column>
          </Row>
        </Container>
      </Page>
    );
  }
}

export default NotFoundPage;
