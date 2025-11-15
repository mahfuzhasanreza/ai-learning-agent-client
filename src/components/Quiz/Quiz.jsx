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
    if (!showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleFinishQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, showResult]);

  // Restart quiz
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setScore(0);
    setTimeLeft(600);
  };

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
