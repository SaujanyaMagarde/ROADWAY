import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { login } from "../Store/Authslice.jsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { store } from "../Store/Store.jsx";
import { initializeSocket } from "../Store/SocketSlice.jsx";
import { setConnected } from "../Store/SocketSlice.jsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      const res = await axios.post(import.meta.env.VITE_USER_LOGIN, userData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        const data = res.data.data.user;
        dispatch(login(data));
        store.dispatch(initializeSocket());
        dispatch(setConnected(true));

        MySwal.fire({
          title: "Login Successful 🎉",
          text: "Welcome back to RoadWay!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/user-home");
      }
    } catch (error) {
      console.log(error);
      MySwal.fire({
        title: "Login Failed ❌",
        text: "Invalid email or password. Please try again.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/* Login Card */}
      <div
        className="w-full max-w-md px-6 animate-fadeIn"
        style={{ animation: "fadeIn 0.8s ease-out" }}
      >
        <form
          onSubmit={submitHandler}
          className="w-full p-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 transform transition duration-300 hover:shadow-2xl"
        >
          {/* Logo / Title */}
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
            🚖 RoadWay Login
          </h2>

          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              What's your email?
            </label>
            <input
              id="email"
              required
              value={email}
              type="email"
              placeholder="you@example.com"
              className="w-full bg-gray-50 p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Enter Password
            </label>
            <input
              id="password"
              required
              value={password}
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-50 p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 mt-6 text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl font-semibold text-lg tracking-wide shadow-lg hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            Login
          </button>

          {/* Signup link */}
          <p className="mt-6 text-center text-gray-600">
            New user?{" "}
            <Link
              to="/user-signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center w-full max-w-md">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-3 text-gray-500 text-sm font-medium">or</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      {/* Captain Login */}
      <Link
        to="/captain-login"
        className="w-full max-w-md mx-auto mb-10 py-4 text-white bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl font-semibold text-lg tracking-wide shadow-lg hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 flex justify-center items-center"
      >
        🚖 Sign in as Captain
      </Link>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default UserLogin;
