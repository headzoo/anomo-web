import React from 'react';

/**
 * @param {React.Component} WrappedComponent
 * @returns {string}
 */
function displayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
 * @param {*} children
 * @param {Function} cb
 */
function traverseChildren(children, cb) {
  React.Children.map(children, (child) => {
    if (child) {
      cb(child);
      if (child.props && child.props.children) {
        traverseChildren(child.props.children, cb);
      }
    }
  });
}

/**
 * @param {*} component
 * @param {string} unityFormType
 * @returns {boolean}
 */
function isFormType(component, unityFormType = '') {
  if (component.type === undefined || component.type.unityFormType === undefined) {
    return false;
  }
  if (unityFormType) {
    return component.type.unityFormType === unityFormType;
  }
  return true;
}

export default {
  displayName,
  traverseChildren,
  isFormType
};
