import React from 'react';

/**
 * @param {React.Component} WrappedComponent
 * @returns {string}
 */
export function reactDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
 * @param {*} children
 * @param {Function} cb
 */
export function reactTraverseChildren(children, cb) {
  React.Children.map(children, (child) => {
    if (child) {
      cb(child);
      if (child.props && child.props.children) {
        reactTraverseChildren(child.props.children, cb);
      }
    }
  });
}

/**
 * @param {*} component
 * @param {string} unityFormType
 * @returns {boolean}
 */
export function reactIsFormType(component, unityFormType = '') {
  if (component.type === undefined || component.type.unityFormType === undefined) {
    return false;
  }
  if (unityFormType) {
    return component.type.unityFormType === unityFormType;
  }
  return true;
}

export default {
  displayName:      reactDisplayName,
  traverseChildren: reactTraverseChildren,
  isFormType:       reactIsFormType
};
