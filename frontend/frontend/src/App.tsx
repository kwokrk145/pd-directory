import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <main className="flex flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
