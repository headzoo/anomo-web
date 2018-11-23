import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Router } from 'react-router-dom';
import history from 'store/history';

/**
 * @param {*} children
 * @returns {*}
 */
export const renderComponent = (children) => {
  return TestRenderer.create(
    <Router history={history}>
      <div>
        {children}
      </div>
    </Router>
  );
};
