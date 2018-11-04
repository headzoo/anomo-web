import PropTypes from 'prop-types';

const {
  shape,
  number,
  string,
  object,
  array,
  boolean,
  arrayOf,
  oneOfType
} = PropTypes;

/**
 *
 */
export const image = shape({
  src: string,
  alt: string
});

/**
 *
 */
export const ui = shape({
  deviceSize:   string,
  errorMessage: string,
  errorInfo:    object
});

/**
 *
 */
export const option = shape({
  value: oneOfType([string, number]).isRequired,
  label: string.isRequired
});

/**
 *
 */
export const options = arrayOf(option);

/**
 *
 */
export const calendarDate = shape({
  year:  number,
  month: number,
  day:   number
});

/**
 *
 */
export const entry = shape({
  id:        number.isRequired,
  memberId:  number.isRequired,
  label:     string.isRequired,
  unit:      string.isRequired,
  amount:    number.isRequired,
  nutrients: object.isRequired
});

/**
 *
 */
export const entries = arrayOf(entry);

/**
 *
 */
export const meal = shape({
  id:    number.isRequired,
  label: string.isRequired,
  entries
});

/**
 *
 */
export const meals = arrayOf(meal);

/**
 *
 */
export const diary = shape({
  meals,
  selectedDate:     calendarDate,
  selectedMeal:     number,
  foodModalVisible: boolean
});

/**
 *
 */
export const foods = shape({
  list: array
});

/**
 *
 */
export const clipboard = shape({
  copied:   array,
  selected: array
});

/**
 *
 */
export const member = shape({
  'id':     number,
  'label':  string,
  'avatar': image
});

/**
 *
 */
export const members = shape({
  list:          arrayOf(member),
  defaultMember: member,
  selected:      number,
  isLoading:     boolean
});

export default {
  ui,
  diary,
  entries,
  entry,
  meal,
  meals,
  foods,
  member,
  members,
  calendarDate,
  clipboard,
  option,
  options
};
