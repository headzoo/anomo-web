import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup } from 'lib/forms';
import { Button } from 'lib/bootstrap';
import { Number } from 'lib';

/**
 *
 */
class Poll extends React.PureComponent {
  static propTypes = {
    poll:     PropTypes.object.isRequired,
    onAnswer: PropTypes.func
  };

  static defaultProps = {
    onAnswer: () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      panel:   props.poll.IsAnswerPoll === '0' ? 'questions' : 'results',
      checked: '0'
    };
  }

  /**
   * @param {*} prevProps
   */
  componentDidUpdate = (prevProps) => {
    const { poll } = this.props;

    if (prevProps.poll.IsAnswerPoll !== poll.IsAnswerPoll) {
      const panel = poll.IsAnswerPoll === '0' ? 'questions' : 'results';
      this.setState({ panel });
    }
  };

  /**
   * @param {Event} e
   * @param {string} checked
   */
  handleAnswerChange = (e, checked) => {
    const { onAnswer } = this.props;

    e.stopPropagation();
    onAnswer(e, checked);
    if (!e.defaultPrevented) {
      e.preventDefault();
      this.setState({
        panel: 'results',
        checked
      });
    }
  };

  /**
   * @param {Event} e
   */
  handleResultsClick = (e) => {
    e.stopPropagation();
    this.setState({ panel: 'results' });
  };

  /**
   * @returns {*}
   */
  renderQuestions = () => {
    const { poll } = this.props;
    const { checked } = this.state;

    const values = poll.Answer.map(a => (
      { value: a.PollAnswerID, label: a.Answer }
    ));

    return (
      <div className="activity-poll">
        <RadioGroup
          value={checked}
          values={values}
          id="activity-poll-questions"
          onChange={this.handleAnswerChange}
        />
        <div className="gutter-top">
          <Button onClick={this.handleResultsClick}>
            View Results
          </Button>
        </div>
      </div>
    );
  };

  /**
   * @returns {*}
   */
  renderResults = () => {
    const { poll } = this.props;

    return (
      <div className="activity-poll">
        {poll.Answer.map(a => (
          <div className="activity-poll-result" key={a.PollAnswerID}>
            <Number value={parseFloat(a.Percent)} percent />
            <div>{a.Answer}</div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    const { panel } = this.state;

    if (panel === 'questions') {
      return this.renderQuestions();
    }
    return this.renderResults();
  }
}

export default Poll;
