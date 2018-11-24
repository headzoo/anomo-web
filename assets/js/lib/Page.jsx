import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { browser, objects } from 'utils';
import { Container, Row, Column } from 'lib/bootstrap';

/**
 *
 */
class Page extends React.PureComponent {
  static propTypes = {
    title:      PropTypes.string.isRequired,
    fullHeight: PropTypes.bool,
    className:  PropTypes.string,
    children:   PropTypes.node
  };

  static defaultProps = {
    fullHeight: false,
    className:  '',
    children:   ''
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    browser.title(props.title);
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { title } = this.props;

    if (title !== prevProps.title) {
      browser.title(title);
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { fullHeight, className, children, ...props } = this.props;

    const classes = classNames('page', {
      'page-full-height': fullHeight
    }, className);

    return (
      <div className={classes} {...objects.propsFilter(props, Page.propTypes, 'dispatch')}>
        <Container className="page-container" fluid>
          <Row>
            <Column md={4} offsetMd={4} xs={12}>
              {children}
            </Column>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page;
