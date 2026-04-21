import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import { RedirectIfAuthenticated, RequireAuth } from "./components/route-guards";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Directory from "./pages/directory";
import Profile from "./pages/profile";
import UserProfile from "./pages/user-profile";
import MemberAdmin from "./pages/member-admin";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <main className="flex flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/directory" element={<Directory />} />
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/members/admin" element={<MemberAdmin />} />
          </Route>
          <Route path="/users/:id" element={<UserProfile />} />
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
