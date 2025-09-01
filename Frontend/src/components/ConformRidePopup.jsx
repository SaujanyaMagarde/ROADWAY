import React from 'react';
import logo from '../picture/logo.png';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {fillride} from '../Store/CaptainSlice.jsx';
function ConformRidePopup({ setridePopup, setConformRide, confromDetails,setpickupride}) {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      const rideId = confromDetails?.rideId;
  
      if (!rideId) {
        console.error("Ride ID not found.");
        return;
      }
  
      const res = await axios.get(import.meta.env.VITE_ACCEPT_RIDE, {
        params: { rideId },
        withCredentials: true,
      });

      console.log("Ride accepted:", res.data.data);
      setpickupride(res.data.data);
      dispatch(fillride(res.data.data));
      navigate('/captain-ongoing-rides');
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert("Failed to accept ride. Please try again.");
    }
  };

  // Ensure you return early if no details are provided
  if (!confromDetails) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md text-center">
        <p className="text-gray-600">No ride details available</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-sm px-4">
      <div className="w-full max-w-xl p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 transition-all duration-300 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <img src={logo} alt="Logo" className="h-10 drop-shadow" />
          <button
            onClick={() => {
              setridePopup(false);
              setConformRide(false);
            }}
            className="text-2xl text-gray-500 hover:text-red-500 transition"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">🚀 Ride Confirmation</h2>
        <p className="text-gray-500 mb-6">Review all the details before accepting the ride.</p>

        {/* Details */}
        <div className="space-y-4 text-sm text-gray-700 font-medium">
          <Detail label="ETA" value={`${confromDetails.ETA} minutes`} />
          <Detail label="Pickup Distance" value={`${(confromDetails.distance_p / 1000).toFixed(2)} km`} />
          <Detail label="Ride Distance" value={`${(confromDetails.distance / 1000).toFixed(2)} km`} />
          <Detail label="Pickup Location" value={confromDetails.pickup?.location || "N/A"} />
          <Detail label="Destination" value={confromDetails.destination?.location || "N/A"} />
          <Detail label="Fare" value={`₹${confromDetails.fare}`} />
          <Detail label="Customer" value={`${confromDetails.user?.fullname?.firstname} ${confromDetails.user?.fullname?.lastname}`} />
        </div>

        {/* Action */}
        <form onSubmit={submitHandler} className="mt-8">
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
          >
            Confirm & Accept Ride
          </button>
        </form>
      </div>
    </div>
  );
}

// Reusable detail row
const Detail = ({ label, value }) => (
  <div className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-800 font-semibold">{value}</span>
  </div>
);

export default ConformRidePopup;
