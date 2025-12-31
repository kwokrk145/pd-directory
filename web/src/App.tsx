import { useStore } from "@nanostores/react";
import Footer from "./custom/footer"
import Sidebar from "./custom/sidebar"
import Home from "./pages/home"
import { $router } from "./lib/router";
import Login from "./pages/login";

function App() {

  const page = useStore($router);

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center min-h-screen">
    <Sidebar />
    <div className="flex-grow">
      {page.route === "home" && <Home />}
      {page.route === "login" && <Login />}
    </div>
    
    <Footer />
    </div>
  )
}

export default App
