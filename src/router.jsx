import { createBrowserRouter, Outlet } from "react-router-dom";
import App from "./App.jsx";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register/Register.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import Roadmap from "./pages/Roadmap/Roadmap.jsx";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard.jsx";
import StudyPlan from "./pages/StudyPlan/StudyPlan.jsx";
import SidebarLayout from "./layout/SidebarLayout.jsx";
import ChatPage from "./pages/ChatPage.jsx";


export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/about", element: <div>About Page</div> },
  { path: "/register", element: <Register />},
  { path: "/login", element: <Login /> },
  { 
    path: "/", 
    // element: <SidebarLayout></SidebarLayout>,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "roadmap", element: <Roadmap /> },
      { path: "performance-tracking", element: <StudentDashboard /> },
      { path: "study-plan", element: <StudyPlan /> },
      { path: "cosmos-chatbot", element: <ChatPage></ChatPage> },
    ]
  }
]);