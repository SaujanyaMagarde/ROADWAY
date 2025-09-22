import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function GoToShareEnd({ ride = null, details = null }) {
  const dispatch = useDispatch();
  const [userLocation, setUserLocation] = useState(null);
  const [distanceToDestination, setDistanceToDestination] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [navigationStopped, setNavigationStopped] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const navigate = useNavigate();

  // check closeness (~30m)
  const locationsAreClose = (loc1, loc2, threshold = 0.0003) => {
    if (!loc1 || !loc2) return false;
    const latDiff = Math.abs(loc1.lat - loc2.lat);
    const lngDiff = Math.abs(loc1.lng - loc2.lng);
    return latDiff < threshold && lngDiff < threshold;
  };

  // Format distance nicely
  const formatDistance = (meters) => {
    if (!meters) return "Unknown";
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(currentCoords);

          const destination = {
            lat: ride?.destination?.lat,
            lng: ride?.destination?.lng,
          };

          if (locationsAreClose(currentCoords, destination)) {
            if (!navigationStopped) {
              setNavigationStopped(true);
              navigate("/to-destination");
            }
            return;
          }

          if (
            currentCoords &&
            destination.lat &&
            destination.lng &&
            !navigationStopped
          ) {
            try {
              const url = `https://api.olamaps.io/routing/v1/directions?origin=${currentCoords.lat},${currentCoords.lng}&destination=${destination.lat},${destination.lng}&api_key=${import.meta.env.VITE_OLA_MAP_API_KEY}`;
              const response = await axios.get(url);

              const newPolyline = response?.data?.routes[0]?.overview_polyline;
              const newRouteData = response?.data?.routes[0]?.legs[0]?.steps;
              const totalDistance =
                response?.data?.routes[0]?.legs[0]?.distance?.value;
              const totalTime =
                response?.data?.routes[0]?.legs[0]?.duration?.value;

              setPolyline(newPolyline);
              setRouteData(newRouteData);
              setDistanceToDestination(totalDistance);
              setEstimatedTime(totalTime);

              if (newRouteData && newRouteData.length > 0) {
                setCurrentStep(newRouteData[0]);
              }
            } catch (err) {
              console.error("❌ Route API error:", err.message || err);
            }
          }
        },
        (err) => {
          console.warn("⚠️ Geolocation error:", err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }, 2000);

    return () => clearInterval(intervalId);
  }, [ride, navigationStopped]);

  useEffect(() => {
    if (polyline) {
      window.dispatchEvent(
        new CustomEvent("polylineUpdated", { detail: polyline })
      );
    }
  }, [polyline]);

  const submithandler = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_CAPTAIN_COMPLETE_JOURNEY,
        { rideId: ride._id, paymentId: "cash" }, // ✅ consistent key name
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res);
      navigate("/captain-home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header */}
      <div className="w-full mx-auto px-4 py-3 bg-blue-600 flex items-center justify-between cursor-pointer rounded-t-xl transition-colors duration-200 hover:bg-blue-700 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <i className="ri-map-pin-line text-xl"></i>
          <h3 className="text-lg font-semibold">Destination Details</h3>
        </div>
      </div>

      {/* Navigation instructions */}
      <div className="w-full px-4 py-5 bg-white shadow-md border-l-4 border-blue-600">
        {navigationStopped ? (
          <div className="flex items-center justify-center gap-3 text-green-600">
            <i className="ri-checkbox-circle-line text-3xl"></i>
            <div>
              <p className="text-xl font-bold">You've arrived!</p>
              <p className="text-sm">End the ride to complete the journey</p>
            </div>
          </div>
        ) : currentStep ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-steering-2-line text-2xl text-blue-600"></i>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-800">
                  {routeData[0]?.instructions}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDistance(routeData[0]?.distance?.value)}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 px-2">
              <div className="flex items-center gap-1 text-gray-700">
                <i className="ri-route-line"></i>
                <span>{formatDistance(distanceToDestination)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <i className="ri-time-line"></i>
                <span>{Math.round(estimatedTime / 60)} min</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-16">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            <p className="text-gray-700">Calculating route...</p>
          </div>
        )}
      </div>

      {/* Passenger info */}
      <div className="flex-1 bg-white p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="ri-user-3-line text-2xl text-gray-600"></i>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {details?.createdBy?.fullname?.firstname} {details?.createdBy?.fullname?.lastname}
            </h2>
            <h2 className="text-lg font-semibold text-gray-800">
              {details?.buddies?.[0]?.user?.fullname?.firstname} {details?.buddies?.[0]?.user?.fullname?.lastname}
            </h2>

          </div>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <i className="ri-map-pin-fill text-xl text-red-500 mt-1"></i>
            <div>
              <p className="text-sm text-gray-500">Destination Location</p>
              <p className="text-base font-medium text-gray-800">
                {ride?.destination?.location}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-300 p-3 rounded-full mt-4">
          <button
            onClick={submithandler}
            type="button"
            className="text-xl font-bold flex items-center ml-18 gap-2"
          >
            END RIDE
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoToShareEnd;
