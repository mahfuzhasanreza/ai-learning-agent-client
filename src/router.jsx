import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register/Register.jsx";

export const router = createBrowserRouter([
    { path: "/", element: <LandingPage></LandingPage> },
    { path: "/about", element: <div>About Page</div> },
    { path: "/register", element: <Register></Register>}
]);