import React, { useState, useEffect, useRef } from 'react';

const DelayedColorPicker = ({ color, onChange }) => {
  const debounceTime = 100;
  const [internalColor, setInternalColor] = useState(color);
  const debounceTimeout = useRef(null);


  // added because when loading the color using the jsonfile, the uploaded color is not reflected here if there is not this useeffect
  useEffect(() => {
    if (color !== internalColor) {
      setInternalColor(color);
    }
  }, [color]);

  const handleChange = (e) => {
    const newColor = e.target.value;
    setInternalColor(newColor);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onChange(newColor);
    }, debounceTime);
  };

  useEffect(() => {
    // Clean up the timeout when the component is unmounted
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <input
      type="color"
      value={internalColor}
      onChange={handleChange}
      style={{
        width: '50px',
        height: '50px',
        border: 'none',
        cursor: 'pointer',
      }}
    />
  );
};

export default DelayedColorPicker;
