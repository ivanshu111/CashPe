import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Login from "../pages/LoginPage.jsx";
import Register from "../pages/RegisterPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import AddMoneyPage from "../pages/AddMoneyPage.jsx"; // Import AddMoneyPage

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/add-money", // New route for AddMoneyPage
        element: <AddMoneyPage />,
      },
    ],
  },
]);

export default router;
