import React from 'react';
import { ChakraProvider, Box, Container } from '@chakra-ui/react';
import Quiz from './components/Quiz';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box
        minH="100vh"
        bgGradient="linear(to-br, blue.50, purple.50)"
        position="relative"
        py={{ base: 4, md: 10 }}
        px={{ base: 2, md: 4 }}
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgImage: "radial-gradient(circle at 1px 1px, blue.100 1px, transparent 0)",
          bgSize: { base: "20px 20px", md: "40px 40px" },
          opacity: 0.4,
          pointerEvents: "none",
        }}
        sx={{
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "150%",
            height: "150%",
            background: "radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.9) 100%)",
            pointerEvents: "none",
          }
        }}
      >
        <Container 
          maxW="container.md" 
          position="relative"
          px={{ base: 2, md: 4 }}
        >
          <Quiz />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
