import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { browser, numbers, objects, lang } from 'utils';
import { types } from 'lib';

/**
 *
 */
class Editable extends React.PureComponent {
  static propTypes = {
    name:      PropTypes.string.isRequired,
    value:     PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options:   types.options,
    data:      PropTypes.any, // eslint-disable-line
    numeric:   PropTypes.bool,
    className: PropTypes.string,
    onClick:   PropTypes.func,
    onChange:  PropTypes.func
  };

  static defaultProps = {
    value:     '',
    options:   [],
    data:      null,
    numeric:   false,
    className: '',
    onClick:   () => {},
    onChange:  () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      editing:    false,
      inputValue: props.value
    };
    this.input = React.createRef();
  }

  /**
   *
   */
  componentDidMount = () => {
    this.clickOff = browser.on('click', this.handleWindowClick);
  };

  /**
   *
   */
  componentDidUpdate = () => {
    const { value } = this.props;
    const { inputValue, editing } = this.state;

    if (!editing && value !== inputValue) {
      this.setState({ inputValue: value });
    }
  };

  /**
   *
   */
  componentWillUnmount = () => {
    this.clickOff();
  };

  /**
   * @param {Event} e
   */
  stopEditing = (e) => {
    const { name, data, onChange } = this.props;
    const { inputValue } = this.state;

    onChange(e, inputValue, name, data);
    this.setState({ editing: false });
  };

  /**
   *
   */
  incrementInputValue = () => {
    const { numeric } = this.props;
    const { inputValue } = this.state;

    if (numeric) {
      this.setState({
        inputValue: numbers.parseAny(inputValue, 10) + 1
      });
    }
  };

  /**
   *
   */
  decrementInputValue = () => {
    const { numeric } = this.props;
    const { inputValue } = this.state;

    if (numeric) {
      this.setState({
        inputValue: numbers.parseAny(inputValue, 10) - 1
      });
    }
  };

  /**
   * @param {Event} e
   */
  handleWindowClick = (e) => {
    const { editing } = this.state;

    if (!editing) {
      return;
    }

    if (e.target !== this.input.current) {
      this.stopEditing(e);
    } else {
      e.stopPropagation();
    }
  };

  /**
   * @param {Event} e
   */
  handleValueClick = (e) => {
    const { onClick } = this.props;
    const { editing } = this.state;

    onClick(e);
    if (!e.defaultPrevented) {
      this.setState({ editing: !editing }, () => {
        if (this.input.current.select) {
          this.input.current.select();
        } else if (this.input.current.focus) {
          this.input.current.focus();
        }
      });
    }
  };

  /**
   * @param {Event} e
   */
  handleInputChange = (e) => {
    const { numeric, options } = this.props;

    const inputValue = numeric ? numbers.parseAny(e.target.value) : e.target.value;
    this.setState({ inputValue }, () => {
      if (options.length > 0) {
        this.stopEditing(e);
      }
    });
  };

  /**
   * @param {Event} e
   */
  handleInputKeyDown = (e) => {
    switch (e.keyCode) {
      case 13: // Enter
        this.stopEditing(e);
        break;
      case 38: // Up
        this.incrementInputValue();
        break;
      case 40: // Down
        this.decrementInputValue();
        break;
    }
  };

  /**
   * @param {Event} e
   */
  handleInputWheel = (e) => {
    const { numeric } = this.props;

    if (!numeric) {
      return;
    }
    if (e.deltaY < 0) { // Up
      this.incrementInputValue();
    } else if (e.deltaY > 0) { // Down
      this.decrementInputValue();
    }
  };

  /**
   * @returns {*}
   */
  renderInput = () => {
    const { options, numeric, className } = this.props;
    const { inputValue } = this.state;

    const classes = classNames('editable editable-input form-control', className, {
      'text-right': numeric
    });

    if (options.length > 0) {
      return (
        <select
          ref={this.input}
          value={inputValue}
          className={classes}
          onChange={this.handleInputChange}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        ref={this.input}
        value={inputValue}
        className={classes}
        onWheel={this.handleInputWheel}
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputKeyDown}
      />
    );
  };

  /**
   * @returns {*}
   */
  renderValue = () => {
    const { value, className, ...props } = this.props;

    const classes = classNames('editable editable-value', className);

    return (
      <div
        className={classes}
        title={lang.clickToEdit}
        onClick={this.handleValueClick}
        {...objects.propsFilter(props, Editable.propTypes)}
      >
        {value}
      </div>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { editing } = this.state;

    return editing ? this.renderInput() : this.renderValue();
  }
}

export default Editable;
