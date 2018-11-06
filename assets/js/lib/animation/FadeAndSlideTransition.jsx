import React from 'react';
import Transition from 'react-transition-group/Transition';

/**
 *
 */
const FadeAndSlideTransition = ({ children, duration, in: inProp }) => {
  const defaultStyle = {
    transition:         `${duration}ms ease-in`,
    transitionProperty: 'opacity, transform'
  };

  const transitionStyles = {
    entering: {
      opacity:   0,
      transform: 'translateY(-10%)'
    },
    entered: {
      opacity:   1,
      transform: 'translateY(0)'
    },
    exiting: {
      opacity:   0,
      transform: 'translateY(-10%)'
    }
  };

  const timeout = {
    enter: 0,
    exit:  duration
  };

  return (
    <Transition in={inProp} timeout={timeout}>
      {(status) => {
        if (status === 'exited') {
          return null;
        }

        return React.cloneElement(children, {
          style: Object.assign({}, defaultStyle, transitionStyles[status])
        });
      }}
    </Transition>
  );
};

export default FadeAndSlideTransition;
