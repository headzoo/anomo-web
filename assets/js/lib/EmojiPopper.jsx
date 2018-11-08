import React from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import { Manager, Reference, Popper } from 'react-popper';
import { Icon } from 'lib';

/**
 *
 */
class EmojiPopper extends React.PureComponent {
  static propTypes = {
    open:     PropTypes.bool,
    onSelect: PropTypes.func,
    onClick:  PropTypes.func
  };

  static defaultProps = {
    open:     false,
    onSelect: () => {},
    onClick:  () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { open, onSelect, onClick } = this.props;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <Icon name="smile" ref={ref} onClick={onClick} />
          )}
        </Reference>
        <Popper placement="bottom">
          {({ ref, style, placement }) => {
            if (!open) {
              return null;
            }
            return (
              <div className="emoji-popper" ref={ref} style={style} data-placement={placement}>
                <Picker set="twitter" onSelect={onSelect} showPreview={false} />
              </div>
            );
          }}
        </Popper>
      </Manager>
    );
  }
}

export default EmojiPopper;
