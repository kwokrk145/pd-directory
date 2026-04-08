import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Directory from "./pages/directory";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <main className="flex flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/directory" element={<Directory />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            color: "#000000",
          },
        }}
      />
    </div>
  );
}

export default App;
