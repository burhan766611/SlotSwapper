import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await API.post("/auth/signup", signupData);
      if(res.data.result){
        alert(res.data.msg);
        navigate("/dashboard")
      }else{
        alert(res.data.msg);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSignupData({ username: "", email: "", password: "" });
      setLoading(false);
      console.log("Form cleared:", signupData);
    }
  };

  const handleVlu = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <>
        <div className="h-[85%] w-[70%] flex items-center justify-center">
          <form
            onSubmit={handleSignup}
            className="h-full w-full bg-amber-50/20 backdrop-blur-md rounded-3xl flex flex-col justify-center items-center gap-6 p-8 shadow-md"
          >
            <div className="flex flex-col w-[80%] gap-2">
              <label
                htmlFor="username"
                className="text-left text-xl font-semibold text-gray-800 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={signupData.username}
                onChange={handleVlu}
                required
                placeholder="John"
                className="border-2 border-amber-400 h-12 w-full text-xl rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
              />
            </div>

            <div className="flex flex-col w-[80%] gap-2">
              <label
                htmlFor="email"
                className="text-left text-xl font-semibold text-gray-800 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleVlu}
                required
                placeholder="john@example.com"
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
                value={signupData.password}
                onChange={handleVlu}
                required
                placeholder="••••••••"
                className="border-2 border-amber-400 h-12 w-full text-xl rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
              />
            </div>

            <button
              type="submit"
              className=" h-10 w-30 mt-10 bg-amber-400 hover:bg-amber-500 text-black font-semibold text-lg px-10 py-2 rounded-xl shadow-md hover:shadow-amber-400/40 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Wait.." : "Login"} 
            </button>
          </form>
        </div>
      </>
    </>
  );
};

export default Signup;
