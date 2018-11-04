import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { objectClone } from 'utils/objects';

export { connect };

/**
 * @param {...string} props
 * @returns {function(*)}
 */
export function mapStateToProps(...props) {
  return (state) => {
    const mapped = {};
    for (let i = 0; i < props.length; i++) {
      mapped[props[i]] = objectClone(state[props[i]]);
    }

    return mapped;
  };
}

/**
 * @param {*} actions
 * @returns {function(*)}
 */
export function mapActionsToProps(...actions) {
  const mapped = {};
  for (let i = 0; i < actions.length; i++) {
    const keys = Object.keys(actions[i]);
    for (let y = 0; y < keys.length; y++) {
      const key = keys[y];
      mapped[key] = actions[i][key];
    }
  }

  return (dispatch) => {
    return bindActionCreators(mapped, dispatch);
  };
}
