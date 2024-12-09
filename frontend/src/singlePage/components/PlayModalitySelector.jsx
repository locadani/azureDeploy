import React from 'react';
import Box from '@mui/material/Box';
import { PLAYMODALITYSELECTION } from '../../helperFiles/constants';
import { FormControl, MenuItem, Select } from '@mui/material';

export const PlayModalitySelector = ({
  selectedPlayModality,
  setSelectedPlayModality,
  theme,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1, // Space between the label and the Select component
        borderBottom: '2px solid black',
      }}
    >
      <FormControl
        sx={{
          width: '85px',
        }}
      >
        <Select
          value={selectedPlayModality}
          disableUnderline
          onChange={(event) => {
            setSelectedPlayModality(event.target.value);
          }}
          variant="standard"
          sx={{
            margin: 0,
            padding: 0,
            fontSize: theme.typography.h6.fontSize,
            '& .MuiSelect-select': {
              padding: '4px 8px',
            },
          }}
        >
          <MenuItem value={PLAYMODALITYSELECTION.CIRCLES}>Pallini</MenuItem>
          <MenuItem value={PLAYMODALITYSELECTION.LINES}>Scie</MenuItem>
          <MenuItem value={PLAYMODALITYSELECTION.VARIANTS}>Varianti</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
