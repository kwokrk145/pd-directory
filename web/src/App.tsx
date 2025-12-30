import Footer from "./custom/footer"
import Sidebar from "./custom/sidebar"
import Home from "./pages/home"

function App() {

  return (
    <div className="flex flex-col justify-center min-h-screen">
    <Sidebar />
    <div className="flex-grow">
      <Home />

    </div>
    
    <Footer />
    </div>
  )
}

export default App
