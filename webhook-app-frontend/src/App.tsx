import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Authpages from "./pages/Authpages";
import Dashboard from "./pages/Dashboard";

function App() {
  return <Routes>
      {/* Public */}
      <Route path="/" element={<Authpages />} />

      {/* Protected */}
      <Route path="/dashboard" element={<Dashboard />}/>
    </Routes>
}

export default App
