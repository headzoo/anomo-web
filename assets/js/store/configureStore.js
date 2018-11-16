import { createStore, applyMiddleware, compose } from 'redux';
import { batchActions, batchDispatchMiddleware } from 'redux-batched-actions';
import createRootReducer from 'reducers';
import thunk from 'redux-thunk';
import deepmerge from 'deepmerge';
import defaultState from 'store/defaultState';
import anomo from 'anomo';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

anomo.batch = (...actions) => {
  if (Array.isArray(actions[0])) {
    return batchActions(actions[0]);
  }
  return batchActions(actions);
};

/**
 * @param {*} initialState
 * @returns {Store<GenericStoreEnhancer>}
 */
export default function configureStore(initialState = {}) {
  return createStore(
    createRootReducer(),
    deepmerge(defaultState, initialState),
    composeEnhancers(
      applyMiddleware(batchDispatchMiddleware, thunk.withExtraArgument(anomo))
    )
  );
}
