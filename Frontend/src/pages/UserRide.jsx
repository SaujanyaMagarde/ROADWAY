import React, { useRef, useState, useEffect } from 'react';
import logo from '../picture/logo.png';
import LiveLocationMap from '../components/LiveLocationMap.jsx';
import WaitforDriver from '../components/WaitforDriver.jsx';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { socket, initializeSocket, setConnected } from '../Store/SocketSlice.jsx';
import { store } from '../Store/Store.jsx';
import axios from 'axios';

function UserRide({ status = null, details = null }) {
  const waitingforDriverRef = useRef(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const rideFromStore = useSelector((state) => state.auth.rideData);
  const [ride, setride] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [driverlocation, setdriverlocation] = useState(null);
  const [polyline, setPolyline] = useState(null);

  // New states to track route information
  const [routeData, setRouteData] = useState(null);
  const [totalDistance, setTotalDistance] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  
  // State to track user's current location
  const [userLocation, setUserLocation] = useState(null);

  // Initialize socket
  useEffect(() => {
    store.dispatch(initializeSocket());
    dispatch(setConnected(true));
  }, []);

  const user = useSelector((state) => state.auth.userdata);
  const isConnected = useSelector((state) => state.socket.connected);

  // Sync ride state with Redux store
  useEffect(() => {
    if (rideFromStore) setride(rideFromStore);
  }, [rideFromStore]);

  // Sync ride state with props when status/details change
  useEffect(() => {
    if (status === "accepted" && details) {
      setride(details);
    }
  }, [status, details]);

  // Socket connection effect
  useEffect(() => {
    if (user && isConnected) {
      socket.emit("join", {
        userId: user._id,
        userType: "user",
      });
      console.log("🧩 Emitted join event!", user._id, user.role);

      const handleMessage = (data) => {
        console.log("Socket message received:", data);
        if (data.type === 'captain_location') {
          console.log("Driver location updated:", data.location);
          setdriverlocation(data.location);
        }
        if (data.type === 'customer_picked') {
          navigate('/user-ongoing-rides');
        }
      };

      socket.on("message", handleMessage);
      return () => {
        socket.off("message", handleMessage);
      };
    }
  }, [user, isConnected, navigate]);

  // GSAP animation effect for panel
  useGSAP(() => {
    if (!isPanelOpen) {
      gsap.to(waitingforDriverRef.current, {
        y: '100%',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    } else if (isCollapsed) {
      gsap.to(waitingforDriverRef.current, {
        y: '55%',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    } else {
      gsap.to(waitingforDriverRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  }, [isPanelOpen, isCollapsed]);

  // Set up user location tracking
  useEffect(() => {
    let watchId;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(userLoc);

          if (driverlocation) {
            fetchRoute(userLoc.lat, userLoc.lng, driverlocation.lat, driverlocation.lng);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [driverlocation]);

  // Function to fetch route
  const fetchRoute = async (userLat, userLng, driverLat, driverLng) => {
    try {
      console.log("Fetching route from user:", userLat, userLng, "to driver:", driverLat, driverLng);
      const url = `https://api.olamaps.io/routing/v1/directions?origin=${userLat},${userLng}&destination=${driverLat},${driverLng}&api_key=${import.meta.env.VITE_OLA_MAP_API_KEY}`;

      const response = await axios.post(url, {});

      if (response?.data?.routes?.[0]) {
        const newPolyline = response.data.routes[0].overview_polyline;
        const newRouteData = response.data.routes[0].legs[0].steps;
        const newTotalDistance = response.data.routes[0].legs[0].distance.value;
        const newTotalTime = response.data.routes[0].legs[0].duration.value;

        setPolyline(newPolyline);
        setRouteData(newRouteData);
        setTotalDistance(newTotalDistance);
        setTotalTime(newTotalTime);
      }
    } catch (err) {
      console.error('❌ Route API error:', err.message || err);
    }
  };

  // React to driver location changes
  useEffect(() => {
    if (driverlocation && userLocation) {
      fetchRoute(
        userLocation.lat,
        userLocation.lng,
        driverlocation.lat,
        driverlocation.lng
      );
    }
  }, [driverlocation, userLocation]);

  return (
    <div className="h-screen relative">
      <img className="w-25 absolute right-4 top-15 z-20" src={logo} alt="roadWay" />
      <h2
        onClick={() => navigate('/user-profile')}
        className="w-15 h-15 absolute right-3 top-3 z-20"
      >
        <i className="ri-account-circle-2-line text-5xl"></i>
      </h2>

      {totalDistance && totalTime && (
        <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-90 p-3 shadow-md z-20 text-center">
          <div className="flex justify-center items-center space-x-4">
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

      <div className="h-screen w-screen absolute top-0 left-0 z-0 pointer-events-auto">
        <LiveLocationMap 
          polyline={polyline} 
          pickupLocation={ride?.pickup}
          driverLocation={driverlocation} 
        />
      </div>

      <div
        ref={waitingforDriverRef}
        className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6"
      >
        <WaitforDriver
          ride={ride}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          closePanel={() => setIsPanelOpen(false)}
          routeInfo={{
            distance: totalDistance,
            time: totalTime
          }}
        />
      </div>
    </div>
  );
}

export default UserRide;
