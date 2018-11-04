import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import AnimateHeight from 'react-animate-height';
import { Manager, Reference, Popper } from 'react-popper';
import { objects } from 'utils';
import { Image, types } from 'lib';

/**
 *
 */
class MembersDropdown extends React.PureComponent {
  static propTypes = {
    members:   PropTypes.arrayOf(types.member),
    placement: PropTypes.string,
    selected:  PropTypes.number,
    className: PropTypes.string,
    onSelect:  PropTypes.func
  };

  static defaultProps = {
    members:   [],
    placement: 'bottom-start',
    selected:  0,
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
  handleTriggerClick = (e) => {
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
  renderTrigger = (ref) => {
    const { members, selected } = this.props;

    let selectedMember = null;
    for (let i = 0; i < members.length; i++) {
      if (members[i].id === selected) {
        selectedMember = members[i];
        break;
      }
    }

    return (
      <div
        ref={ref}
        className="list-members-trigger btn btn-brand"
        onClick={this.handleTriggerClick}
      >
        <span className="list-selectable-item list-members-dropdown-item">
          <Image key={selectedMember.avatar.src} data={selectedMember.avatar} circle />
          {selectedMember.label}
        </span>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderItems = () => {
    const { members, selected } = this.props;

    return (
      <ul className="list list-selectable">
        {members.map((member) => {
          if (selected === member.id) {
            return null;
          }

          const classes = classNames({
            'list-disabled': member.disabled
          });

          return (
            <li
              key={member.id}
              className={classes}
              onClick={e => this.handleSelect(e, member)}
            >
              <span className="list-selectable-item list-members-dropdown-item">
                <Image key={member.avatar.src} data={member.avatar} circle />
                {member.label}
              </span>
            </li>
          );
        }).filter(n => n)}
      </ul>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { placement, className, ...props } = this.props;
    const { open } = this.state;

    const classes = classNames('list-members-dropdown', className);

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            this.renderTrigger(ref)
          )}
        </Reference>
        <Popper placement={placement}>
          {({ ref, style, p }) => (
            <div className={classes} ref={ref} style={style} data-placement={p}>
              <AnimateHeight duration={50} height={open ? 'auto' : 0}>
                <div
                  className="list-members-dropdown-body"
                  {...objects.propsFilter(props, MembersDropdown.propTypes)}
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

export default enhanceWithClickOutside(MembersDropdown);
