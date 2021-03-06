import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { objects, browser, connect, mapActionsToProps } from 'utils';
import { Icon } from 'lib';
import * as uiActions from 'actions/uiActions';

/**
 *
 */
class Modal extends React.PureComponent {
  static propTypes = {
    sm:             PropTypes.bool,
    lg:             PropTypes.bool,
    name:           PropTypes.string,
    open:           PropTypes.bool,
    fade:           PropTypes.bool,
    centered:       PropTypes.bool,
    backdrop:       PropTypes.bool,
    icon:           PropTypes.string,
    title:          PropTypes.string,
    footer:         PropTypes.node,
    withHeader:     PropTypes.bool,
    className:      PropTypes.string,
    children:       PropTypes.node,
    onOpened:       PropTypes.func,
    onClosed:       PropTypes.func,
    uiVisibleModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sm:         false,
    lg:         false,
    open:       false,
    fade:       false,
    centered:   true,
    backdrop:   true,
    withHeader: true,
    name:       '',
    footer:     '',
    icon:       '',
    title:      '',
    className:  '',
    children:   '',
    onOpened:   () => {},
    onClosed:   () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.opened   = false;
    this.modalRef = React.createRef();
    this.modalDOM = null;
  }

  /**
   * Called after the component mounts
   */
  componentDidMount() {
    const { open } = this.props;

    this.modalDOM = $(this.modalRef.current);
    this.modalDOM.on('shown.bs.modal', this.handleModalShown);
    this.modalDOM.on('hidden.bs.modal', this.handleModalHidden);
    if (open) {
      this.open();
    }
  }

  /**
   * Called after the component updates
   */
  componentDidUpdate() {
    const { open } = this.props;

    if (this.opened !== open) {
      this.toggle(open);
    }
  }

  /**
   * Called before the component unmounts
   */
  componentWillUnmount() {
    browser.showScrollbars();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    this.modalDOM.off('shown.bs.modal', this.handleModalShown);
    this.modalDOM.off('hidden.bs.modal', this.handleModalHidden);
  }

  /**
   * @param {boolean} open
   */
  toggle = (open) => {
    if (open === undefined) {
      open = !this.opened;
    }
    if (open) {
      this.open();
    } else {
      this.close();
    }
  };

  /**
   *
   */
  open = () => {
    this.modalDOM.modal('show');
    this.opened = true;
    this.props.onOpened();
  };

  /**
   *
   */
  close = () => {
    const { name, uiVisibleModal } = this.props;

    this.modalDOM.modal('hide');
    this.opened = false;
    this.props.onClosed();
    if (name) {
      uiVisibleModal(name, false);
    }
  };

  /**
   *
   */
  handleModalShown = () => {
    this.opened = true;
    browser.hideScrollbars();
    this.props.onOpened();
  };

  /**
   *
   */
  handleModalHidden = () => {
    const { name, uiVisibleModal } = this.props;

    this.opened = false;
    browser.showScrollbars();
    this.props.onClosed();
    if (name) {
      uiVisibleModal(name, false);
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      sm,
      lg,
      centered,
      backdrop,
      icon,
      title,
      fade,
      withHeader,
      footer,
      className,
      children,
      ...props
    } = this.props;

    const modalClasses = classNames('modal', className, {
      'fade': fade
    });
    const dialogClasses = classNames('modal-dialog', {
      'modal-sm':              sm,
      'modal-lg':              lg,
      'modal-dialog-centered': centered
    });

    return (
      <div
        tabIndex="-1"
        role="dialog"
        ref={this.modalRef}
        data-backdrop={backdrop}
        className={modalClasses}
        {...objects.propsFilter(props, Modal.propTypes, uiActions, 'dispatch')}
      >
        <div className={dialogClasses} role="document">
          <div className="modal-content">
            {withHeader && (
              <div className="modal-header">
                <h5 className="modal-title">
                  {icon && <Icon name={icon} />}
                  {title}
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            <div className="modal-body">
              {children}
            </div>
            {footer}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  mapActionsToProps(uiActions)
)(Modal);
