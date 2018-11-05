import React from 'react';
import { Row, Column, Card, CardBody, CardHeader, CardText } from 'lib/bootstrap';
import { Page } from 'lib';

/**
 *
 */
class AboutPage extends React.PureComponent {
  /**
   * @returns {*}
   */
  render() {
    return (
      <Page title="About">
        <Row>
          <Column xs={4} offsetXs={4}>
            <Card>
              <CardHeader>
                About
              </CardHeader>
              <CardBody>
                <CardText>
                  <p>
                    This site is <strong>NOT</strong> affiliated with Anomo or any of its services.
                  </p>
                  <p>
                    Site created by @headzoo and @Nason002.
                  </p>
                </CardText>
              </CardBody>
            </Card>
          </Column>
        </Row>
      </Page>
    );
  }
}

export default AboutPage;
