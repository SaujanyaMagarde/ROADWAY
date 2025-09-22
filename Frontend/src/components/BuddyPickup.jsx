import React, { useRef, useState, useEffect } from "react";
import logo from "../picture/logo.png";
import LiveLocationMap from "../components/LiveLocationMap.jsx";
import WaitforDriver from "../components/WaitforDriver.jsx";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WaitforBuddyDriver from "./WaitforBuddyDriver.jsx";

function BuddyPickup({ details = null }) {
  const navigate = useNavigate();

  const [driverLocation, setDriverLocation] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [totalDistance, setTotalDistance] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const waitingforDriverRef = useRef();

  // Initialize driver location to pickup point (default)
  useEffect(() => {
    if (details?.pickup?.coordinates?.coordinates) {
      setDriverLocation({
        lat: details.pickup.coordinates.coordinates[1],
        lng: details.pickup.coordinates.coordinates[0],
      });
    }
  }, [details]);

  // Track user location
  useEffect(() => {
    let watchId;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(userLoc);
          if (driverLocation) {
            fetchRoute(userLoc.lat, userLoc.lng, driverLocation.lat, driverLocation.lng);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [driverLocation]);

  // Fetch route to driver
  const fetchRoute = async (userLat, userLng, driverLat, driverLng) => {
    try {
      const url = `https://api.olamaps.io/routing/v1/directions?origin=${userLat},${userLng}&destination=${driverLat},${driverLng}&api_key=${
        import.meta.env.VITE_OLA_MAP_API_KEY
      }`;

      const response = await axios.post(url, {});

      if (response?.data?.routes?.[0]) {
        const route = response.data.routes[0];
        setPolyline(route.overview_polyline);
        setTotalDistance(route.legs[0].distance.value);
        setTotalTime(route.legs[0].duration.value);
      }
    } catch (err) {
      console.error("Route API error:", err.message || err);
    }
  };

  if (!details) return <div>Loading...</div>;

  return (
    <div className="h-screen relative">
      {/* Top Bar */}
      <img
        className="w-20 absolute right-4 top-14 z-20"
        src={logo}
        alt="roadWay"
      />
      <h2
        onClick={() => navigate("/user-profile")}
        className="absolute right-3 top-3 z-20 cursor-pointer"
      >
        <i className="ri-account-circle-2-line text-5xl"></i>
      </h2>

      {/* Distance + ETA */}
      {totalDistance && totalTime && (
        <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-90 p-3 shadow-md z-20 text-center">
          <div className="flex justify-center items-center space-x-6">
            <div className="flex items-center">
              <i className="ri-route-line text-blue-600 mr-1"></i>
              <span className="font-semibold">{(totalDistance / 1000).toFixed(2)} km</span>
            </div>
            <div className="flex items-center">
              <i className="ri-time-line text-blue-600 mr-1"></i>
              <span className="font-semibold">{Math.floor(totalTime / 60)} min</span>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="h-screen w-screen absolute top-0 left-0 z-0">
        <LiveLocationMap
          polyline={polyline}
          pickupLocation={details.pickup}
          driverLocation={driverLocation}
        />
      </div>

      {/* Bottom Panel */}
      <div
        ref={waitingforDriverRef}
        className="fixed w-full z-40 bottom-0 bg-white px-3 py-6 shadow-lg rounded-t-2xl"
      >
        <WaitforBuddyDriver
          ride={details}
          routeInfo={{
            distance: totalDistance,
            time: totalTime,
          }}
        />
      </div>
    </div>
  );
}

export default BuddyPickup;