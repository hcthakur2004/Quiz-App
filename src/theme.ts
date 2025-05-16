import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Roboto', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '12px',
        fontWeight: '600',
      },
    },
    Radio: {
      baseStyle: {
        control: {
          borderRadius: '6px',
          _checked: {
            bg: 'blue.500',
            borderColor: 'blue.500',
          },
        },
      },
    },
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: 'linear-gradient(to right, #4299E1, #805AD5)',
        },
      },
    },
  },
});

export default theme; 