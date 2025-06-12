import React, { useState } from 'react';
import { User, MapPin, Calendar, Star, Clock, CreditCard, Settings, ChevronRight, Edit, Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import {logout} from "../Store/Authslice.jsx";
import axios from 'axios';
const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state)=>state.auth.userdata)
  const [userData, setUserData] = useState({
    name: data?.fullname?.firstname,
    email: data?.email,
    phone: data?.mobile_no,
    avatar: data?.avatar,
    joinDate: data?.createdAt,
  });

  const submithandler = async()=>{
    try {
      const res = await axios.get(import.meta.env.VITE_USER_LOGOUT,{
        withCredentials: true, // ✅ Allow sending cookies
        headers: {
          "Content-Type": "application/json", // ✅ JSON format
        },
      });
    } catch (error) {
      console.log(error);
    }
    dispatch(logout());
    navigate('/user-login')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Profile</h1>
        <i
        onClick={()=>(
            navigate('/user-home')
        )}
        class="ri-arrow-go-back-line"></i>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md overflow-hidden">
        <div className="p-4 flex items-center">
          <div className="relative">
            <img 
              src={userData.avatar} 
              alt="Profile" 
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
            <div className="absolute bottom-0 right-2 bg-gray-100 rounded-full p-1">
              <Camera className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="font-bold text-lg">{userData.name}</h2>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>
          <button className="bg-gray-100 p-2 rounded-full">
            <Edit className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md">
        <div className="grid grid-cols-3 divide-x">
          <div className="p-4 text-center">
            <p className="text-xl font-bold">{userData.joinDate}</p>
            <p className="text-xs text-gray-500">Member Since</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md">
        <div className="divide-y">
          
          {/* Account Settings */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">ACCOUNT</h3>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium">Personal Information</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium">Trip History</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Logout */}
          <div onClick={submithandler}
          className="p-4">
            <div className="flex items-center py-2 text-red-500">
              <div className="bg-red-50 p-2 rounded-full mr-3">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <p className="font-medium">Log Out</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* App Version */}
      <div className="mt-6 mb-8 text-center text-xs text-gray-400">
        <p>Uber Clone v1.0.4</p>
      </div>
    </div>
  );
};

export default UserProfile;