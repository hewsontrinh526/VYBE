/* eslint-disable */
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import iro from '@jaames/iro';
import styles from './ColourWheel.module.css';

const ColourWheel = ({ onColourChange, containerRef }) => {
  // attached to the div rendered by component
  // a DOM element to attach the colour wheel to
  const colourWheelRef = useRef(null);
  const [wheelSize, setWheelSize] = useState(300); // start with default size

  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // 500px on desktop, 300px on mobile
        // const maxCap = window.innerWidth > 768 ? 600 : 300;
        // make the wheel 80% as wide as its container but no more than second value
        // const size = Math.min(containerWidth * 0.8, maxCap);
        const newSize = Math.min(containerWidth * 0.8, 300);
        setWheelSize(newSize);
      }
    };

    // calls updateSize to set initial size
    updateSize();

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [containerRef]);

  // initialise the colour wheel from iro.js
  useEffect(() => {
    if (wheelSize > 0) {
      const colourWheel = new iro.ColorPicker(colourWheelRef.current, {
        // options for iro.js here, change where needed:
        width: wheelSize,
        color: "hsl(360, 90%, 100%)",
        layout: [
          {
            component: iro.ui.Wheel, // only the wheel
          },
        ]
      });

      // called whenever the user changes colour on the wheel
      colourWheel.on('color:change', (color) => {
        onColourChange(color.hsl);
      });

    return () => {
      colourWheel.off('color:change');
      if (colourWheelRef.current) {
        colourWheelRef.current.innerHTML = '';
      }
    };
  }
}, [onColourChange, wheelSize]);

return <div ref={colourWheelRef} className={styles['colour-wheel']}></div>
};

export default ColourWheel;
