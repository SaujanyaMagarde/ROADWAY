import React, { use } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Calendar, Clock, Car } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Selectbuddy({ ride }) {  
  const navigate = useNavigate();
  if (!ride || ride.length === 0) {
    return (
      <div className="text-center text-gray-200 mt-6">
        🚫 No buddies found for this ride
      </div>
    );
  }

  const submit = async(buddyride) => {
    console.log(buddyride);
    try {
          const res = await axios.post(
            import.meta.env.VITE_REQUEST_BUDDY,
            buddyride,
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log(res);
          navigate("/info-buddy");
        } catch (error) {
          console.log(error)
        }
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        🚗 Available Buddies
      </h2>

      <div className="grid gap-4">
        {ride.map((buddyride, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 border-l-4 border-blue-500"
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img
                src={buddyride?.createdBy?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {buddyride?.createdBy?.fullname?.firstname}{" "}
                  {buddyride?.createdBy?.fullname?.lastname}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Phone size={14} /> {buddyride?.createdBy?.mobile_no}
                </p>
              </div>
            </div>

            {/* Ride Info */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-green-600" />
                <span>{buddyride?.pickup?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-red-600" />
                <span>{buddyride?.destination?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-purple-600" />
                <span>{buddyride?.departureDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                <span>{buddyride?.departureTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car size={16} className="text-indigo-600" />
                <span>{buddyride?.rideType}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-700 font-semibold">
                  ₹{buddyride?.fare}
                </span>
                <span className="text-gray-500"> / total</span>
              </div>
              <div className="flex items-center gap-2">
                ⏱ {Math.round(buddyride?.duration)} min
              </div>
              <div className="flex items-center gap-2">
                📏 {buddyride?.distance.toFixed(1)} km
              </div>
            </div>

            {/* Action button */}
            <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
                onClick={() => submit(buddyride)}
            >
              Join Buddy
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Selectbuddy;
