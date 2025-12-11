import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Login from "../pages/LoginPage.jsx";
import Register from "../pages/RegisterPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
