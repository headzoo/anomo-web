import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { browser, objects, connect } from 'utils';
import { Container } from 'lib/bootstrap';
import { ActivityModal, UserModal, PostModal } from 'lib/modals';
import { Footer } from 'lib';

/**
 *
 */
class Page extends React.PureComponent {
  static propTypes = {
    title:         PropTypes.string.isRequired,
    withFooter:    PropTypes.bool,
    fullHeight:    PropTypes.bool,
    className:     PropTypes.string,
    children:      PropTypes.node,
    visibleModals: PropTypes.object.isRequired
  };

  static defaultProps = {
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
    const { withFooter, fullHeight, className, children, visibleModals, ...props } = this.props;

    const classes = classNames('page', {
      'page-full-height': fullHeight
    }, className);

    return (
      <div className={classes} {...objects.propsFilter(props, Page.propTypes, 'dispatch')}>
        <Container fluid>
          {children}
        </Container>
        {withFooter && <Footer />}
        <ActivityModal open={visibleModals.activity !== false} />
        <UserModal open={visibleModals.user !== false} />
        <PostModal open={visibleModals.post !== false} />
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
