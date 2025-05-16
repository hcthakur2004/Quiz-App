import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  Heading,
  Progress,
  useToast,
  Radio,
  RadioGroup,
  Flex,
  Badge,
  ScaleFade,
  keyframes,
  useColorModeValue,
  Circle,
  HStack,
  useColorMode,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const shine = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Ag", "Fe", "Au", "Cu"],
    correctAnswer: "Au"
  }
];

const QUESTION_TIME_LIMIT = 30; // seconds

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const grayBg = useColorModeValue("gray.100", "gray.700");
  const grayText = useColorModeValue("gray.600", "gray.300");
  const greenBg = useColorModeValue("green.50", "green.900");
  const redBg = useColorModeValue("red.50", "red.900");
  const blueBg = useColorModeValue("blue.50", "blue.900");

  useEffect(() => {
    setIsAnswered(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setIsTimerRunning(true);
  }, [currentQuestion]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0 && !isAnswered) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTotalTimeSpent(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswerSubmit(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerRunning, isAnswered]);

  const handleAnswerSubmit = (isTimeout: boolean = false) => {
    if (!selectedAnswer && !isTimeout) {
      toast({
        title: "Please select an answer",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsAnswered(true);
    setIsTimerRunning(false);
    
    // Record time taken for this question
    const timeTaken = QUESTION_TIME_LIMIT - timeLeft;
    setQuestionTimes(prev => [...prev, timeTaken]);

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

    if (isTimeout) {
      toast({
        title: "Time's up!",
        description: `The correct answer was ${questions[currentQuestion].correctAnswer}`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct! 🎉",
        description: "Well done!",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${questions[currentQuestion].correctAnswer}`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer("");
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setShowScore(false);
    setIsAnswered(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showScore) {
    const percentage = (score / questions.length) * 100;
    const message = 
      percentage === 100 ? "Perfect Score! You're Amazing! 🌟" :
      percentage >= 80 ? "Excellent Work! Almost Perfect! 🎉" :
      percentage >= 60 ? "Good Job! Keep Learning! 📚" :
      "Keep Practicing! You'll Get Better! 💪";

    const averageTime = Math.round(totalTimeSpent / questions.length);
    const fastestTime = Math.min(...questionTimes);
    const slowestTime = Math.max(...questionTimes);

    return (
      <ScaleFade initialScale={0.9} in={true}>
        <MotionBox
          bg={cardBg}
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
          textAlign="center"
          maxW="600px"
          mx="auto"
          position="relative"
          overflow="hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="4px"
            bgGradient={bgGradient}
            sx={{ animation: `${shine} 3s ease-in-out infinite` }}
          />
          
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Heading 
              mb={6} 
              bgGradient={bgGradient}
              bgClip="text"
              fontSize={{ base: "2xl", md: "4xl" }}
            >
              Quiz Completed! 🎉
            </Heading>
          </MotionBox>
          
          <MotionFlex
            direction="column"
            align="center"
            justify="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Circle
              size="150px"
              bg={percentage >= 60 ? "green.100" : "red.100"}
              mb={6}
              sx={{ animation: `${float} 3s ease-in-out infinite` }}
            >
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={percentage >= 60 ? "green.500" : "red.500"}
              >
                {percentage}%
              </Text>
            </Circle>

            <Text fontSize="2xl" mb={4} fontWeight="bold" color={textColor}>
              Score: {score}/{questions.length}
            </Text>
            
            <Text
              fontSize="xl"
              mb={8}
              color={grayText}
              sx={{ animation: `${float} 3s ease-in-out infinite` }}
            >
              {message}
            </Text>
          </MotionFlex>
          
          <VStack spacing={4} mt={6} p={4} bg={grayBg} borderRadius="lg">
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Time Statistics
            </Text>
            <HStack spacing={8} width="100%" justify="center">
              <VStack>
                <Text fontSize="sm" color={grayText}>Total Time</Text>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  {formatTime(totalTimeSpent)}
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="sm" color={grayText}>Average Time</Text>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  {formatTime(averageTime)}
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="sm" color={grayText}>Fastest</Text>
                <Text fontSize="xl" fontWeight="bold" color="green.500">
                  {formatTime(fastestTime)}
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="sm" color={grayText}>Slowest</Text>
                <Text fontSize="xl" fontWeight="bold" color="red.500">
                  {formatTime(slowestTime)}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            colorScheme="blue"
            size="lg"
            onClick={handleRetry}
            bgGradient={bgGradient}
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
            }}
            color="white"
            px={8}
            py={6}
            fontSize="xl"
            mt={6}
          >
            Try Again
          </Button>
        </MotionBox>
      </ScaleFade>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <MotionBox
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          bg={cardBg}
          p={{ base: 4, md: 8 }}
          borderRadius="xl"
          boxShadow="2xl"
          maxW="600px"
          mx="auto"
          position="relative"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Progress
              value={(timeLeft / QUESTION_TIME_LIMIT) * 100}
              size="sm"
              colorScheme={timeLeft < 10 ? "red" : "blue"}
              borderRadius="full"
              flex="1"
              mr={4}
            />
            <Tooltip label={`${colorMode === 'light' ? 'Dark' : 'Light'} mode`}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
          </Flex>

          <Progress
            value={(currentQuestion / questions.length) * 100}
            mb={6}
            borderRadius="lg"
            colorScheme="blue"
            hasStripe
            isAnimated
            bg={grayBg}
            h="8px"
          />

          <Flex justify="space-between" align="center" mb={6}>
            <HStack spacing={4}>
              <Badge
                colorScheme="blue"
                p={2}
                borderRadius="lg"
                fontSize="md"
                sx={{ animation: `${float} 3s ease-in-out infinite` }}
              >
                Question {currentQuestion + 1}/{questions.length}
              </Badge>
              <Badge
                colorScheme="green"
                p={2}
                borderRadius="lg"
                fontSize="md"
                sx={{ animation: `${float} 3s ease-in-out infinite 0.5s` }}
              >
                Score: {score}
              </Badge>
            </HStack>
            <Badge
              colorScheme={timeLeft < 10 ? "red" : "blue"}
              p={2}
              borderRadius="lg"
              fontSize="md"
              sx={{ animation: timeLeft < 10 ? `${pulse} 1s ease-in-out infinite` : undefined }}
            >
              Time: {timeLeft}s
            </Badge>
          </Flex>

          <Heading 
            size="lg" 
            mb={8} 
            lineHeight="1.4"
            bgGradient={bgGradient}
            bgClip="text"
            color={textColor}
          >
            {questions[currentQuestion].question}
          </Heading>

          <RadioGroup
            value={selectedAnswer}
            onChange={setSelectedAnswer}
            mb={8}
          >
            <VStack align="stretch" spacing={4}>
              {questions[currentQuestion].options.map((option, index) => (
                <MotionBox
                  key={option}
                  as="label"
                  cursor="pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Box
                    borderWidth="2px"
                    borderRadius="lg"
                    p={6}
                    transition="all 0.2s"
                    bg={
                      isAnswered
                        ? option === questions[currentQuestion].correctAnswer
                          ? greenBg
                          : selectedAnswer === option
                          ? redBg
                          : cardBg
                        : cardBg
                    }
                    borderColor={
                      isAnswered
                        ? option === questions[currentQuestion].correctAnswer
                          ? "green.400"
                          : selectedAnswer === option
                          ? "red.400"
                          : "gray.200"
                        : selectedAnswer === option
                        ? "blue.400"
                        : "gray.200"
                    }
                    _hover={{
                      borderColor: "blue.400",
                      bg: blueBg,
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                  >
                    <Radio
                      value={option}
                      size="lg"
                      colorScheme="blue"
                      isDisabled={isAnswered}
                    >
                      <Text 
                        fontSize={{ base: "md", md: "lg" }}
                        color={textColor}
                      >
                        {option}
                      </Text>
                    </Radio>
                  </Box>
                </MotionBox>
              ))}
            </VStack>
          </RadioGroup>

          <Button
            as={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            colorScheme="blue"
            size="lg"
            width="100%"
            onClick={() => handleAnswerSubmit()}
            bgGradient={bgGradient}
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
            }}
            height="60px"
            fontSize="lg"
            isDisabled={!selectedAnswer || isAnswered}
          >
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        </Box>
      </MotionBox>
    </AnimatePresence>
  );
};

export default Quiz; 