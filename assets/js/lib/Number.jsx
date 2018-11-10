import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { numbers, lang } from 'utils';

/**
 *
 */
class Number extends React.PureComponent {
  static propTypes = {
    value:     PropTypes.number.isRequired,
    commas:    PropTypes.bool,
    money:     PropTypes.bool,
    percent:   PropTypes.bool,
    kcal:      PropTypes.bool,
    round:     PropTypes.bool,
    prefix:    PropTypes.node,
    postfix:   PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    commas:    true,
    percent:   false,
    money:     false,
    kcal:      false,
    round:     false,
    prefix:    '',
    postfix:   '',
    className: ''
  };

  /**
   * @returns {*}
   */
  render() {
    const { value, percent, commas, money, kcal, round, prefix, postfix, className, ...props } = this.props;

    let parsedValue = value;
    if (money) {
      parsedValue = numbers.money(parsedValue);
    } else if (commas) {
      parsedValue = numbers.addCommas(parsedValue);
    }
    if (round) {
      parsedValue = Math.round(parsedValue);
    }
    if (percent) {
      parsedValue = `${parsedValue}%`;
    }

    return (
      <span className={classNames('number', className)} {...props}>
        {prefix && `${prefix} `}
        {parsedValue}
        {kcal && ` ${lang.kcal}`}
        {postfix && ` ${postfix}`}
      </span>
    );
  }
}

export default Number;
