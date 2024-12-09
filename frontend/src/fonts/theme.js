// theme.js
import { createTheme } from '@mui/material/styles';

const kpmgTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e49e2',
      light: '#00b8f5',
      dark: '#00338d',
    },
    secondary: {
      main: '#ab0d82',
    },
  },
  typography: {
    fontFamily: "'kpmgbold', sans-serif",
    subtitle1: {
      fontSize: '1.2rem',
    },
    subtitle2: {
      fontSize: '1.1rem',
    },
    button: {
      fontSize: '1.1rem',
    },
    fontSize: 15,
  },
});

export default kpmgTheme;
