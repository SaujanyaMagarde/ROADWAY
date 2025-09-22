import React from "react";
import "remixicon/fonts/remixicon.css";

function WaitforDriver({ ride = null, routeInfo = null }) {
  if (!ride) {
    return <div className="p-4 text-center">Loading ride info...</div>;
  }

  console.log(ride);

  const captain = ride?.captain;

  return (
    <div className="relative p-4">
      {/* Captain Info */}
      {captain ? (
        <div className="flex items-center justify-between mt-3 border-b pb-3">
          <img
            className="h-14 w-14 rounded-full object-cover"
            src={
              captain.avatar && captain.avatar.trim() !== ""
                ? captain.avatar
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="driver"
          />
          <div className="text-right flex-1 ml-3">
            <h4 className="text-xl font-semibold">OTP: {ride?.otp}</h4>
            <h2 className="text-lg font-medium capitalize">
              {captain.fullname?.firstname} {captain.fullname?.lastname}
            </h2>
            <h4 className="text-md font-semibold">
              Plate No: {captain.vehicle?.plate || "-"}
            </h4>
            <p className="text-sm text-gray-600">
              {captain.vehicle?.vehicleType || "-"} •{" "}
              {captain.vehicle?.color || "-"}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-3">
          Waiting for driver assignment...
        </div>
      )}

      {/* Ride Info */}
      <div className="mt-5 space-y-3">
        {/* Pickup */}
        <div className="flex items-center gap-4 p-3 border rounded-xl">
          <i className="ri-map-pin-user-fill text-xl text-blue-500"></i>
          <div>
            <h3 className="text-lg font-medium">{ride.pickup?.location}</h3>
            <p className="text-sm text-gray-600">{ride.rideType}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-4 p-3 border rounded-xl">
          <i className="ri-map-pin-2-fill text-xl text-green-500"></i>
          <div>
            <h3 className="text-lg font-medium">{ride.destination?.location}</h3>
            <p className="text-sm text-gray-600">
              {ride.distance?.toFixed(2)} km
            </p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-center gap-4 p-3 border rounded-xl">
          <i className="ri-currency-line text-xl text-yellow-500"></i>
          <div>
            <h3 className="text-lg font-medium">₹ {ride.fare}</h3>
            <p className="text-sm text-gray-600">Cash</p>
          </div>
        </div>
      </div>

      {/* Route Info */}
      {routeInfo && routeInfo.distance && routeInfo.time && (
        <div className="mt-3 text-center text-gray-700">
          <p>
            Distance: {(routeInfo.distance / 1000).toFixed(2)} km | ETA:{" "}
            {Math.floor(routeInfo.time / 60)} min
          </p>
        </div>
      )}
    </div>
  );
}

export default WaitforDriver;
