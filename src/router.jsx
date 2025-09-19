import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register/Register.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import Roadmap from "./pages/Roadmap/Roadmap.jsx";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard.jsx";

const RoadmapData = {
    "topic": "Learn C Programming",
    "introduction": "This roadmap is designed to guide learners through a comprehensive journey of learning C programming — starting from basic syntax and environment setup, progressing through core concepts, data structures, memory management, and advanced programming techniques. It is structured into multiple stages with clear milestones and outcomes.",
    "stages": [
      {
        "title": "Stage 1: Getting Started with C",
        "description": "Set up the development environment and understand the basics of the C language.",
        "items": [
          {
            "name": "1.1 Introduction to C & Environment Setup",
            "description": "Learning Outcomes: Understand the history and importance of C, install GCC/Clang, set up IDE (Code::Blocks/VS Code).\nTime Commitment: 3-5 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "3-5 hours"
          },
          {
            "name": "1.2 First C Program (Hello World)",
            "description": "Learning Outcomes: Write and run your first program, understand structure of a C program (headers, main function).\nTime Commitment: 2-3 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "2-3 hours"
          },
          {
            "name": "1.3 Compiling & Debugging",
            "description": "Learning Outcomes: Learn compilation process, errors vs. warnings, debugging basics using gdb.\nTime Commitment: 4-6 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "4-6 hours"
          }
        ]
      },
      {
        "title": "Stage 2: C Fundamentals",
        "description": "Learn the building blocks of C programming.",
        "items": [
          {
            "name": "2.1 Variables, Data Types & Constants",
            "description": "Learning Outcomes: Declare and use variables, constants, and understand type modifiers.\nTime Commitment: 5-7 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "5-7 hours"
          },
          {
            "name": "2.2 Operators & Expressions",
            "description": "Learning Outcomes: Use arithmetic, relational, logical, bitwise, and assignment operators.\nTime Commitment: 6-8 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "6-8 hours"
          },
          {
            "name": "2.3 Input & Output (printf, scanf, getchar, putchar)",
            "description": "Learning Outcomes: Master basic I/O functions in C.\nTime Commitment: 4-6 hours\nDifficulty: Easy",
            "difficulty": "Easy",
            "timeCommitment": "4-6 hours"
          }
        ]
      },
      
    ]
  };
  

export const router = createBrowserRouter([
    { path: "/", element: <LandingPage></LandingPage> },
    { path: "/about", element: <div>About Page</div> },
    { path: "/register", element: <Register></Register>},
    { path: "/dashboard", element: <Dashboard></Dashboard>},
    { path: "/login", element: <Login></Login> },
    { path: "/roadmap", element: <Roadmap></Roadmap> },
    { path: "/student-dashboard", element: <StudentDashboard></StudentDashboard>}
]);