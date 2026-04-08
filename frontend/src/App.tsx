import Footer from "./components/footer"
import { Sidebar } from "./components/sidebar"
import Home from "./pages/home"


function App() {

  return (
    <>
      <div className="min-h-screen">
        <Sidebar />
        <Home />
        <Footer />
      </div>
    </>
  )
}

export default App
