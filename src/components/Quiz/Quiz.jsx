import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, XCircle, Clock, Award, ChevronRight, RotateCcw } from 'lucide-react';
import { Context } from '../../context/Context';
import './Quiz.css';

const Quiz = ({ topic, generatedQuiz, onClose, onComplete }) => {
  const { isDark } = useContext(Context);
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // Default 10 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false);

  // Sample quiz questions based on topic
  const quizQuestions = {
    Variables: [
      {
        question: "What is a variable in programming?",
        options: [
          "A fixed value that cannot change",
          "A storage location with a name and value",
          "A function that returns a value",
          "A loop structure"
        ],
        correctAnswer: 1
      },
      {
        question: "Which of the following is a valid variable name?",
        options: ["2ndVariable", "my-variable", "myVariable", "my variable"],
        correctAnswer: 2
      },
      {
        question: "What is variable initialization?",
        options: [
          "Declaring a variable without a value",
          "Assigning a value to a variable for the first time",
          "Deleting a variable",
          "Printing a variable"
        ],
        correctAnswer: 1
      },
      {
        question: "Which data type would you use to store 'Hello World'?",
        options: ["int", "float", "string", "boolean"],
        correctAnswer: 2
      },
      {
        question: "What happens when you use a variable before declaring it?",
        options: [
          "It works fine",
          "It causes a compilation error",
          "It creates the variable automatically",
          "Nothing happens"
        ],
        correctAnswer: 1
      }
    ],
    Loops: [
      {
        question: "What is the purpose of a loop in programming?",
        options: [
          "To execute code once",
          "To repeat a block of code multiple times",
          "To define a variable",
          "To create a function"
        ],
        correctAnswer: 1
      },
      {
        question: "Which loop checks the condition before executing?",
        options: ["do-while loop", "while loop", "infinite loop", "nested loop"],
        correctAnswer: 1
      },
      {
        question: "What is an infinite loop?",
        options: [
          "A loop that runs very fast",
          "A loop that never terminates",
          "A loop inside another loop",
          "A loop with no code inside"
        ],
        correctAnswer: 1
      },
      {
        question: "Which keyword is used to exit a loop prematurely?",
        options: ["exit", "break", "stop", "end"],
        correctAnswer: 1
      },
      {
        question: "What does the 'continue' statement do in a loop?",
        options: [
          "Exits the loop",
          "Skips to the next iteration",
          "Pauses the loop",
          "Restarts the loop"
        ],
        correctAnswer: 1
      }
    ],
    Functions: [
      {
        question: "What is a function in programming?",
        options: [
          "A type of variable",
          "A reusable block of code",
          "A loop structure",
          "A conditional statement"
        ],
        correctAnswer: 1
      },
      {
        question: "What is the purpose of function parameters?",
        options: [
          "To store the return value",
          "To pass data into the function",
          "To end the function",
          "To declare variables"
        ],
        correctAnswer: 1
      },
      {
        question: "What does the 'return' keyword do?",
        options: [
          "Starts the function",
          "Ends the function and optionally sends back a value",
          "Creates a loop",
          "Declares a variable"
        ],
        correctAnswer: 1
      },
      {
        question: "What is function recursion?",
        options: [
          "A function calling itself",
          "A function inside a loop",
          "Two functions calling each other",
          "A function with no return value"
        ],
        correctAnswer: 0
      },
      {
        question: "What is a function signature?",
        options: [
          "The function's return value",
          "The function's name, parameters, and return type",
          "The function's body",
          "The function's comments"
        ],
        correctAnswer: 1
      }
    ],
    Arrays: [
      {
        question: "What is an array?",
        options: [
          "A single variable",
          "A collection of elements of the same type",
          "A function",
          "A loop"
        ],
        correctAnswer: 1
      },
      {
        question: "What is the index of the first element in an array?",
        options: ["1", "0", "-1", "Depends on the language"],
        correctAnswer: 1
      },
      {
        question: "How do you access the third element of an array named 'arr'?",
        options: ["arr[3]", "arr[2]", "arr(3)", "arr(2)"],
        correctAnswer: 1
      },
      {
        question: "What happens when you access an array index that doesn't exist?",
        options: [
          "Returns null or undefined",
          "Creates a new element",
          "Deletes the array",
          "Nothing happens"
        ],
        correctAnswer: 0
      },
      {
        question: "What is a multidimensional array?",
        options: [
          "An array with multiple data types",
          "An array of arrays",
          "A very large array",
          "An array with functions"
        ],
        correctAnswer: 1
      }
    ],
    Pointers: [
      {
        question: "What is a pointer?",
        options: [
          "A variable that stores a value",
          "A variable that stores a memory address",
          "A function",
          "A loop"
        ],
        correctAnswer: 1
      },
      {
        question: "What operator is used to get the address of a variable?",
        options: ["*", "&", "@", "#"],
        correctAnswer: 1
      },
      {
        question: "What is dereferencing a pointer?",
        options: [
          "Deleting a pointer",
          "Accessing the value at the pointer's address",
          "Creating a new pointer",
          "Comparing two pointers"
        ],
        correctAnswer: 1
      },
      {
        question: "What is a NULL pointer?",
        options: [
          "A pointer with a value of zero",
          "A pointer that points to nothing",
          "A deleted pointer",
          "An invalid pointer"
        ],
        correctAnswer: 1
      },
      {
        question: "What is pointer arithmetic?",
        options: [
          "Adding values to pointers",
          "Mathematical operations on pointer addresses",
          "Multiplying pointers",
          "Dividing memory"
        ],
        correctAnswer: 1
      }
    ],
    Structures: [
      {
        question: "What is a structure in C?",
        options: [
          "A loop",
          "A user-defined data type that groups variables",
          "A function",
          "An array"
        ],
        correctAnswer: 1
      },
      {
        question: "How do you access a structure member?",
        options: [
          "Using the -> operator",
          "Using the . operator",
          "Using brackets []",
          "Both A and B depending on context"
        ],
        correctAnswer: 3
      },
      {
        question: "Can a structure contain different data types?",
        options: [
          "No, only same types",
          "Yes, it can contain different data types",
          "Only integers and floats",
          "Only strings"
        ],
        correctAnswer: 1
      },
      {
        question: "What is a nested structure?",
        options: [
          "A structure inside a loop",
          "A structure that contains another structure",
          "Multiple structures in an array",
          "A structure with functions"
        ],
        correctAnswer: 1
      },
      {
        question: "How is memory allocated for a structure?",
        options: [
          "Sum of all member sizes",
          "Size may include padding for alignment",
          "Always fixed at 8 bytes",
          "Based on the first member only"
        ],
        correctAnswer: 1
      }
    ],
    Recursion: [
      {
        question: "What is recursion?",
        options: [
          "A loop that runs forever",
          "A function that calls itself",
          "A nested loop",
          "A type of variable"
        ],
        correctAnswer: 1
      },
      {
        question: "What is a base case in recursion?",
        options: [
          "The first recursive call",
          "The condition that stops recursion",
          "The recursive function's name",
          "The return value"
        ],
        correctAnswer: 1
      },
      {
        question: "What happens without a base case?",
        options: [
          "The function works normally",
          "Infinite recursion and stack overflow",
          "The function returns null",
          "Compilation error"
        ],
        correctAnswer: 1
      },
      {
        question: "Which is a classic example of recursion?",
        options: [
          "Calculating factorial",
          "Linear search",
          "Bubble sort",
          "Variable declaration"
        ],
        correctAnswer: 0
      },
      {
        question: "What is tail recursion?",
        options: [
          "The last function in a program",
          "When recursive call is the last operation",
          "Recursion with multiple base cases",
          "Recursion inside a loop"
        ],
        correctAnswer: 1
      }
    ],
    "File Handling": [
      {
        question: "What is file handling?",
        options: [
          "Deleting files",
          "Reading from and writing to files",
          "Creating folders",
          "Renaming files"
        ],
        correctAnswer: 1
      },
      {
        question: "Which mode opens a file for reading?",
        options: ["'w'", "'r'", "'a'", "'x'"],
        correctAnswer: 1
      },
      {
        question: "What does the 'w' mode do?",
        options: [
          "Opens for reading",
          "Opens for writing (overwrites existing content)",
          "Opens for appending",
          "Opens in binary mode"
        ],
        correctAnswer: 1
      },
      {
        question: "What happens if you try to read a file that doesn't exist?",
        options: [
          "Creates a new file",
          "Returns an error",
          "Returns empty string",
          "Program crashes"
        ],
        correctAnswer: 1
      },
      {
        question: "Why is it important to close a file after use?",
        options: [
          "It's not important",
          "To free resources and ensure data is written",
          "To delete the file",
          "To lock the file"
        ],
        correctAnswer: 1
      }
    ]
  };

  // Use generated quiz if available, otherwise use static questions
  const questions = React.useMemo(() => {
    if (generatedQuiz && generatedQuiz.generated_quiz) {
      // Transform API quiz format to component format
      return generatedQuiz.generated_quiz.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: null, // We don't have correct answers from API yet
        question_id: q.question_id
      }));
    }
    return quizQuestions[topic] || quizQuestions.Variables;
  }, [generatedQuiz, topic]);

  // Set time limit based on number of questions (2 minutes per question)
  React.useEffect(() => {
    if (generatedQuiz && generatedQuiz.generated_quiz) {
      const timeInMinutes = generatedQuiz.generated_quiz.length * 2;
      setTimeLeft(timeInMinutes * 60);
    }
  }, [generatedQuiz]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  // Finish quiz and calculate score
  const handleFinishQuiz = (finalAnswers = answers) => {
    const calculatedScore = finalAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    setScore(calculatedScore);
    setShowResult(true);
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete({
        topic,
        score: calculatedScore,
        total: questions.length,
        percentage: Math.round((calculatedScore / questions.length) * 100),
        timeTaken: 600 - timeLeft
      });
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer');
      return;
    }

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleFinishQuiz(newAnswers);
    }
  };

  // Timer effect
  useEffect(() => {
    if (quizStarted && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleFinishQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, quizStarted, showResult]);

  // Restart quiz
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setScore(0);
    setTimeLeft(600);
    setQuizStarted(false);
  };

  // Start screen
  if (!quizStarted) {
    return (
      <div className={`min-h-[500px] ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <Award className={`w-20 h-20 mx-auto ${isDark ? 'text-amber-500' : 'text-amber-600'}`} />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {topic} Quiz
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Test your knowledge on {topic}. You'll have 10 minutes to complete {questions.length} questions.
          </p>
          
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-6 mb-8`}>
            <div className="grid grid-cols-2 gap-6 text-left">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Questions</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{questions.length}</p>
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Time Limit</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>10 mins</p>
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Passing Score</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>60%</p>
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Difficulty</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Medium</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleStartQuiz}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
            >
              Start Quiz
            </button>
            <button
              onClick={onClose}
              className={`px-8 py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} rounded-lg font-semibold transition-colors`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className={`min-h-[500px] ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            {passed ? (
              <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 mx-auto text-red-500" />
            )}
          </div>
          
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            You scored {score} out of {questions.length} ({percentage}%)
          </p>

          <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-6 mb-8`}>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Your Score</span>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{percentage}%</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full h-4`}>
                <div
                  className={`h-4 rounded-full ${passed ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mt-6">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Correct</p>
                <p className={`text-2xl font-bold text-green-500`}>{score}</p>
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Wrong</p>
                <p className={`text-2xl font-bold text-red-500`}>{questions.length - score}</p>
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Time</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatTime(600 - timeLeft)}
                </p>
              </div>
            </div>
          </div>

          {/* Review answers */}
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-6 mb-8 text-left`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Review Answers</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {questions.map((q, index) => (
                <div key={index} className={`p-3 rounded ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
                  <div className="flex items-start space-x-2">
                    {answers[index] === q.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Q{index + 1}: {q.question}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your answer: {q.options[answers[index]]}
                      </p>
                      {answers[index] !== q.correctAnswer && (
                        <p className="text-xs text-green-500">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleRestartQuiz}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={onClose}
              className={`px-8 py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-900'} rounded-lg font-semibold transition-colors`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz question screen
  const currentQ = questions[currentQuestion];

  return (
    <div className={`min-h-[500px] ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2 rounded-lg`}>
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Question {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className={`flex items-center space-x-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2 rounded-lg`}>
            <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm font-semibold ${timeLeft < 60 ? 'text-red-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Exit Quiz
        </button>
      </div>

      {/* Progress bar */}
      <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-8`}>
        <div
          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : isDark
                  ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? 'border-amber-500 bg-amber-500'
                      : isDark
                      ? 'border-gray-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedAnswer === index && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {option}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
            selectedAnswer === null
              ? 'bg-gray-400 cursor-not-allowed text-gray-600'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          <span>{currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Quiz;
