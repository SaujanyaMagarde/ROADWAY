import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RidePopup({ setridePopup, setConformRide, rideAvailablle }) {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg shadow">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Looking for available rides...</p>
        </div>
      </div>
    );
  }

  if (!rideAvailablle || !Array.isArray(rideAvailablle) || rideAvailablle.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">No Rides Available</h2>
        <p className="text-gray-600">Sorry, we couldn't find any available rides at this moment. Please try again later.</p>
        <button 
          onClick={() => setridePopup(false)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }


  console.log(rideAvailablle);
  console.log(captainExtraDetails);
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Available Rides</h2>
        <button 
          onClick={() => setridePopup(false)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {rideAvailablle.map((ride, index) => (
        <div 
          key={index} 
          className="p-4 my-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          onClick={() => setConformRide && setConformRide(ride)}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-lg text-gray-800">🚖 Ride {index + 1}</p>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              ₹{ride?.fare || 0}
            </span>
          </div>
          
          <div className="space-y-2 text-gray-700">
            <p className="flex items-start">
              <span className="mr-2 text-blue-500">📍</span>
              <span className="flex-1">
                <span className="font-medium">Pickup: </span> 
                {ride?.pickup?.location || "Not specified"}
              </span>
            </p>
            
            {captainExtraDetails[index] && (
              <div className="bg-blue-50 p-2 rounded text-sm">
                <p className="flex items-center">
                  <span className="mr-2">⏱</span>
                  <span><b>ETA:</b> {(captainExtraDetails[index].duration / 60).toFixed(1)} min</span>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🛣</span>
                  <span><b>Distance:</b> {(captainExtraDetails[index].distance / 1000).toFixed(2)} km</span>
                </p>
              </div>
            )}
            
            <p className="flex items-start">
              <span className="mr-2 text-red-500">📍</span>
              <span className="flex-1">
                <span className="font-medium">Destination: </span>
                {ride?.destination?.location || "Not specified"}
              </span>
            </p>
            
            <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
              <span>Total: {(ride?.distance/100 || 0).toFixed(2)} km</span>
              <span>Time: {Math.floor((ride?.duration || 0)/60)} min</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
              <p>customer details :- </p>
              <p>{ride?.user?.fullname?.firstname}</p>
              <p>{ride?.user?.fullname?.lastname}</p>
            </div>
          </div>
        </div>
      ))}
      
    </div>
  );
}

export default RidePopup;