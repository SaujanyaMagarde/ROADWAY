import React from "react";
import { motion } from "framer-motion";
import { Phone, XCircle } from "lucide-react";

function WaitforAccept({ ride }) {
  const handleCancelRequest = () => {
    console.log("Cancel request clicked for ride:", ride._id);
    // TODO: Add API call to cancel request
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-50 p-6 flex flex-col items-center">
      {/* Ride Info Card */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl shadow-2xl p-6 w-full max-w-3xl mb-8 border border-white/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-4">🚖 Ride Details</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Pickup:</span> {ride.pickup?.location}
          </p>
          <p>
            <span className="font-semibold">Destination:</span> {ride.destination?.location}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {ride.departureDate} |{" "}
            <span className="font-semibold">Time:</span> {ride.departureTime}
          </p>
          <p>
            <span className="font-semibold">Fare:</span> ₹{ride.fare?.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {ride.rideType}
          </p>
        </div>
      </motion.div>

      {/* Created By Info */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl mb-6 border border-indigo-200 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">Created By</h3>
        <img
          src={ride.createdBy.avatar}
          alt="creator-avatar"
          className="w-24 h-24 rounded-full mx-auto border-2 border-indigo-500 mb-2"
        />
        <p className="text-lg font-bold">
          {ride.createdBy.fullname.firstname} {ride.createdBy.fullname.lastname}
        </p>
        <p className="flex items-center justify-center gap-1 text-indigo-600">
          <Phone className="w-4 h-4" /> {ride.createdBy.mobile_no}
        </p>
      </motion.div>

      {/* Waiting Info + Cancel Button */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl border border-indigo-100 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">⏳ Waiting for Approval</h3>
        <p className="text-gray-500 italic mb-4">
          Waiting for <span className="font-semibold">{ride.createdBy.fullname.firstname}</span> to accept your request
        </p>

        {/* Cancel Button */}
        <button
          onClick={handleCancelRequest}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl px-6 py-2 shadow-lg mx-auto transition"
        >
          <XCircle className="w-5 h-5" /> Cancel Request
        </button>

        {/* Waiting Animation */}
        <motion.div
          className="mt-6 w-16 h-16 rounded-full border-4 border-purple-400 border-t-transparent animate-spin mx-auto"
        />
      </motion.div>
    </div>
  );
}

export default WaitforAccept;
