import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'Lora',
      'sans-serif',
    ].join(','),
    h4: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 600, // Use a lighter weight
      fontSize: '1.75rem', // Slightly smaller font size
      lineHeight: 1.2,
    },
    body1: {
      fontFamily: 'Lora, sans-serif',
      fontWeight: 400, // Normal weight for body text
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 600, // Use a lighter weight
      fontSize: '1.125rem', // Smaller font size
    },
    subtitle1: {
      fontFamily: 'Lora, sans-serif',
      fontWeight: 400, // Normal weight for subtitles
      fontSize: '0.875rem',
    },
  },
});

export default theme;
