import React from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout"); // optional logout route that clears cookie
      navigate("/");
    } catch {
      navigate("/");
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">SlotSwapper</div>
      <div className="flex gap-6">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/marketplace" className="hover:underline">
          Marketplace
        </Link>
        <Link to="/requests" className="hover:underline">
          Requests
        </Link>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
