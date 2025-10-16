# Quiz Component Architecture

## File Structure
```
src/components/Quiz/
│
├── Quiz.jsx                 # Main component (736 lines)
├── Quiz.css                 # Custom styles & animations
├── README.md                # Usage documentation
├── IMPLEMENTATION.md        # Implementation summary
├── index.js                 # Barrel export
└── ARCHITECTURE.md          # This file
```

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Student Dashboard                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Topic Mastery Section                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Add Topic Button (clicked)                     │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Select Quiz Topic Dropdown                     │  │  │
│  │  │  [Variables, Loops, Functions, Arrays...]       │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Take Quiz Button (launches modal)             │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    setShowQuiz(true)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Modal Overlay (Fixed)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Quiz Component                      │  │
│  │                                                        │  │
│  │  State: quizStarted = false                          │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │           START SCREEN                          │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │  Topic Icon (Award)                       │  │  │  │
│  │  │  │  "{topic} Quiz"                           │  │  │  │
│  │  │  │  Description                              │  │  │  │
│  │  │  │                                           │  │  │  │
│  │  │  │  Quiz Info Grid:                          │  │  │  │
│  │  │  │  - Total Questions: 5                     │  │  │  │
│  │  │  │  - Time Limit: 10 mins                    │  │  │  │
│  │  │  │  - Passing Score: 60%                     │  │  │  │
│  │  │  │  - Difficulty: Medium                     │  │  │  │
│  │  │  │                                           │  │  │  │
│  │  │  │  [Start Quiz]  [Cancel]                   │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
                  handleStartQuiz()
                  quizStarted = true
                  Timer starts counting down
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Quiz Component (Active)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           QUESTION SCREEN                             │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Header:                                        │  │  │
│  │  │  [Question 1/5]  [⏱ 9:45]  [Exit Quiz]        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Progress Bar: [██████░░░░░░░░░░] 20%         │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Question Text                                  │  │  │
│  │  │  "What is a variable in programming?"           │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Options (Radio buttons):                       │  │  │
│  │  │  ○ A fixed value that cannot change            │  │  │
│  │  │  ● A storage location with a name (SELECTED)   │  │  │
│  │  │  ○ A function that returns a value             │  │  │
│  │  │  ○ A loop structure                            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │                        [Next Question →]        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
              User answers all questions
                  OR time expires
                           ↓
                  handleFinishQuiz()
                  Calculate score
                  showResult = true
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Quiz Component (Results)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           RESULTS SCREEN                              │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Icon: ✓ (Passed) or ✗ (Failed)                │  │  │
│  │  │  "Congratulations!" / "Keep Practicing!"        │  │  │
│  │  │  "You scored 4 out of 5 (80%)"                  │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Score Bar: [████████████████░░] 80%           │  │  │
│  │  │                                                 │  │  │
│  │  │  Statistics Grid:                               │  │  │
│  │  │  Correct: 4  |  Wrong: 1  |  Time: 3:25        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Review Answers (Scrollable):                   │  │  │
│  │  │  ✓ Q1: What is a variable...                    │  │  │
│  │  │     Your answer: A storage location...          │  │  │
│  │  │                                                 │  │  │
│  │  │  ✗ Q2: Which of the following...                │  │  │
│  │  │     Your answer: my-variable                    │  │  │
│  │  │     Correct answer: myVariable                  │  │  │
│  │  │  ...                                            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  [🔄 Retake Quiz]  [Close]                     │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
                 User clicks [Close]
                           ↓
                   onClose() callback
                  setShowQuiz(false)
                           ↓
              Returns to Student Dashboard
```

## State Management

### Quiz Component State
```javascript
┌─────────────────────────────────────────┐
│       Quiz Internal State               │
├─────────────────────────────────────────┤
│ currentQuestion: 0 → 1 → 2 → ... → 4   │
│ selectedAnswer: null → 0,1,2,3          │
│ answers: [] → [1] → [1,2] → [1,2,0]... │
│ showResult: false → true                │
│ score: 0 → calculated value             │
│ timeLeft: 600 → 599 → 598 → ... → 0    │
│ quizStarted: false → true               │
└─────────────────────────────────────────┘
```

### Dashboard State
```javascript
┌─────────────────────────────────────────┐
│    StudentDashboard State (Quiz)        │
├─────────────────────────────────────────┤
│ showQuiz: false → true → false          │
│ selectedQuizTopic: '' → 'Variables'     │
│ showAddTopicQuiz: false → true → false  │
└─────────────────────────────────────────┘
```

## Data Flow

```
User Action → State Update → UI Re-render

┌────────────────┐
│ User clicks    │
│ "Add Topic"    │
└───────┬────────┘
        ↓
┌────────────────┐
│ setShowAdd     │
│ TopicQuiz(true)│
└───────┬────────┘
        ↓
┌────────────────┐
│ Show dropdown  │
│ & Take Quiz btn│
└───────┬────────┘
        ↓
┌────────────────┐
│ User selects   │
│ topic          │
└───────┬────────┘
        ↓
┌────────────────┐
│ setSelected    │
│ QuizTopic()    │
└───────┬────────┘
        ↓
┌────────────────┐
│ User clicks    │
│ "Take Quiz"    │
└───────┬────────┘
        ↓
┌────────────────┐
│ setShowQuiz    │
│ (true)         │
└───────┬────────┘
        ↓
┌────────────────┐
│ Quiz modal     │
│ opens          │
└───────┬────────┘
        ↓
┌────────────────┐
│ User completes │
│ or exits quiz  │
└───────┬────────┘
        ↓
