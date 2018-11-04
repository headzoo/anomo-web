import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import AnimateHeight from 'react-animate-height';
import { Manager, Reference, Popper } from 'react-popper';
import { Icon } from 'lib';
import { objects } from 'utils';

/**
 *
 */
class DropdownPopper extends React.PureComponent {
  static propTypes = {
    trigger: PropTypes.element.isRequired,
    items:   PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired,
    selected:  PropTypes.string,
    placement: PropTypes.string,
    className: PropTypes.string,
    onSelect:  PropTypes.func
  };

  static defaultProps = {
    selected:  '',
    placement: 'bottom-start',
    className: '',
    onSelect:  () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  /**
   *
   */
  handleClickOutside = (e) => {
    if (this.state.open && e.target.getAttribute('class') !== 'list-selectable-item') {
      this.setState({ open: false });
    }
  };

  /**
   *
   */
  handleIconClick = (e) => {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  };

  /**
   * @param {Event} e
   * @param {*} item
   */
  handleSelect = (e, item) => {
    const { onSelect } = this.props;

    if (item.handler) {
      item.handler(item);
    }
    if (!e.defaultPrevented) {
      onSelect(e, item);
      if (!e.defaultPrevented) {
        this.setState({ open: false });
      }
    }
  };

  /**
   * @returns {*}
   */
  renderItems = () => {
    const { items, selected } = this.props;

    return (
      <ul className="list list-selectable">
        {items.map((item) => {
          const classes = classNames({
            'list-selected': selected === item.value,
            'list-disabled': item.disabled
          });

          return (
            <li
              key={item.value}
              className={classes}
              onClick={e => this.handleSelect(e, item)}
            >
              <span className="list-selectable-item">
                {item.icon && (
                  <Icon name={item.icon} />
                )}
                {item.label}
                {selected === item.value && (
                  <Icon name="check" />
                )}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { trigger, placement, className, ...props } = this.props;
    const { open } = this.state;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            React.cloneElement(trigger, {
              ref,
              onClick: this.handleIconClick
            })
          )}
        </Reference>
        <Popper placement={placement}>
          {({ ref, style, p }) => (
            <div className="list-dropdown-popper" ref={ref} style={style} data-placement={p}>
              <AnimateHeight duration={50} height={open ? 'auto' : 0}>
                <div
                  className={classNames('list-dropdown-popper-body', className)}
                  {...objects.propsFilter(props, DropdownPopper.propTypes)}
                >
                  {this.renderItems()}
                </div>
              </AnimateHeight>
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

export default enhanceWithClickOutside(DropdownPopper);
