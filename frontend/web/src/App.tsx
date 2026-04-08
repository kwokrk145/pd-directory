import { useStore } from "@nanostores/react";
import Footer from "./custom/footer"
import Sidebar from "./custom/sidebar"
import Home from "./pages/home"
import { $router } from "./lib/router";
import Login from "./pages/login";
import Register from "./pages/register";
import { Toaster } from "sonner";
import Profile from "./pages/profile";
import Members from "./pages/members";

function App() {

  const page = useStore($router);

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
    <Sidebar />
    <div className="flex-1 min-h-0 flex">
      {page.route === "home" && <Home />}
      {page.route === "login" && <Login />}
      {page.route === "register" && <Register />}
      {page.route === "profile" && <Profile />}
      {page.route === "members" && <Members />}
    </div>
    
    <Footer />
    <Toaster />
    </div>
  )
}

export default App
