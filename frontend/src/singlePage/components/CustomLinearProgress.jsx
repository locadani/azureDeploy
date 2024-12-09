import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { DEFAULTVALUES, progressBarWidth } from '../../helperFiles/constants';

export function CustomLinearProgress({ value, color }) {
  // Convert the input value range of -100 to 100 into 0 to 100
  const normalizedValue = Math.abs(value);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ width: '100%' }}
    >
      <Box
        display="flex"
        justifyContent="center" // Ensure the LinearProgress is centered horizontally
        sx={{
          width: '100%',
        }}
      >
        <LinearProgress
          variant="determinate"
          value={normalizedValue}
          sx={{
            width: progressBarWidth,
            height: '10px',
            backgroundColor: DEFAULTVALUES.GREY,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export const PROGRESSBARLOGIC = Object.freeze({
  NOTVISIBLE: 0,
  SUMTOMAX: 1,
});

export const INFORMATIONLOCATIONPROGRESSBAR = Object.freeze({
  SELECTEDLOGIC: 0,
  MAXVALUE: 1,
});
