import React from 'react';

import { Box, Button } from '@mui/material';
import Stack from '@mui/material/Stack';

export function ModalRedBlueButtons({
  redButtonLabel,
  redButtonOnClickFunction,
  blueButtonLabel,
  blueButtonOnClickFunction,
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ width: '100%', marginTop: 2 }}
    >
      <Box>
        <Button
          variant="contained"
          color="error"
          onClick={redButtonOnClickFunction}
        >
          {redButtonLabel}
        </Button>
      </Box>
      <Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginLeft: 'auto' }}
          onClick={blueButtonOnClickFunction}
        >
          {blueButtonLabel}
        </Button>
      </Box>
    </Stack>
  );
}
