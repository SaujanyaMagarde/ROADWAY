import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ConformBuddy({ ride }) {
  const navigate = useNavigate();
  if (!ride) {
    return <p className="text-center text-gray-500">No ride found</p>;
  }

  const handleConfirm = async(buddyId) => {
    const rideId = ride?._id;
    try {
      const res = await axios.post(import.meta.env.VITE_BUDDY_ACCEPT, {rideId,buddyId }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async(buddyId) => {
    const rideId = ride?._id;
    try {
      const res = await axios.post(import.meta.env.VITE_BUDDY_REJECT, {rideId,buddyId }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ Confirmed user:", res);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      {/* Ride Summary */}
      <motion.div
        className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">🚖 Ride Details</h2>
        <div className="space-y-3">
          <p>
            <span className="font-semibold text-yellow-300">Pickup:</span>{" "}
            {ride.pickup?.location}
          </p>
          <p>
            <span className="font-semibold text-yellow-300">Destination:</span>{" "}
            {ride.destination?.location}
          </p>
          <p>
            <span className="font-semibold text-yellow-300">Date:</span>{" "}
            {ride.departureDate} |{" "}
            <span className="font-semibold text-yellow-300">Time:</span>{" "}
            {ride.departureTime}
          </p>
          <p>
            <span className="font-semibold text-yellow-300">Fare:</span> ₹
            {ride.fare?.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold text-yellow-300">Type:</span>{" "}
            {ride.rideType}
          </p>
        </div>
      </motion.div>

      {/* Requests Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">
          👥 Buddy Requests
        </h2>
        {ride.request.length === 0 ? (
          <p className="text-center text-gray-500">No requests yet...</p>
        ) : (
          ride.request.map((req, idx) => (
            <motion.div
              key={req._id || idx}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 flex flex-col items-center text-center hover:shadow-xl transition"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Avatar */}
              <img
                src={req.user?.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow mb-4"
              />

              {/* User Info */}
              <div className="space-y-2">
                <p className="text-lg font-bold text-slate-900">
                  {req.user?.fullname?.firstname} {req.user?.fullname?.lastname}
                </p>
                <p className="flex items-center justify-center text-slate-600 gap-1">
                  <Phone className="w-4 h-4 text-yellow-500" />
                  {req.user?.mobile_no}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl px-6 py-2 shadow-md transition"
                  onClick={() => handleConfirm(req.user?._id)}
                >
                  ✅ Confirm
                </button>
                <button
                  className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl px-6 py-2 shadow-md transition"
                  onClick={() => handleReject(req.user?._id)}
                >
                  ❌ Reject
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConformBuddy;
