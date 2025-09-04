import React, { useState } from 'react';
import { User, Clock, ChevronRight, Edit, Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../Store/Authslice.jsx";
import axios from 'axios';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth.userdata);
  console.log(data);

  const [ride, setRide] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showPersonal, setShowPersonal] = useState(false);

  // Logout
  const submithandler = async () => {
    try {
      await axios.get(import.meta.env.VITE_USER_LOGOUT, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log(error);
    }
    dispatch(logout());
    navigate('/user-login');
  };

  // Fetch Ride History (toggle)
  const submithand = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    try {
      const res = await axios.get(import.meta.env.VITE_GETHISTORY, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const ridedata = res?.data?.data?.history;
      setRide(ridedata);
      setShowHistory(true);
    } catch (error) {
      console.log(error);
    }
  };

  function gotoride() {
    navigate('/user-ongoing-rides');
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Profile</h1>
        <i
          onClick={() => navigate('/user-home')}
          className="ri-arrow-go-back-line cursor-pointer"
        ></i>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md overflow-hidden">
        <div className="p-4 flex items-center">
          <div className="relative">
            <img
              src={data?.avatar}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
            <div className="absolute bottom-0 right-2 bg-gray-100 rounded-full p-1">
              <Camera className="h-4 w-4 text-gray-600" />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-bold text-lg">{data?.fullname?.firstname}</h2>
            <p className="text-sm text-gray-500">{data?.email}</p>
          </div>
          <button className="bg-gray-100 p-2 rounded-full">
            <Edit className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md">
        <div className="divide-y">
          {/* Account Settings */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">ACCOUNT</h3>

            {/* Personal Information */}
            <div
              className="flex items-center justify-between py-2 cursor-pointer"
              onClick={() => setShowPersonal(!showPersonal)}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium">Personal Information</p>
              </div>
              <ChevronRight
                className={`h-5 w-5 transition-transform ${
                  showPersonal ? "rotate-90" : ""
                } text-gray-400`}
              />
            </div>

            {/* On-going Ride */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium cursor-pointer" onClick={gotoride}>
                  On-going Ride
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Trip History */}
            <div className="flex items-center justify-between py-2 cursor-pointer" onClick={submithand}>
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium">Trip History</p>
              </div>
              <ChevronRight
                className={`h-5 w-5 transition-transform ${
                  showHistory ? "rotate-90" : ""
                } text-gray-400`}
              />
            </div>
          </div>

          {/* Logout */}
          <div onClick={submithandler} className="p-4 cursor-pointer">
            <div className="flex items-center py-2 text-red-500">
              <div className="bg-red-50 p-2 rounded-full mr-3">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <p className="font-medium">Log Out</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Section */}
      {showPersonal && (
        <div className="bg-white rounded-xl mx-4 mt-4 shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Name:</span> {data?.fullname?.firstname} {data?.fullname?.lastname}</p>
            <p><span className="font-medium">Email:</span> {data?.email}</p>
            <p><span className="font-medium">Phone:</span> {data?.mobile_no}</p>
            <p><span className="font-medium">Member Since:</span> {new Date(data?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* Ride History Section */}
      {showHistory && ride && (
        <div className="bg-white rounded-xl mx-4 mt-4 shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Completed Trips</h3>
          <div className="space-y-4">
            {ride.map((r, index) => (
              <div
                key={r._id || index}
                className="border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
              >
                {/* Pickup → Destination */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {r.pickup?.location || "Unknown Pickup"}
                    </p>
                    <p className="text-sm text-gray-500">Pickup</p>
                  </div>
                  <span className="text-gray-400">➡</span>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {r.destination?.location || "Unknown Destination"}
                    </p>
                    <p className="text-sm text-gray-500">Drop</p>
                  </div>
                </div>

                {/* Ride Info */}
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Fare:</span> ₹{r.fare}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Duration:</span> {r.duration}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Distance:</span>{" "}
                    {(r.distance / 1000).toFixed(2)} km
                  </p>
                </div>

                {/* Status + Payment */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      r.status === "completed"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-gray-500">Paid by {r.paymentID}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* App Version */}
      <div className="mt-6 mb-8 text-center text-xs text-gray-400">
        <p>RoadWay v1.0.4</p>
      </div>
    </div>
  );
};

export default UserProfile;
