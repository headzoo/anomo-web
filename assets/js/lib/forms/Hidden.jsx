import React from 'react';
import PropTypes from 'prop-types';
import { objects } from 'utils';
import FormContext from 'context/formContext';

/**
 *
 */
class Hidden extends React.PureComponent {
  static propTypes = {
    id:        PropTypes.string.isRequired,
    name:      PropTypes.string,
    value:     PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    numeric:   PropTypes.bool,
    format:    PropTypes.func,
    parse:     PropTypes.func,
    className: PropTypes.string,
    onChange:  PropTypes.func,
    forms:     PropTypes.object
  };

  static defaultProps = {
    name:      '',
    value:     '',
    numeric:   false,
    forms:     {},
    className: '',
    format:    v => v,
    parse:     v => v,
    onChange:  () => {}
  };

  static unityFormType = 'hidden';

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  /**
   * @returns {string|number}
   */
  getValue = () => {
    const { numeric } = this.props;
    const { value } = this.input.current;

    if (numeric) {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        return 0;
      }
      return parsed;
    }
    return value;
  };

  /**
   * @param {Event} e
   * @param {*} context
   */
  handleChange = (e, context) => {
    const { id, name, parse, onChange } = this.props;

    const inputName = name || id;
    const inputValue = parse(this.getValue());

    if (context.onChange) context.onChange(e, inputValue, inputName);
    onChange(e, inputValue, inputName);
  };

  /**
   * @returns {*}
   */
  render() {
    const { id, name, value, format, className, ...props } = this.props;

    const inputName = name || id;

    return (
      <FormContext.Consumer>
        {context => (
          <input
            id={id}
            type="hidden"
            name={inputName}
            ref={this.input}
            className={className}
            onChange={e => this.handleChange(e, context)}
            {...objects.propsFilter(props, Hidden.propTypes)}
            value={format(context.values[inputName] || value)}
          />
        )}
      </FormContext.Consumer>
    );
  }
}

export default Hidden;
