import React from "react";
import { motion } from "framer-motion";
import { Loader2, MapPin, Clock, IndianRupee, Users } from "lucide-react";

function WaitForBuddy({ ride, onCancel }) {
  if (!ride) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6"
      >
        {/* Heading */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-indigo-600" />
          </motion.div>
          <h2 className="text-xl font-semibold mt-4 text-gray-800">
            Waiting for a Buddy...
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Ride created successfully. We’ll notify you once someone joins!
          </p>
        </div>

        {/* Ride Details */}
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="text-gray-800 font-medium">{ride.pickup?.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="text-gray-800 font-medium">{ride.destination?.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <p className="text-gray-800 font-medium">
              {ride.departureDate} at {ride.departureTime}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <IndianRupee className="w-5 h-5 text-yellow-600" />
            <p className="text-gray-800 font-medium">Fare: ₹{ride.fare.toFixed(0)}</p>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-indigo-600" />
            <p className="text-gray-800 font-medium">
              Buddies Joined: {ride.buddies?.length || 0}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 text-center">
          {ride.request?.length === 0 ? (
            <p className="text-gray-500 italic">No requests yet...</p>
          ) : (
            <p className="text-gray-700">You have {ride.request.length} requests 🎉</p>
          )}
        </div>

        {/* Cancel Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md transition"
          >
            Cancel Ride
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default WaitForBuddy;
