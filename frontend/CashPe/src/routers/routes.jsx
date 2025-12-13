import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Login from "../pages/LoginPage.jsx";
import Register from "../pages/RegisterPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import AddMoneyPage from "../pages/AddMoneyPage.jsx";
import SendMoneyPage from "../pages/SendMoneyPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import EditProfilePage from "../pages/EditProfilePage.jsx"; // Import EditProfilePage
import AdminPage from "../pages/AdminPage.jsx"; // Import AdminPage
import ProtectedRoute from "../components/ProtectedRoute.jsx";

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
        // Protected routes
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/add-money",
            element: <AddMoneyPage />,
          },
          {
            path: "/send-money",
            element: <SendMoneyPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/profile/edit", // New route for EditProfilePage
            element: <EditProfilePage />,
          },
          {
            path: "/admin",
            element: <AdminPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
