import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "./AlertContext";

const Login = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleVlu = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await API.post("/auth/login", loginData);
      if (res.data.result) {
        showAlert("Welcome Back !", res.data.msg, "success")
        navigate("/dashboard");
      } else {
        showAlert("Login Failed", res.data.msg, "error")
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoginData({
        email: "",
        password: "",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-[65%] w-[70%] flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="h-full w-full bg-amber-50/20 backdrop-blur-md rounded-3xl flex flex-col justify-center items-center gap-6 p-8 shadow-md"
        >
          <h1 className="text-4xl">Welcome Back </h1>

          <div className="flex flex-col w-[80%] gap-2">
            <label
              htmlFor="email"
              className="text-left text-xl font-semibold text-gray-800 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              name="email"
              value={loginData.email}
              onChange={handleVlu}
              required
              placeholder="you@example.com"
              className="border-2 border-amber-400 h-12 w-full text-xl rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
          </div>

          <div className="flex flex-col w-[80%] gap-2">
            <label
              htmlFor="password"
              className="text-left text-xl font-semibold text-gray-800 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleVlu}
              required
              placeholder="••••••••"
              className="border-2 border-amber-400 h-12 w-full text-xl rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className=" h-10 w-30 bg-amber-400 hover:bg-amber-500 text-black font-semibold text-lg px-10 py-2 rounded-xl shadow-md hover:shadow-amber-400/40 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Wait.." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
