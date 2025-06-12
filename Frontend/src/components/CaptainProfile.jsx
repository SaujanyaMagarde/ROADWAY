import React, { useState } from 'react';
import { Star, MessageCircle, Phone, Shield, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import {logout} from "../Store/CaptainSlice.jsx";
import axios from 'axios';

const CaptainProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('info');
  const data = useSelector((state)=>state.captainauth.captaindata);
  console.log(data);
  // Sample captain data
  const captain = {
    name: data?.fullname?.firstname,
    car: data?.vehicle?.vehicleType,
    plate: data?.vehicle?.plate,
    languages: ["English", "Spanish"],
    about: "Professional driver with excellent knowledge of city routes. Always aim to provide a comfortable and safe ride for all passengers.",
    photo: data?.avatar,
  };

  const submitlogout = async()=>{
    try {
      const res = await axios.get(import.meta.env.VITE_CAPTAIN_LOGOUT,{
        withCredentials: true, // ✅ Allow sending cookies
        headers: {
          "Content-Type": "application/json", // ✅ JSON format
        },
      });
    } catch (error) {
      console.log(error);
    }
    dispatch(logout());
    navigate('/captain-login')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="px-4 py-3 bg-white shadow">
        <div className="flex items-center">
          <button className="mr-4 text-gray-700">
            <svg
              onClick={()=>(navigate('/captain-home'))}
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Captain Profile</h1>
        </div>
      </div>

      {/* Captain Info */}
      <div className="flex items-center p-4 bg-white">
        <div className="relative">
          <img 
            src={captain.photo} 
            alt={captain.name} 
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{captain.name}</h2>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-white border-t">
        <button 
        onClick={()=>(submitlogout())}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg">
          logout
        </button>
      </div>
    </div>
  );
};

export default CaptainProfilePage;