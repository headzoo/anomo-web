import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row, Column, Table, ButtonGroup, Button } from 'lib/bootstrap';
import { Icon, types } from 'lib';
import { dates, objects, lang } from 'utils';

/**
 *
 */
class Calendar extends React.PureComponent {
  static propTypes = {
    selected: types.calendarDate,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    selected: {},
    onSelect: () => {}
  };

  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      calendar: dates.getCalendar()
    };
  }

  /**
   * @param {Event} e
   * @param {string} which
   */
  handleMonthClick = (e, which) => {
    const { calendar } = this.state;

    let date = new Date(calendar.year, calendar.month - 1, 1);
    if (which === 'prev') {
      date = new Date(date.setMonth(date.getMonth() - 1));
    } else {
      date = new Date(date.setMonth(date.getMonth() + 1));
    }

    this.setState({
      calendar: dates.getCalendar(dates.getYear(date), dates.getMonth(date))
    });
  };

  /**
   * @returns {*}
   */
  renderHead = () => {
    const { calendar } = this.state;

    return (
      <thead>
        <tr>
          <th className="calendar-buttons" colSpan={7}>
            <ButtonGroup>
              <Button theme="link" onClick={e => this.handleMonthClick(e, 'prev')}>
                <Icon name="chevron-left" />
              </Button>
              <Button theme="link">
                {lang.monthsLong[calendar.month - 1]} {calendar.year}
              </Button>
              <Button theme="link" onClick={e => this.handleMonthClick(e, 'next')}>
                <Icon name="chevron-right" />
              </Button>
            </ButtonGroup>
          </th>
        </tr>
        <tr className="calendar-weekdays">
          <th>
            {lang.weekdaysShort[0]}
          </th>
          <th>
            {lang.weekdaysShort[1]}
          </th>
          <th>
            {lang.weekdaysShort[2]}
          </th>
          <th>
            {lang.weekdaysShort[3]}
          </th>
          <th>
            {lang.weekdaysShort[4]}
          </th>
          <th>
            {lang.weekdaysShort[5]}
          </th>
          <th>
            {lang.weekdaysShort[6]}
          </th>
        </tr>
      </thead>
    );
  };

  /**
   * @returns {*}
   */
  renderBody = () => {
    const { selected, onSelect } = this.props;
    const { calendar } = this.state;
    const { year, month } = calendar;

    const cYear  = dates.getYear();
    const cMonth = dates.getMonth();
    const cDay   = dates.getDayOfMonth();

    return (
      <tbody>
        {calendar.weeks.map((week, i) => (
          <tr key={i}>
            {week.map((day, y) => {
              const classes = classNames({
                'calendar-muted':    (year !== day.year) || (month !== day.month),
                'calendar-today':    (cYear === day.year) && (cMonth === day.month) && (cDay === day.day),
                'calendar-selected': objects.isEqual(selected, day)
              });

              return (
                <td
                  key={y}
                  className={classes}
                  onClick={e => onSelect(e, day)}
                  data-day={`${day.year}-${day.month}-${day.day}`}
                >
                  {day.day}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  };

  /**
   * @returns {*}
   */
  render() {
    return (
      <Row>
        <Column>
          <div className="table-wrapper table-bordered-wrapper">
            <Table className="calendar">
              {this.renderHead()}
              {this.renderBody()}
            </Table>
          </div>
        </Column>
      </Row>
    );
  }
}

export default Calendar;
