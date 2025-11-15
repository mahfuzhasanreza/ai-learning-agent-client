import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Award, ChevronRight, RotateCcw } from 'lucide-react';
import './Quiz.css';

const Quiz = ({ topic, generatedQuiz, onClose, onComplete }) => {
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // Default 10 minutes in seconds
  const [quizResult, setQuizResult] = useState(null); // Store API response
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

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
  }, [generatedQuiz]);

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
  const handleFinishQuiz = async (finalAnswers = answers) => {
    setSubmittingQuiz(true);
    
    try {
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      
      // Prepare answers in the required format
      const formattedAnswers = finalAnswers.map((selectedIndex, index) => ({
        question_id: questions[index].question_id,
        selected_index: selectedIndex
      }));
      
      const response = await fetch(
        `${baseUrl}/api/v1/performance/submit_quiz`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: STUDENT_ID,
            quiz_id: generatedQuiz.quiz_id,
            answers: formattedAnswers
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store the API response
      setQuizResult(data);
      setScore(data.marks || 0);
      setShowResult(true);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete({
          topic,
          score: data.marks,
          total: data.full_marks,
          percentage: data.percentage,
          timeTaken: 600 - timeLeft
        });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      // Save current answer before going back
      if (selectedAnswer !== null && answers.length === currentQuestion) {
        const newAnswers = [...answers, selectedAnswer];
        setAnswers(newAnswers);
      }
      
      setCurrentQuestion(currentQuestion - 1);
      // Restore the previous answer
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer');
      return;
    }

    // Update or add the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Check if there's already an answer for the next question
      setSelectedAnswer(newAnswers[currentQuestion + 1] ?? null);
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
    setQuizResult(null);
    setTimeLeft(600);
    
    // Close and let parent component handle new quiz generation
    onClose();
  };

  // Results screen
  if (showResult && quizResult) {
    const percentage = quizResult.percentage || 0;
    const passed = percentage >= 60;

    return (
      <div className="min-h-[500px] max-h-[90vh] bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl overflow-y-auto scrollbar-hide">
        <div className="max-w-3xl mx-auto">
          {/* Score Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              {passed ? (
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/50">
                  <XCircle className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            
            <p className="text-xl mb-6 text-gray-300">
              You scored <span className="font-bold text-[#FF4B00]">{quizResult.marks}</span> out of <span className="font-bold">{quizResult.full_marks}</span> ({percentage.toFixed(1)}%)
            </p>

            {/* Score Stats */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Your Score</span>
                  <span className="text-sm font-semibold text-white">{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      passed 
                        ? 'bg-gradient-to-r from-green-500 to-green-400' 
                        : 'bg-gradient-to-r from-[#FF4B00] to-amber-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center mt-6">
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                  <p className="text-sm text-gray-400 mb-1">Marks</p>
                  <p className="text-3xl font-bold text-[#FF4B00]">{quizResult.marks}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                  <p className="text-sm text-gray-400 mb-1">Full Marks</p>
                  <p className="text-3xl font-bold text-white">{quizResult.full_marks}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                  <p className="text-sm text-gray-400 mb-1">Attempt</p>
                  <p className="text-3xl font-bold text-amber-400">#{quizResult.attempt_no}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 justify-center mb-8">
              <button
                onClick={handleRestartQuiz}
                className="px-8 py-3 bg-gradient-to-r from-[#FF4B00] to-[#E04300] hover:from-[#E04300] hover:to-[#C03800] text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-[#FF4B00]/30 flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Attempt New Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm text-white rounded-xl font-semibold transition-all border border-gray-600/50 hover:border-gray-500/50"
              >
                Close
              </button>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
              <Award className="w-6 h-6 mr-2 text-[#FF4B00]" />
              Answer Review
            </h3>
            <div className="space-y-4">
              {quizResult.right_answers && quizResult.right_answers.map((answer, index) => {
                const isCorrect = answer.chosen_answer === answer.correct_answer;
                
                return (
                  <div 
                    key={answer.question_id || index} 
                    className="p-5 rounded-xl bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 transition-all"
                  >
                    {/* Question Header */}
                    <div className="flex items-start space-x-3 mb-4">
                      {isCorrect ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold mb-2 text-white">
                          Question {index + 1}
                        </p>
                        <p className="text-base font-medium mb-3 text-gray-200">
                          {answer.question}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="ml-11 space-y-2">
                      {answer.options && answer.options.map((option, optIndex) => {
                        const isChosenOption = optIndex === answer.chosen_index;
                        const isCorrectOption = option === answer.correct_answer;
                        
                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg border transition-all ${
                              isCorrectOption
                                ? 'bg-green-500/10 border-green-500/50'
                                : isChosenOption && !isCorrect
                                ? 'bg-red-500/10 border-red-500/50'
                                : 'bg-gray-800/50 border-gray-600/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                isCorrectOption
                                  ? 'text-green-400 font-medium'
                                  : isChosenOption && !isCorrect
                                  ? 'text-red-400 font-medium'
                                  : 'text-gray-400'
                              }`}>
                                {option}
                              </span>
                              {isCorrectOption && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">
                                  Correct
                                </span>
                              )}
                              {isChosenOption && !isCorrect && (
                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-semibold">
                                  Your Answer
                                </span>
                              )}
                              {isChosenOption && isCorrect && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">
                                  Your Answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz question screen
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-[500px] bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-gray-700/50">
            <span className="text-sm font-semibold text-white">
              Question <span className="text-[#FF4B00]">{currentQuestion + 1}</span> / {questions.length}
            </span>
          </div>
          <div className={`flex items-center space-x-2 px-5 py-3 rounded-xl border ${
            timeLeft < 60 
              ? 'bg-red-500/20 border-red-500/50 backdrop-blur-sm' 
              : 'bg-gray-800/80 border-gray-700/50 backdrop-blur-sm'
          }`}>
            <Clock className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-400' : 'text-gray-400'}`} />
            <span className={`text-sm font-semibold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-5 py-3 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 rounded-xl text-sm font-semibold text-white transition-all"
        >
          Exit Quiz
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800/50 rounded-full h-3 mb-8 overflow-hidden border border-gray-700/50">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#FF4B00] to-amber-500 transition-all duration-300 shadow-lg shadow-[#FF4B00]/30"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50">
          <h3 className="text-2xl font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                selectedAnswer === index
                  ? 'border-[#FF4B00] bg-gradient-to-r from-[#FF4B00]/20 to-amber-500/20 backdrop-blur-sm shadow-lg shadow-[#FF4B00]/20'
                  : 'border-gray-700/50 bg-gray-800/50 backdrop-blur-sm hover:border-gray-600/50 hover:bg-gray-800/70'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedAnswer === index
                      ? 'border-[#FF4B00] bg-gradient-to-br from-[#FF4B00] to-amber-500 shadow-lg shadow-[#FF4B00]/30'
                      : 'border-gray-600'
                  }`}
                >
                  {selectedAnswer === index && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <span className={`text-lg font-medium ${
                  selectedAnswer === index ? 'text-white' : 'text-gray-300'
                }`}>
                  {option}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className={`px-6 py-4 rounded-xl font-semibold transition-all transform flex items-center space-x-2 ${
            currentQuestion === 0
              ? 'bg-gray-700/50 cursor-not-allowed text-gray-500 border border-gray-700/50 opacity-50'
              : 'bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 text-white hover:scale-105'
          }`}
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span className="text-lg">Previous</span>
        </button>
        
        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null || submittingQuiz}
          className={`px-8 py-4 rounded-xl font-semibold transition-all transform flex items-center space-x-2 ${
            selectedAnswer === null || submittingQuiz
              ? 'bg-gray-700/50 cursor-not-allowed text-gray-500 border border-gray-700/50'
              : 'bg-gradient-to-r from-[#FF4B00] to-[#E04300] hover:from-[#E04300] hover:to-[#C03800] text-white shadow-lg shadow-[#FF4B00]/30 hover:scale-105'
          }`}
        >
          {submittingQuiz ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-lg">Submitting...</span>
            </>
          ) : (
            <>
              <span className="text-lg">{currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
