import React from "react";
import { motion } from "framer-motion";
import logo from "../picture/logo.png";

function LookingforDriver({ conformDetails, type }) {
  // Select buddy or creator depending on type
  const userInfo =
    type === "buddy"
      ? conformDetails?.createdBy
      : conformDetails?.buddies?.[0]?.user;

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.h3
        className="text-2xl font-semibold mb-3 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Looking for a Driver
      </motion.h3>
      <hr className="border-blue-700 mb-5" />

      <div className="max-w-md px-4">
        <p className="text-center text-gray-500 text-sm leading-relaxed">
          IF WE CAN'T FIND DRIVER WITHIN <span className="font-semibold text-red-600">15 MIN</span>, 
          YOUR RIDE WILL BE CANCELED AND YOU WILL GET A FULL REFUND WITHIN 
          <span className="font-semibold text-green-600"> 5 MIN</span>.
        </p>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-5">
        <img src={logo} alt="logo" className="w-20 h-20 object-contain" />
      </div>

      


      {/* Ride Details */}
      <div className="w-full space-y-4">
        {/* Pickup */}
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-user-fill text-xl text-blue-600"></i>
          <div>
            <h3 className="text-lg font-bold">
              {conformDetails?.pickup?.location}
            </h3>
            <p className="text-base text-gray-600">Pickup Location</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-map-pin-2-fill text-xl text-green-600"></i>
          <div>
            <h3 className="text-lg font-bold">
              {conformDetails?.destination?.location}
            </h3>
            <p className="text-base text-gray-600">Drop Location</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-currency-fill text-xl text-yellow-600"></i>
          <div>
            <h3 className="text-lg font-bold">₹ {(conformDetails?.fare)/2}</h3>
            <p className="text-base text-gray-600">already paid</p>
          </div>
        </div>

        {/* Distance & Duration */}
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-road-map-fill text-xl text-purple-600"></i>
          <div>
            <h3 className="text-lg font-bold">
              {conformDetails?.distance?.toFixed(1)} km
            </h3>
            <p className="text-base text-gray-600">
              ~ {Math.round(conformDetails?.duration)} min
            </p>
          </div>
        </div>

        {/* Ride Date & Time */}
        <div className="flex items-center gap-5 p-3 border-b-2">
          <i className="ri-calendar-event-fill text-xl text-red-600"></i>
          <div>
            <h3 className="text-lg font-bold">
              {conformDetails?.departureDate}
            </h3>
            <p className="text-base text-gray-600">
              Departure at {conformDetails?.departureTime}
            </p>
          </div>
        </div>

        {/* User Info (Buddy OR Creator) */}
        {userInfo && (
          <div className="flex items-center gap-5 p-3">
            <img
              src={userInfo?.avatar}
              alt="user"
              className="w-12 h-12 rounded-full border"
            />
            <div>
              <h3 className="text-lg font-bold">
                {userInfo?.fullname?.firstname} {userInfo?.fullname?.lastname}
              </h3>
              <p className="text-base text-gray-600">
                📞 {userInfo?.mobile_no}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default LookingforDriver;
