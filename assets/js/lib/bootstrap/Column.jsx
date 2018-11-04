import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 *
 */
class Column extends React.PureComponent {
  static propTypes = {
    xl:        PropTypes.number,
    lg:        PropTypes.number,
    md:        PropTypes.number,
    sm:        PropTypes.number,
    xs:        PropTypes.number,
    offsetXl:  PropTypes.number,
    offsetLg:  PropTypes.number,
    offsetMd:  PropTypes.number,
    offsetSm:  PropTypes.number,
    offsetXs:  PropTypes.number,
    hiddenXl:  PropTypes.bool,
    hiddenLg:  PropTypes.bool,
    hiddenMd:  PropTypes.bool,
    hiddenSm:  PropTypes.bool,
    hiddenXs:  PropTypes.bool,
    gutter:    PropTypes.bool,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    xl:        -1,
    lg:        -1,
    md:        -1,
    sm:        -1,
    xs:        -1,
    offsetXl:  -1,
    offsetLg:  -1,
    offsetMd:  -1,
    offsetSm:  -1,
    offsetXs:  -1,
    hiddenXl:  false,
    hiddenLg:  false,
    hiddenMd:  false,
    hiddenSm:  false,
    hiddenXs:  false,
    gutter:    true,
    className: '',
    children:  ''
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      xl,
      lg,
      md,
      sm,
      xs,
      offsetXl,
      offsetLg,
      offsetMd,
      offsetSm,
      offsetXs,
      hiddenXl,
      hiddenLg,
      hiddenMd,
      hiddenSm,
      hiddenXs,
      gutter,
      className,
      children,
      ...props
    } = this.props;

    const classes = classNames({
      column:                    true,
      'no-gutter':               !gutter,
      'd-none d-sm-block':       hiddenXs,
      'd-sm-none d-md-block':    hiddenSm,
      'd-md-none d-lg-block':    hiddenMd,
      'd-lg-none d-xl-block':    hiddenLg,
      'd-xl-none':               hiddenXl,
      'col-12':                  (xl === -1 && lg === -1 && md === -1 && sm === -1 && xs === -1),
      [`col-xl-${xl}`]:          xl !== -1,
      [`col-lg-${lg}`]:          lg !== -1,
      [`col-md-${md}`]:          md !== -1,
      [`col-sm-${sm}`]:          sm !== -1,
      [`col-${xs}`]:             xs !== -1,
      [`offset-xl-${offsetXl}`]: offsetXl !== -1,
      [`offset-lg-${offsetLg}`]: offsetLg !== -1,
      [`offset-md-${offsetMd}`]: offsetMd !== -1,
      [`offset-sm-${offsetSm}`]: offsetSm !== -1,
      [`offset-${offsetXs}`]:    offsetXs !== -1,
    }, className);

    return (
      <div className={classes} {...props}>
        {children}
      </div>
    );
  }
}

export default Column;
