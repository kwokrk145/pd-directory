import { Sidebar } from "./components/sidebar"
import Home from "./pages/home"


function App() {

  return (
    <>
      <div className="min-h-screen">
        <Sidebar />
        <Home />
      </div>
    </>
  )
}

export default App
