import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-screen-2xl mx-auto  py-4 font-montserrat">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
