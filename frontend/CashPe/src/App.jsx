import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { initSocket } from "./services/socketService";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications.items);
  const prevNotificationsRef = useRef(notifications);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      initSocket(user._id);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (notifications.length > prevNotificationsRef.current.length) {
      const newNotification = notifications[0];
      toast.success(newNotification.message);
    }
    prevNotificationsRef.current = notifications;
  }, [notifications]);

  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="flex-grow max-w-screen-3xl mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
