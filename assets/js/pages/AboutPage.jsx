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
          <Column md={4} offsetMd={4} xs={12}>
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
                  <p>
                    Source code available
                    on <a href="https://github.com/headzoo/anomo-web" target="_blank" rel="noopener noreferrer">Github</a>.
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
