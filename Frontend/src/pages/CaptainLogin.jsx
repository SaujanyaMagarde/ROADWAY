import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {login} from '../Store/Authslice.jsx';
import { useSelector,useDispatch } from 'react-redux';
function CaptainLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const submitHandler = async(e) => {
    e.preventDefault();
    const CaptainData = {
      email: email,
      password: password,
    };
    try {
      const res = await axios.post(import.meta.env.VITE_CAPTAIN_LOGIN,CaptainData,{
        withCredentials: true, // ✅ Allow sending cookies
          headers: {
            "Content-Type": "application/json", // ✅ JSON format
          },
      })
      const captain_data = res.data.data.Captain
      console.log(captain_data)
      dispatch(login(captain_data))
    } catch (error) {
      console.log(error);
      alert('something went wrong')
    }




    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-between bg-gray-50">
      <div className="w-full max-w-md mt-12 px-6">
        <form 
          onSubmit={submitHandler} 
          className="w-full p-8 bg-white rounded-xl shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Captain Login</h2>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              What's your email?
            </label>
            <input
              id="email"
              required
              value={email}
              type="email"
              placeholder="Your email here"
              className="w-full bg-gray-50 p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Enter Password
            </label>
            <input
              id="password"
              required
              value={password}
              type="password"
              placeholder="Your password here"
              className="w-full bg-gray-50 p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 px-6 mt-6 text-white bg-black rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
          >
            Login
          </button>
          
          <p className="mt-6 text-center text-gray-600">
            New user?{" "}
            <Link to="/captain-signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      <Link 
        to="/user-login" 
        className="w-full max-w-md mx-auto mb-10 py-4 text-white bg-orange-600 rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 flex justify-center items-center shadow-md"
      >
        Sign in as User
      </Link>
    </div>
  );
}

export default CaptainLogin;