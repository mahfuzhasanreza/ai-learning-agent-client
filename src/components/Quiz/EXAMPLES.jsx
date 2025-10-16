// Example 1: Basic Usage
import React, { useState } from 'react';
import Quiz from './components/Quiz';

function BasicExample() {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div>
      <button onClick={() => setShowQuiz(true)}>
        Start Quiz
      </button>

      {showQuiz && (
        <Quiz
          topic="Variables"
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}

// Example 2: With Results Callback
function WithResultsExample() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [results, setResults] = useState(null);

  const handleQuizComplete = (quizResults) => {
    setResults(quizResults);
    console.log('Quiz completed:', quizResults);
    // Save to API, update state, show notification, etc.
  };

  return (
    <div>
      <button onClick={() => setShowQuiz(true)}>
        Take Functions Quiz
      </button>

      {showQuiz && (
        <Quiz
          topic="Functions"
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}

      {results && (
        <div className="results-summary">
          <h3>Last Quiz Results</h3>
          <p>Topic: {results.topic}</p>
          <p>Score: {results.score}/{results.total}</p>
          <p>Percentage: {results.percentage}%</p>
          <p>Time: {Math.floor(results.timeTaken / 60)}:{results.timeTaken % 60}</p>
        </div>
      )}
    </div>
  );
}

// Example 3: With Topic Selection
function TopicSelectionExample() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = [
    'Variables',
    'Loops',
    'Functions',
    'Arrays',
    'Pointers',
    'Structures',
    'Recursion',
    'File Handling'
  ];

  const handleStartQuiz = () => {
    if (!selectedTopic) {
      alert('Please select a topic first');
      return;
    }
    setShowQuiz(true);
  };

  return (
    <div>
      <select
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
      >
        <option value="">Choose a topic...</option>
        {topics.map(topic => (
          <option key={topic} value={topic}>{topic}</option>
        ))}
      </select>

      <button onClick={handleStartQuiz}>
        Start Quiz
      </button>

      {showQuiz && (
        <Quiz
          topic={selectedTopic}
          onClose={() => {
            setShowQuiz(false);
            setSelectedTopic('');
          }}
          onComplete={(results) => {
            console.log(`${results.topic} quiz completed:`, results);
            alert(`You scored ${results.percentage}%!`);
          }}
        />
      )}
    </div>
  );
}

// Example 4: Modal Overlay (Used in StudentDashboard)
function ModalExample() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [topic, setTopic] = useState('Variables');

  return (
    <div>
      <button onClick={() => setShowQuiz(true)}>
        Take Quiz
      </button>

      {/* Modal with overlay */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <Quiz
              topic={topic}
              onClose={() => setShowQuiz(false)}
              onComplete={(results) => {
                console.log('Quiz completed:', results);
                // Can keep modal open to show results
                // Or close automatically after a delay
                setTimeout(() => setShowQuiz(false), 3000);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Example 5: With Score Tracking
function ScoreTrackingExample() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]);

  const handleQuizComplete = (results) => {
    // Add timestamp
    const resultWithTimestamp = {
      ...results,
      completedAt: new Date().toISOString()
    };

    // Add to history
    setScoreHistory(prev => [...prev, resultWithTimestamp]);

    // Save to localStorage
    localStorage.setItem(
      'quizHistory',
      JSON.stringify([...scoreHistory, resultWithTimestamp])
    );

    // Show success message
    alert(`Quiz completed! Score: ${results.percentage}%`);
  };

  return (
    <div>
      <button onClick={() => setShowQuiz(true)}>
        Take Quiz
      </button>

      {showQuiz && (
        <Quiz
          topic="Loops"
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Score History */}
      <div className="score-history">
        <h3>Quiz History</h3>
        {scoreHistory.map((result, index) => (
          <div key={index} className="history-item">
            <span>{result.topic}</span>
            <span>{result.percentage}%</span>
            <span>{new Date(result.completedAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 6: With API Integration
function APIIntegrationExample() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuizComplete = async (results) => {
    setLoading(true);

    try {
      // Send results to API
      const response = await fetch('/api/quiz-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: 123,
          courseId: 'CSE1110',
          ...results
        })
      });

      if (response.ok) {
        console.log('Results saved successfully');
        alert('Quiz results saved!');
      } else {
        throw new Error('Failed to save results');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results. Please try again.');
    } finally {
      setLoading(false);
      setShowQuiz(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowQuiz(true)}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Take Quiz'}
      </button>

      {showQuiz && (
        <Quiz
          topic="Arrays"
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
}

// Example 7: Multiple Quizzes in Sequence
function SequentialQuizzesExample() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [allResults, setAllResults] = useState([]);

  const quizSequence = ['Variables', 'Loops', 'Functions'];

  const handleQuizComplete = (results) => {
    setAllResults(prev => [...prev, results]);

    if (currentQuizIndex < quizSequence.length - 1) {
      // Move to next quiz
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      // All quizzes completed
      setShowQuiz(false);
      console.log('All quizzes completed:', allResults);
      alert('Congratulations! You completed all quizzes!');
    }
  };

  return (
    <div>
      <button onClick={() => {
        setShowQuiz(true);
        setCurrentQuizIndex(0);
        setAllResults([]);
      }}>
        Start Quiz Series
      </button>

      {showQuiz && (
        <div>
          <p>Quiz {currentQuizIndex + 1} of {quizSequence.length}</p>
          <Quiz
            topic={quizSequence[currentQuizIndex]}
            onClose={() => setShowQuiz(false)}
            onComplete={handleQuizComplete}
          />
        </div>
      )}
    </div>
  );
}

export {
  BasicExample,
  WithResultsExample,
  TopicSelectionExample,
  ModalExample,
  ScoreTrackingExample,
  APIIntegrationExample,
  SequentialQuizzesExample
};
