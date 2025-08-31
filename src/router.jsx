import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import LandingPage from "./pages/LandingPage";

export const router = createBrowserRouter([
    { path: "/", element: <LandingPage></LandingPage> },
    { path: "/about", element: <div>About Page</div> },
]);