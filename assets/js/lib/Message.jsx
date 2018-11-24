import React from 'react';
import PropTypes from 'prop-types';
import { messages } from 'utils';

/**
 *
 */
class Message extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    tags: PropTypes.array
  };

  static defaultProps = {
    text: '',
    tags: []
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      parsed: messages.parseText(props.text, props.tags)
    };
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { text, tags } = this.props;

    if (text !== prevProps.text) {
      this.setState({ parsed: messages.parseText(text, tags) });
    }
  };

  /**
   * @returns {*}
   */
  render() {
    const { parsed } = this.state;

    return (
      <div>
        {parsed}
      </div>
    );
  }
}

export default Message;
