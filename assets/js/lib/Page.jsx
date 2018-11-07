import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { browser, objects, connect } from 'utils';
import { Container } from 'lib/bootstrap';
import { NotificationsModal } from 'lib/modals';
import { Nav, Footer } from 'lib';

/**
 *
 */
class Page extends React.PureComponent {
  static propTypes = {
    title:         PropTypes.string.isRequired,
    withNav:       PropTypes.bool,
    withFooter:    PropTypes.bool,
    fullHeight:    PropTypes.bool,
    className:     PropTypes.string,
    children:      PropTypes.node,
    visibleModals: PropTypes.object.isRequired
  };

  static defaultProps = {
    withNav:    true,
    withFooter: true,
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
   *
   */
  componentDidUpdate = () => {
    const { title } = this.props;

    browser.title(title);
  };

  /**
   * @returns {*}
   */
  render() {
    const { withNav, withFooter, fullHeight, className, children, visibleModals, ...props } = this.props;

    const classes = classNames('page', {
      'page-full-height': fullHeight
    }, className);

    return (
      <div className={classes} {...objects.propsFilter(props, Page.propTypes, 'dispatch')}>
        {withNav && <Nav />}
        <Container fluid>
          {children}
        </Container>
        {withFooter && <Footer />}
        <NotificationsModal open={visibleModals.notifications} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    visibleModals: state.ui.visibleModals
  };
};

export default connect(mapStateToProps)(Page);
