import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { strings, objects } from 'utils';
import { Loading } from 'lib';

/**
 *
 */
class Text extends React.PureComponent {
  static propTypes = {
    p:         PropTypes.bool,
    lg:        PropTypes.bool,
    sm:        PropTypes.bool,
    left:      PropTypes.bool,
    center:    PropTypes.bool,
    right:     PropTypes.bool,
    justify:   PropTypes.bool,
    inline:    PropTypes.bool,
    dim:       PropTypes.bool,
    nl2p:      PropTypes.bool,
    ucwords:   PropTypes.bool,
    fetch:     PropTypes.func,
    className: PropTypes.string,
    children:  PropTypes.node
  };

  static defaultProps = {
    p:         false,
    lg:        false,
    sm:        false,
    left:      false,
    center:    false,
    right:     false,
    justify:   false,
    inline:    false,
    dim:       false,
    nl2p:      false,
    ucwords:   false,
    fetch:     null,
    className: '',
    children:  ''
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      content:   null,
      isLoading: !!props.fetch
    };
  }

  /**
   * Called after the component mounts
   */
  componentDidMount() {
    const { fetch } = this.props;

    if (fetch) {
      fetch()
        .then((content) => {
          this.setState({ content, isLoading: false });
        })
        .catch(() => {
          this.setState({ content: '', isLoading: false });
        });
    }
  }

  /**
   * @param {string} text
   * @returns {string}
   */
  formatText = (text) => {
    const { ucwords, nl2p } = this.props;
    let formatted = text;

    if (ucwords) {
      formatted = strings.ucWords(formatted);
    }
    if (nl2p) {
      formatted = formatted.split('\n').map((item, key) => {
        return <p key={key}>{item}</p>;
      });
    }

    return formatted;
  };

  /**
   * @returns {*}
   */
  render() {
    const {
      p,
      lg,
      sm,
      dim,
      left,
      fetch,
      right,
      center,
      inline,
      justify,
      className,
      children,
      ...props
    } = this.props;
    const { content, isLoading } = this.state;

    let text;
    if (fetch) {
      if (isLoading) {
        return <Loading middle />;
      }
      text = content;
    } else {
      text = React.Children.toArray(children).join(' ');
    }

    const classes = classNames(className, {
      'text-lg':      lg,
      'text-sm':      sm,
      'text-left':    left,
      'text-center':  center,
      'text-right':   right,
      'text-justify': justify,
      'inline':       inline,
      'dim':          dim,
      'text':         true
    });

    return React.createElement(p ? 'p' : 'div', {
      className: classes,
      ...objects.propsFilter(props, Text.propTypes)
    }, this.formatText(text));
  }
}

export default Text;
