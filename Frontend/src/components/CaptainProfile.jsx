import React, { useState } from "react";
import {
  Car,
  Clock,
  ChevronRight,
  Edit,
  Camera,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/CaptainSlice.jsx";
import axios from "axios";

const CaptainProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.captainauth.captaindata);

  // Extract data safely with fallbacks
  const [captainData] = useState({
    name: data?.fullname?.firstname || "N/A",
    email: data?.email || "N/A",
    phone: data?.mobile_no || "N/A",
    car: data?.vehicle?.vehicleType || "N/A",
    plate: data?.vehicle?.plate || "N/A",
    avatar: data?.avatar || "https://via.placeholder.com/150",
    joinDate: data?.createdAt
      ? new Date(data.createdAt).toLocaleDateString()
      : "N/A",
  });

  const [ride, setRide] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Logout
  const submithandler = async () => {
    try {
      await axios.get(import.meta.env.VITE_CAPTAIN_LOGOUT, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log(error);
    }
    dispatch(logout());
    navigate("/captain-login");
  };

  // Fetch Ride History (with toggle)
  const submithand = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    try {
      const res = await axios.get(import.meta.env.VITE_CAPTAIN_RIDE_HISTORY, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const ridedata = res?.data?.data?.history || [];
      setRide(ridedata);
      setShowHistory(true);
    } catch (error) {
      console.log(error);
    }
  };

  function gotoRide() {
    navigate("/captain-ongoing-rides");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Captain Profile</h1>
        <i
          onClick={() => navigate("/captain-home")}
          className="ri-arrow-go-back-line cursor-pointer"
        ></i>
      </div>

      {/* Captain Info Card */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md overflow-hidden">
        <div className="p-4 flex items-center">
          <div className="relative">
            <img
              src={captainData.avatar}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
            <div className="absolute bottom-0 right-2 bg-gray-100 rounded-full p-1">
              <Camera className="h-4 w-4 text-gray-600" />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-bold text-lg">{captainData.name}</h2>
            <p className="text-sm text-gray-500">{captainData.email}</p>
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
            <p className="text-xl font-bold">{captainData.car}</p>
            <p className="text-xs text-gray-500">Car</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xl font-bold">{captainData.plate}</p>
            <p className="text-xs text-gray-500">Plate</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm font-bold">{captainData.joinDate}</p>
            <p className="text-xs text-gray-500">Joined</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-xl mx-4 mt-4 shadow-md">
        <div className="divide-y">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">
              ACCOUNT
            </h3>

            {/* Personal Info Toggle */}
            <div
              className="flex items-center justify-between py-2 cursor-pointer"
              onClick={() => setShowInfo((prev) => !prev)}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium">Personal Information</p>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  showInfo ? "rotate-90" : ""
                }`}
              />
            </div>

            {/* On-going Ride */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium cursor-pointer" onClick={gotoRide}>
                  On-going Ride
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            {/* Trip History */}
            <div
              className="flex items-center justify-between py-2 cursor-pointer"
              onClick={submithand}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Car className="h-5 w-5 text-gray-600" />
                </div>
                <p className="font-medium">Trip History</p>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  showHistory ? "rotate-90" : ""
                }`}
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
      {showInfo && (
        <div className="bg-white rounded-xl mx-4 mt-4 shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
          <p>
            <strong>Name:</strong> {captainData.name}
          </p>
          <p>
            <strong>Email:</strong> {captainData.email}
          </p>
          <p>
            <strong>Phone:</strong> {captainData.phone}
          </p>
        </div>
      )}

      {/* Ride History Section */}
      {showHistory && ride && (
        <div className="bg-white rounded-xl mx-4 mt-4 shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Completed Trips</h3>
          {ride.length === 0 ? (
            <p className="text-gray-500">No trips found.</p>
          ) : (
            <div className="space-y-4">
              {ride.map((r, index) => (
                <div
                  key={r._id || index}
                  className="border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
                >
                  <p>
                    <strong>From:</strong> {r?.pickup?.location || "N/A"}
                  </p>
                  <p>
                    <strong>To:</strong> {r?.destination?.location || "N/A"}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {r?.createdAt
                      ? new Date(r.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> {r?.status || "N/A"}
                  </p>
                  <p>
                    <strong>Fare:</strong> ₹{r?.fare || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* App Version */}
      <div className="mt-6 mb-8 text-center text-xs text-gray-400">
        <p>Uber Clone v1.0.4</p>
      </div>
    </div>
  );
};

export default CaptainProfile;
