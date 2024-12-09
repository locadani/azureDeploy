import React from 'react';
import Box from '@mui/material/Box';
import { ZINDEX } from '../../helperFiles/constants';

const ClickableScreen = ({ selectedBackgroundColor, elementWasClicked }) => {
  // useful if you want to make some parts not clickable
  const commonBoxStyles = {
    position: 'absolute',
    bgcolor: 'rgba(255, 255, 255, 0.5)', // Optional styling
    zIndex: ZINDEX.CLICKABLE,
    cursor: 'default',
  };

  return (
    <Box
      className="clickable"
      onClick={elementWasClicked}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        bgcolor: selectedBackgroundColor,
      }}
    >
      {/* Exclude command area
      <Box
        sx={{
          bottom: 0,
          left: 0,
          width: '100%', // Adjust size as needed
          height: '80px',
          ...commonBoxStyles,
        }}
        onClick={(e) => e.stopPropagation()}
      />

      Exclude data area
      <Box
        sx={{
          top: 0,
          right: 0,
          width: '350px', // Adjust size as needed
          height: '60px',
          ...commonBoxStyles,
        }}
        onClick={(e) => e.stopPropagation()}
      />

      Right
      <Box
        sx={{
          top: 0,
          right: 0,
          width: '110px', // Adjust size as needed
          height: '100%',
          ...commonBoxStyles,
        }}
        onClick={(e) => e.stopPropagation()}
      ></Box>
       */}
    </Box>
  );
};

export default ClickableScreen;

// Usage:
// Import this component into your main file (e.g., index.js) and render it within your application.
