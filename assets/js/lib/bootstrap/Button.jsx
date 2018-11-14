import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import objects from 'utils/objects';
import themes from 'lib/bootstrap/themes';
import { Icon, Loading } from 'lib';
import ButtonGroupContext from 'context/buttonGroupContext';

/**
 *
 */
class Button extends React.PureComponent {
  static propTypes = {
    theme:     PropTypes.oneOf(themes),
    block:     PropTypes.bool,
    lg:        PropTypes.bool,
    sm:        PropTypes.bool,
    icon:      PropTypes.string,
    type:      PropTypes.string,
    loading:   PropTypes.bool,
    className: PropTypes.string,
    disabled:  PropTypes.bool,
    children:  PropTypes.node,
    onClick:   PropTypes.func
  };

  static defaultProps = {
    theme:     themes[0],
    block:     false,
    lg:        false,
    sm:        false,
    loading:   false,
    type:      'submit',
    icon:      '',
    className: '',
    disabled:  false,
    children:  '',
    onClick:   () => {}
  };

  /**
   * @returns {*}
   */
  render() {
    const { theme, block, type, lg, sm, icon, loading, disabled, className, children, onClick, ...props } = this.props;

    return (
      <ButtonGroupContext.Consumer>
        {(context) => {
          const btnTheme = (context.theme && context.theme !== 'none') ? context.theme : theme;
          const classes = classNames(`btn btn-${btnTheme}`, className, {
            'btn-block': block,
            'btn-lg':    lg,
            'btn-sm':    sm
          });

          return (
            <button
              type={type}
              onClick={onClick}
              disabled={disabled}
              className={classes}
              {...objects.propsFilter(props, Button.propTypes)}
            >
              {(icon && !loading) && (
                <Icon name={icon} />
              )}
              {loading ? (
                <Loading color="#FFF" style={{ margin: 3 }} />
              ) : (
                children
              )}
            </button>
          );
        }}
      </ButtonGroupContext.Consumer>
    );
  }
}

export default Button;
