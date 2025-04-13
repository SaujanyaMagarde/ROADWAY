import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RidePopup({ setridePopup, setConformRide, rideAvailablle ,setconfromDetails}) {
  const [captainPosition, setCaptainPosition] = useState(null);
  const [captainExtraDetails, setCaptainExtraDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rideAvailablle) return;
    setIsLoading(false);
  }, [rideAvailablle]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCaptainPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    } else {
      console.error('Geolocation not supported');
    }
  }, []);

  const fetchDistance = async ({ captain_lat, captain_lng, pickup_lat, pickup_lng, index }) => {
    try {
      const apiKey = import.meta.env.VITE_OLA_MAP_API_KEY;
      const requestId = `distance-check-${index}`;

      const origin = `${captain_lat},${captain_lng}`;
      const destination = `${pickup_lat},${pickup_lng}`;
      const url = `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${origin}&destinations=${destination}&api_key=${apiKey}`;

      const response = await axios.get(url, {
        headers: {
          'X-Request-Id': requestId,
        },
      });

      const newElement = response.data.rows?.[0]?.elements?.[0];

      setCaptainExtraDetails((prev) => {
        const updated = [...prev];
        updated[index] = newElement;
        return updated;
      });
    } catch (error) {
      console.error(`Error fetching distance for ride ${index}:`, error);
    }
  };

  useEffect(() => {
    if (!captainPosition || !rideAvailablle || !Array.isArray(rideAvailablle) || rideAvailablle.length === 0) return;

    rideAvailablle.forEach((item, index) => {
      const [pickup_lng, pickup_lat] = item?.pickup?.coordinates?.coordinates || [];

      if (pickup_lat && pickup_lng) {
        fetchDistance({
          captain_lat: captainPosition[0],
          captain_lng: captainPosition[1],
          pickup_lat,
          pickup_lng,
          index,
        });
      }
    });
  }, [captainPosition, rideAvailablle]);

  const conform = (index)=>{
    const data = {
      ETA : (captainExtraDetails?.[index].duration / 60).toFixed(1),
      distance_p : captainExtraDetails?.[index]?.distance,
      pickup_polyline : captainExtraDetails?.[index]?.polyline,
      rideId : rideAvailablle?.[index]?._id,
      distance : rideAvailablle?.[index]?.distance,
      pickup : rideAvailablle?.[index]?.pickup,
      destination : rideAvailablle?.[index]?.destination,
      fare : rideAvailablle?.[index]?.fare,
      user : rideAvailablle?.[index]?.user,
    }
    console.log(data);
    setconfromDetails(data);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <div className="w-12 h-12 border-t-4 border-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Finding the best rides for you...</p>
        </div>
      </div>
    );
  }

  if (!rideAvailablle || !Array.isArray(rideAvailablle) || rideAvailablle.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Rides Found</h2>
        <p className="text-gray-600 mb-4">Please try again after some time. We couldn’t find any nearby rides.</p>
        <button 
          onClick={() => setridePopup(false)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛺 Available Rides</h2>
        <button 
          onClick={() => setridePopup(false)}
          className="text-2xl text-gray-500 hover:text-red-500 transition"
        >
          ✕
        </button>
      </div>

      {rideAvailablle.map((ride, index) => (
        <div 
          key={index}
          onClick={() =>{
            conform(index);
            setridePopup(false);
            setConformRide(true);
          }}
          className="p-5 mb-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-200 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Ride #{index + 1}</h3>
            <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
              ₹{ride?.fare || 0}
            </span>
          </div>

          <div className="space-y-3 text-gray-700 text-sm">
            <div>
              <span className="font-medium">📍 Pickup:</span> {ride?.pickup?.location || "N/A"}
            </div>
            {captainExtraDetails[index] && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p>⏱ <b>ETA:</b> {(captainExtraDetails[index].duration / 60).toFixed(1)} mins</p>
                <p>🛣 <b>Distance:</b> {(captainExtraDetails[index].distance / 1000).toFixed(2)} km</p>
              </div>
            )}
            <div>
              <span className="font-medium">📍 Destination:</span> {ride?.destination?.location || "N/A"}
            </div>

            <div className="pt-3 border-t border-gray-200 text-sm flex justify-between text-gray-600">
              <span>Total Distance: {(ride?.distance / 100 || 0).toFixed(2)} km</span>
              <span>👤 {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RidePopup;
