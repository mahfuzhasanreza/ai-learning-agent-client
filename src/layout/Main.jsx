import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import ChatPage from '../pages/ChatPage';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../components/Dashboard/Dashboard';
import NavBar from '../../src/pages/Shared/NavBar/NavBar.jsx';
import Footer from '../../src/pages/Shared/Footer/Footer.jsx';

const Main = () => {
    return (
        <div>
            <NavBar></NavBar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Main;



// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/chat" element={<ChatPage />} />
//         <Route path="/login" element={<Login></Login>} />
//         <Route path="/register" element={<Register></Register>} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//         <Route path="/dashboard" element={<Dashboard></Dashboard>} />
//       </Routes>
//     </Router>
//   );
// };