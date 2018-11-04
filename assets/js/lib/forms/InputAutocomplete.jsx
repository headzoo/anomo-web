import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Autocomplete from 'react-autocomplete';
import { FormGroup } from 'lib/forms';
import FormContext from 'context/formContext';

/**
 *
 */
class InputAutocomplete extends React.PureComponent {
  static propTypes = {
    id:           PropTypes.string.isRequired,
    name:         PropTypes.string,
    label:        PropTypes.string,
    items:        PropTypes.array,
    value:        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    disabled:     PropTypes.bool,
    required:     PropTypes.bool,
    className:    PropTypes.string,
    format:       PropTypes.func,
    parse:        PropTypes.func,
    onChange:     PropTypes.func
  };

  static defaultProps = {
    name:         '',
    label:        '',
    value:        '',
    items:        [],
    errorMessage: '',
    disabled:     false,
    required:     false,
    className:    '',
    format:       v => v,
    parse:        v => v,
    onChange:     () => {}
  };

  static unityFormType = 'autocomplete';

  /**
   * @param {Event} e
   * @param {string} value
   * @param {*} context
   * @param {string} item
   */
  handleChange = (e, value, context, item) => {
    const { id, name, parse, onChange } = this.props;

    const inputName  = name || id;
    const inputValue = parse(item || value);
    const isSelected = !!item;

    context.onChange(e, inputValue, inputName);
    onChange(e, inputValue, inputName, isSelected);
  };

  /**
   *
   * @param {Array} items
   * @param {string} value
   * @param {*} styles
   * @returns {*}
   */
  renderMenu = (items, value, styles) => {
    if (value === '' || items.length === 0) {
      return <div />;
    }

    return (
      <div className="form-autocomplete-menu" style={styles}>
        {items}
      </div>
    );
  };

  /**
   * @param {string} item
   * @param {boolean} isHighlighted
   * @returns {*}
   */
  renderItem = (item, isHighlighted) => {
    const classes = classNames('form-autocomplete-item', {
      'form-autocomplete-item-highlighted': isHighlighted
    });

    return (
      <div key={item} className={classes}>
        {item}
      </div>
    );
  };

  /**
   * @param {*} context
   * @returns {*}
   */
  renderInput = (context) => {
    const { id, name, value, items, required, disabled, className, format } = this.props;

    const inputName  = name || id;
    const inputProps = {
      id,
      name:      inputName,
      required:  context.required || required,
      disabled:  context.disabled || disabled,
      className: classNames(className, 'form-control')
    };
    const wrapperProps = {
      className: 'full-width'
    };

    return (
      <Autocomplete
        items={items}
        inputProps={inputProps}
        renderMenu={this.renderMenu}
        renderItem={this.renderItem}
        getItemValue={item => item}
        wrapperProps={wrapperProps}
        onChange={(e, v) => this.handleChange(e, v, context, null)}
        onSelect={(v, i) => this.handleChange(null, v, context, i)}
        value={format(context.values[inputName] || value)}
      />
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { id, name, label, required, errorMessage } = this.props;

    const inputName = name || id;

    return (
      <FormContext.Consumer>
        {context => (
          <FormGroup
            htmlFor={id}
            label={label}
            required={context.required || required}
            errorMessage={context.errorFields[inputName] || errorMessage}
          >
            {this.renderInput(context)}
          </FormGroup>
        )}
      </FormContext.Consumer>
    );
  }
}

export default InputAutocomplete;
