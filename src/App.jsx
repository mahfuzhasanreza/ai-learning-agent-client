import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<Register></Register>} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Dashboard></Dashboard>} />
        <Route path="/student-dashboard" element={<StudentDashboard></StudentDashboard>} />
      </Routes>
    </Router>
  );
};

export default App;