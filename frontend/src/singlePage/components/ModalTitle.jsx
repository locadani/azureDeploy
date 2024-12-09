import { Typography } from '@mui/material';

export const ModalTitle = ({ title }) => (
  <Typography
    variant="h4"
    sx={{
      textAlign: 'center',
      marginTop: '0 !important',
      marginBottom: '20px',
    }}
  >
    {title}
  </Typography>
);
