# Quiz Component

A fully-featured, interactive quiz component for testing student knowledge on various programming topics.

## Features

- **Multiple Topics**: Pre-loaded questions for Variables, Loops, Functions, Arrays, Pointers, Structures, Recursion, and File Handling
- **Timed Quizzes**: 10-minute countdown timer with visual warnings
- **Progress Tracking**: Visual progress bar showing quiz completion
- **Answer Review**: Detailed review of all answers after quiz completion
- **Score Calculation**: Automatic scoring with percentage calculation
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Automatically adapts to light/dark theme
- **Multiple Screens**:
  - Start screen with quiz information
  - Question screen with multiple-choice options
  - Results screen with detailed feedback

## Usage

```jsx
import Quiz from './components/Quiz/Quiz';

function MyComponent() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Variables');

  const handleQuizComplete = (results) => {
    console.log('Quiz Results:', results);
    // results includes: topic, score, total, percentage, timeTaken
  };

  return (
    <div>
      {showQuiz ? (
        <Quiz 
          topic={selectedTopic}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      ) : (
        <button onClick={() => setShowQuiz(true)}>
          Start Quiz
        </button>
      )}
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `topic` | string | Yes | The topic for the quiz (e.g., 'Variables', 'Loops', 'Functions') |
| `onClose` | function | Yes | Callback function when quiz is closed or exited |
| `onComplete` | function | No | Callback function when quiz is completed with results |

## Results Object

When the quiz is completed, the `onComplete` callback receives an object with:

```javascript
{
  topic: 'Variables',           // The quiz topic
  score: 4,                      // Number of correct answers
  total: 5,                      // Total number of questions
  percentage: 80,                // Score percentage (rounded)
  timeTaken: 245                 // Time taken in seconds
}
```

## Supported Topics

- Variables
- Loops
- Functions
- Arrays
- Pointers
- Structures
- Recursion
- File Handling

## Customization

### Adding New Topics

To add new topics, edit the `quizQuestions` object in `Quiz.jsx`:

```javascript
const quizQuestions = {
  // Existing topics...
  'YourNewTopic': [
    {
      question: "Your question here?",
      options: [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      correctAnswer: 0  // Index of correct option (0-3)
    },
    // More questions...
  ]
};
```

### Changing Quiz Duration

Modify the initial `timeLeft` state (in seconds):

```javascript
const [timeLeft, setTimeLeft] = useState(600); // 600 seconds = 10 minutes
```

### Adjusting Passing Score

Update the passing percentage in the start screen and results screen:

```javascript
const passed = percentage >= 60; // Change 60 to your desired percentage
```

## Styling

The component uses:
- Tailwind CSS for utility classes
- Custom CSS animations in `Quiz.css`
- Dark mode support via Context API

### Custom Styles

Edit `Quiz.css` to customize:
- Animations (fadeIn, pulse, blink, scaleIn)
- Scrollbar styling
- Responsive breakpoints
- Transition effects

## Features in Detail

### Timer
- Counts down from 10 minutes
- Shows warning (red) when less than 1 minute remains
- Auto-submits quiz when time runs out

### Question Navigation
- Shows current question number
- Progress bar indicates completion
- Can't proceed without selecting an answer
- "Next Question" or "Finish Quiz" button

### Results Screen
- Shows pass/fail status
- Displays score breakdown (correct/wrong)
- Shows time taken
- Detailed answer review with correct answers
- Option to retake quiz

### Answer Review
- Shows all questions with selected answers
- Highlights correct and incorrect answers
- Displays correct answer for wrong selections
- Scrollable list for many questions

## Dependencies

- React 18+
- lucide-react (for icons)
- Context API (for dark mode)
- Tailwind CSS

## File Structure

```
src/components/Quiz/
├── Quiz.jsx       # Main component
├── Quiz.css       # Custom styles
└── README.md      # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Keyboard navigation support
- Clear visual feedback for selections
- High contrast colors
- Screen reader friendly

## Future Enhancements

Potential improvements:
- Add question randomization
- Support for different question types (true/false, multiple select)
- Save quiz progress to localStorage
- Export results as PDF
- Difficulty levels
- Hints for questions
- Question explanations
- Integration with backend API for dynamic questions
