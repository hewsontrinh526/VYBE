import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import styles from './Transition.module.css';

function TransitionWrap({ children }) {
  const location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames={{ enter: styles['fade-enter'], enterActive: styles['fade-enter-active'], exit: styles['fade-exit'], exitActive: styles['fade-exit-active'] }}
        timeout={300}>
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
}

export default TransitionWrap;