┌────────────────┐
│ onClose() or   │
│ onComplete()   │
└───────┬────────┘
        ↓
┌────────────────┐
│ Reset states & │
│ return to dash │
└────────────────┘
```

## Component Hierarchy

```
StudentDashboard
└── Quiz Modal (Conditional)
    └── Quiz Component
        ├── Start Screen (if !quizStarted)
        │   ├── Icon
        │   ├── Info Grid
        │   └── Action Buttons
        │
        ├── Question Screen (if quizStarted && !showResult)
        │   ├── Header
        │   │   ├── Question Counter
        │   │   ├── Timer
        │   │   └── Exit Button
        │   ├── Progress Bar
        │   ├── Question Text
        │   ├── Options List
        │   │   └── Option Button × 4
        │   └── Next Button
        │
        └── Results Screen (if showResult)
            ├── Status Icon
            ├── Score Summary
            ├── Score Bar
            ├── Statistics Grid
            ├── Answer Review (Scrollable)
            │   └── Review Item × n
            │       ├── Check/X Icon
            │       ├── Question
            │       ├── User Answer
            │       └── Correct Answer (if wrong)
            └── Action Buttons
```

## Event Handlers

```javascript
┌───────────────────────────────────────────────┐
│           Quiz Event Handlers                 │
├───────────────────────────────────────────────┤
│                                               │
│ handleStartQuiz()                             │
│   ↳ Sets quizStarted = true                  │
│   ↳ Timer begins countdown                   │
│                                               │
│ handleAnswerSelect(index)                     │
│   ↳ Sets selectedAnswer = index              │
│   ↳ Highlights selected option                │
│                                               │
│ handleNextQuestion()                          │
│   ↳ Validates answer selected                │
│   ↳ Stores answer in answers array           │
│   ↳ Moves to next question                   │
│   ↳ OR calls handleFinishQuiz if last Q      │
│                                               │
│ handleFinishQuiz(finalAnswers)                │
│   ↳ Calculates score                         │
│   ↳ Sets showResult = true                   │
│   ↳ Calls onComplete() callback              │
│                                               │
│ handleRestartQuiz()                           │
│   ↳ Resets all state to initial values       │
│   ↳ User can retake quiz                     │
│                                               │
│ Timer useEffect                               │
│   ↳ Runs every second                        │
│   ↳ Decrements timeLeft                      │
│   ↳ Auto-submits if time === 0              │
│                                               │
└───────────────────────────────────────────────┘
```

## CSS Architecture

```
Quiz.css
├── Animations
│   ├── @keyframes fadeIn         (component entrance)
│   ├── @keyframes pulse          (answer selection)
│   ├── @keyframes blink          (timer warning)
│   └── @keyframes scaleIn        (results appear)
│
├── Component Classes
│   ├── .quiz-container
│   ├── .quiz-option
│   ├── .quiz-option-selected
│   ├── .quiz-progress-bar
│   ├── .quiz-timer-warning
│   └── .quiz-result-score
│
├── Scrollbar Styling
│   └── .quiz-review-scroll
│       ├── ::-webkit-scrollbar
│       ├── ::-webkit-scrollbar-track
│       └── ::-webkit-scrollbar-thumb
│
└── Responsive Design
    └── @media (max-width: 768px)
```

## Props Interface

```typescript
interface QuizProps {
  topic: string;                    // Required
  onClose: () => void;              // Required
  onComplete?: (results: {          // Optional
    topic: string;
    score: number;
    total: number;
    percentage: number;
    timeTaken: number;
  }) => void;
}
```

## Integration Points

```
┌─────────────────────────────────────────┐
│      External Dependencies              │
├─────────────────────────────────────────┤
│ React                                   │
│   ↳ useState, useEffect, useContext     │
│                                         │
│ lucide-react                            │
│   ↳ CheckCircle, XCircle, Clock, etc.  │
│                                         │
│ Context API                             │
│   ↳ isDark theme state                 │
│                                         │
│ Tailwind CSS                            │
│   ↳ Utility classes                    │
│                                         │
│ Custom CSS                              │
│   ↳ Quiz.css animations                │
└─────────────────────────────────────────┘
```

## Performance Considerations

1. **Timer Optimization**
   - Uses single setTimeout per second
   - Cleanup on unmount prevents memory leaks

2. **Render Optimization**
   - Conditional rendering prevents unnecessary DOM updates
   - Only active screen component is rendered

3. **List Rendering**
   - Keys used on all mapped elements
   - Minimal re-renders on state updates

4. **Modal Performance**
   - Fixed positioning with z-index
   - Backdrop prevents interactions with dashboard
   - Scrollable container for long content

## Accessibility Features

- Clear visual feedback for all interactions
- High contrast colors in both themes
- Keyboard-friendly (tab navigation)
- Semantic HTML structure
- ARIA labels where appropriate
- Screen reader friendly text
- Focus indicators on interactive elements

## Future Architecture Improvements

1. **State Management**
   - Move to useReducer for complex state
   - Consider Redux/Zustand for persistence

2. **Question Management**
   - Separate questions into JSON files
   - API integration for dynamic questions
   - Question bank system

3. **Results Persistence**
   - LocalStorage for offline save
   - API integration for cloud save
   - Historical results tracking

4. **Code Splitting**
   - Lazy load Quiz component
   - Separate question data files
   - Dynamic imports for icons

5. **Testing**
   - Unit tests for handlers
   - Integration tests for flows
   - E2E tests for user journeys
