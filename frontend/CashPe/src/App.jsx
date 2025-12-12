import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen font-montserrat">
      <Navbar />
      <main className="flex-grow max-w-screen-2xl mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
