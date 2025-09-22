import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { store } from '../Store/Store';
import { socket } from '../Store/SocketSlice';
import { initializeSocket } from '../Store/SocketSlice';
import { setConnected } from '../Store/SocketSlice';

function UserFinalRide({ isFullHeight, setIsFullHeight, ride, user }) {

  const [userLocation, setUserLocation] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [navigationStopped, setNavigationStopped] = useState(false);
  const [distanceToPickup, setDistanceToPickup] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleArrowClick = () => setIsFullHeight(!isFullHeight);

  // Range 30m 
  const locationsAreClose = (loc1, loc2, threshold = 0.0003) => {
    if (!loc1 || !loc2) return false;
    const latDiff = Math.abs(loc1.lat - loc2.lat);
    const lngDiff = Math.abs(loc1.lng - loc2.lng);
    return latDiff < threshold && lngDiff < threshold;
  };

  // Format distance in a more readable way
  const formatDistance = (meters) => {
    if (!meters) return "Unknown";
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Format time in a more readable way
  const formatTime = (seconds) => {
    if (!seconds) return "Unknown";
    if (seconds < 60) {
      return `${seconds} sec`;
    }
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Get clean instructions by removing HTML tags
  const cleanInstructions = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, '');
  };

  // Location tracking and route calculation
  useEffect(() => {
    if (!ride?.destination?.coordinates?.coordinates?.[1] || !ride?.destination?.coordinates?.coordinates?.[0]) {
      console.warn('No destination coordinates available');
      return;
    }

    const intervalId = setInterval(() => {
      if (!navigator.geolocation) {
        console.error('Geolocation not supported.');
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
            lat: ride?.destination?.coordinates?.coordinates?.[1],
            lng: ride?.destination?.coordinates?.coordinates?.[0],
          };

          // Check if user has reached destination
          if (locationsAreClose(currentCoords, destination)) {
            if (!navigationStopped) {
              setNavigationStopped(true);
            }
            return;
          }

          // Calculate route if navigation is still active
          if (currentCoords && destination.lat && destination.lng && !navigationStopped) {
            try {
              const url = `https://api.olamaps.io/routing/v1/directions?origin=${currentCoords.lat},${currentCoords.lng}&destination=${destination.lat},${destination.lng}&api_key=${import.meta.env.VITE_OLA_MAP_API_KEY}`;
              const response = await axios.post(url, {});
              
              if (response.data?.routes?.[0]) {
                const route = response.data.routes[0];
                const leg = route.legs?.[0];
                
                const newPolyline = route.overview_polyline;
                const newRouteData = leg?.steps;
                const totalDistance = leg?.distance?.value;
                const totalTime = leg?.duration?.value;

                setPolyline(newPolyline);
                setRouteData(newRouteData);
                setDistanceToPickup(totalDistance);
                setEstimatedTime(totalTime);

                // Set the current navigation step
                if (newRouteData && newRouteData.length > 0) {
                  setCurrentStep(newRouteData[0]);
                }
              }
            } catch (err) {
              console.error('❌ Route API error:', err.response?.data || err.message);
            }
          }
        },
        (err) => {
          console.warn('⚠️ Geolocation error:', err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }, 2000); // every 2 seconds

    return () => clearInterval(intervalId);
  }, [ride, navigationStopped, user]);

  // Update polyline for map component
  useEffect(() => {
    if (polyline) {
      window.dispatchEvent(new CustomEvent('polylineUpdated', { detail: polyline }));
    }
  }, [polyline]);
  
  const handleRideComplete = () => {
    navigate('/user-home');
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header with destination details toggle */}
      <div
        onClick={handleArrowClick}
        className="w-full mx-auto px-4 py-3 bg-blue-600 
                  flex items-center justify-between 
                  cursor-pointer rounded-t-xl transition-colors duration-200 
                  hover:bg-blue-700 text-white shadow-lg"
      >
        <div className="flex items-center gap-2">
          <i className="ri-map-pin-line text-xl"></i>
          <h3 className="text-lg font-semibold">Destination Details</h3>
        </div>
        <i className={`ri-arrow-${isFullHeight ? 'down' : 'up'}-s-line text-2xl`}></i>
      </div>

      {/* Navigation instructions */}
      <div className="w-full px-4 py-5 bg-white shadow-md border-l-4 border-blue-600">
        {navigationStopped ? (
          <div className="flex flex-col items-center justify-center gap-3 text-green-600">
            <div className="flex items-center gap-3">
              <i className="ri-checkbox-circle-line text-3xl"></i>
              <div>
                <p className="text-xl font-bold">You've arrived at your destination!</p>
                <p className="text-sm">Thank you for using our service</p>
              </div>
            </div>
            <button
              onClick={handleRideComplete}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Complete Ride
            </button>
          </div>
        ) : currentStep ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <i className="ri-navigation-line text-2xl text-blue-600"></i>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-800">
                  {routeData[0]?.instructions}
                </p>
                <p className="text-sm text-gray-600">
                  {routeData[0]?.distance} m 
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2 px-2">
              <div className="flex items-center gap-1 text-gray-700">
                <i className="ri-route-line"></i>
                <span>{routeData[0]?.distance}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <i className="ri-time-line"></i>
                <span>{routeData[0]?.duration}</span>
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

      {/* Destination information */}
      <div className="flex-1 bg-white p-4 border-t border-gray-200">
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <i className="ri-map-pin-fill text-xl text-red-500 mt-1"></i>
            <div>
              <p className="text-sm text-gray-500">Destination Location</p>
              <p className="text-base font-medium text-gray-800">
                {ride?.destination?.location || 'Destination Address'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserFinalRide;