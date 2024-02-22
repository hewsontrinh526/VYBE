/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import iro from '@jaames/iro';
import styles from './ColourWheel.module.css';

const ColourWheel = ({ onColourChange }) => {
  // attached to the div rendered by component
  // a DOM element to attach the colour wheel to
  const colourWheelRef = useRef(null);

  // initialise the colour wheel from iro.js
  useEffect(() => {
    const colourWheel = new iro.ColorPicker(colourWheelRef.current, {
      // options for iro.js here, change where needed:
      width: 600,
      color: "hsl(360, 90%, 50%)",
      layout: [
        {
          component: iro.ui.Wheel, // only the wheel
          options: {}
        },
      ]
  });
    // called whenever the user changes colour on the wheel
    colourWheel.on('color:change', onColourChange);

    return () => {
      colourWheel.off('color:change', onColourChange);
      if (colourWheelRef.current) {
        colourWheelRef.current.innerHTML = '';
      }
  }
}, [onColourChange]);

return <div ref={colourWheelRef} className={styles['colour-wheel']}></div>
};

export default ColourWheel;
