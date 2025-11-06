import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Signup from "./components/Signup";
import Marketplace from "./pages/Marketplace";
import Requests from "./pages/Requests";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/requests" element={<Requests />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
