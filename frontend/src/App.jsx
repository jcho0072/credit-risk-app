import CreditPage from "./pages/CreditPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import "./styles/main.css"
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Applications</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CreditPage />}></Route>
        <Route path="/analytics" element={<AnalyticsDashboard />}></Route>
      </Routes>
    </Router>
  )
}

export default App;