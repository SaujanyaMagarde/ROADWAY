import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from '../picture/logo.png';
import 'remixicon/fonts/remixicon.css';
import LiveLocationMap from '../components/LiveLocationMap';
import UserFinalRide from '../components/UserFinalRide.jsx';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { setConnected } from '../Store/SocketSlice.jsx';
import { initializeSocket } from '../Store/SocketSlice.jsx';
import { store } from '../Store/Store.jsx';

function UserEndJourney() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gotodestRef = useRef(null);
  const ridedetails = useSelector((state) => state.auth.rideData);
  const user = useSelector((state) => state.auth.userdata);

  const [isFullHeight, setIsFullHeight] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [ride, setRide] = useState(null);

  const fetchRideData = async () => {
    try {
      if (!ridedetails?.rideId) {
        console.warn('Ride ID is missing, fetch skipped.');
        return;
      }

      setLoading(true);
      console.log("Fetching ride info for ride ID:", ridedetails.rideId);

      const response = await axios.post(
        import.meta.env.VITE_GETRIDEINFO,
        { ride_id: ridedetails.rideId },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      const fetchedRide = response?.data?.data?.ride;

      if (fetchedRide) {
        setRide(fetchedRide);
        setError(null);
      } else {
        setError("No ride information found.");
      }
    } catch (err) {
      console.error("Error fetching ride data:", err?.response?.data || err.message);
      setError("Failed to load ride information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ridedetails?.rideId) {
      fetchRideData();
    }
  }, [ridedetails?.rideId]);

  useEffect(() => {
    const handlePolylineUpdate = (event) => {
      setRoutePolyline(event.detail);
    };
    window.addEventListener('polylineUpdated', handlePolylineUpdate);
    return () => {
      window.removeEventListener('polylineUpdated', handlePolylineUpdate);
    };
  }, []);

  useEffect(() => {
    store.dispatch(initializeSocket());
    dispatch(setConnected(true));
  }, [dispatch]);

  useGSAP(() => {
    if (gotodestRef.current) {
      gsap.to(gotodestRef.current, {
        height: isFullHeight ? '33%' : '20%',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isFullHeight]);

  return (
    <div className='relative w-full h-screen overflow-hidden bg-gray-100'>
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white bg-opacity-90 shadow-md px-4 py-2 flex justify-between items-center">
        <img className="w-24 h-auto" src={logo} alt="roadWay" />
        <div className="flex items-center gap-3">
          <button
            className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/captain-profile')}
            aria-label="Profile"
          >
            <i className="ri-user-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <LiveLocationMap 
          polyline={routePolyline} 
          pickupLocation={ride?.destination} 
        />
      </div>

      {/* Bottom Panel */}
      <div
        ref={gotodestRef}
        className="fixed w-full z-50 bottom-0 bg-white rounded-t-xl shadow-lg overflow-hidden"
        style={{ maxHeight: '85vh' }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading passenger data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <i className="ri-error-warning-line text-2xl text-red-500"></i>
            </div>
            <p className="text-red-500 font-medium">{error}</p>
            <button 
              onClick={fetchRideData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <UserFinalRide
            isFullHeight={isFullHeight}
            setIsFullHeight={setIsFullHeight}
            ride={ride}
            user={user}
          />
        )}
      </div>
    </div>
  );
}

export default UserEndJourney;
