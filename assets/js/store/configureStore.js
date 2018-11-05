import { createStore, applyMiddleware, compose } from 'redux';
import createRootReducer from 'reducers';
import thunk from 'redux-thunk';
import deepmerge from 'deepmerge';
import defaultState from 'store/defaultState';
import anomo from 'anomo';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
 * @param {*} initialState
 * @returns {Store<GenericStoreEnhancer>}
 */
export default function configureStore(initialState = {}) {
  return createStore(
    createRootReducer(),
    deepmerge(defaultState, initialState),
    composeEnhancers(
      applyMiddleware(thunk.withExtraArgument(anomo))
    )
  );
}
