import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from 'lib';

/**
 *
 */
class Html extends React.PureComponent {
  static propTypes = {
    fetch:    PropTypes.func,
    children: PropTypes.string
  };

  static defaultProps = {
    fetch:    null,
    children: ''
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
   * @returns {*}
   */
  render() {
    const { fetch, children, ...props } = this.props;
    const { content, isLoading } = this.state;

    if (fetch) {
      if (isLoading) {
        return <Loading middle />;
      }
      return (
        <div dangerouslySetInnerHTML={{ __html: content }} {...props} />
      );
    }

    const __html = React.Children.map(children, (child) => {
      return child.toString();
    }).join(' ');

    return (
      <div dangerouslySetInnerHTML={{ __html }} {...props} />
    );
  }
}

export default Html;
