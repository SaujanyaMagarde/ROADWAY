import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from '../picture/logo.png';
import 'remixicon/fonts/remixicon.css';
import LiveLocationMap from '../components/LiveLocationMap';
import GoToPickup from '../components/GoToPickup';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import { filluser,fillride } from '../Store/CaptainSlice.jsx';
import {socket} from '../Store/SocketSlice.jsx';
import { initializeSocket } from '../Store/SocketSlice.jsx';
import { setConnected } from '../Store/SocketSlice.jsx';
import { store } from '../Store/Store.jsx';
import Otpbox from '../components/Otpbox.jsx';

function RideStart({status=null,details=null}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gotopickRef = useRef(null);
  const otpboxref = useRef(null);
  const [otpbox, setotpbox] = useState(false)
  const [newotp, setnewotp] = useState(null)
  const [paymentId , setpaymentId] = useState(null);
  const ride = useSelector((state) => state.captainauth.rideData);
  const user = useSelector((state) => state.captainauth.userdata);
  const isConnected = useSelector((state) => state.socket.connected);
  const captain_id = useSelector((state)=>(state.captainauth.captaindata._id));
  const socket_id = user?.socket_id;
  const [isFullHeight, setIsFullHeight] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routePolyline, setRoutePolyline] = useState(null);

  useEffect(() => {
    if (status === "accepted" && details) {
      dispatch(fillride(details));
    }
  }, [status, details, dispatch]);


  const fetchUserData = async () => {
    if (!ride?.user) {
      setError("No passenger information available");
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(
        import.meta.env.VITE_GETUSERDATA,
        { user_id: ride.user },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response?.data?.data?.user) {
        dispatch(filluser(response.data.data.user));
      } else {
        setError("Passenger data not found");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load passenger data");
      console.error("Error fetching user data:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserData();
    const handlePolylineUpdate = (event) => {
      setRoutePolyline(event.detail);
    };

    window.addEventListener('polylineUpdated', handlePolylineUpdate);
    
    return () => {
      window.removeEventListener('polylineUpdated', handlePolylineUpdate);
    };
  }, []);
  
  useGSAP(() => {
    gsap.to(gotopickRef.current, {
      height: isFullHeight ? '48%' : '20%',
      duration: 0.3,
      ease: 'power2.out'
    });
  }, [isFullHeight]);

  useGSAP(()=>{
    if(otpbox){
      gsap.to(gotopickRef.current,{
        height: '0%',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(otpboxref.current,{
        height : '40%',
        duration : 0.3,
        ease : 'power2.out'
      });
    }
    else{
      gsap.to(otpboxref.current,{
        height : '0%',
        duration : 0.3,
        ease : 'power2.out'
      });
    }
  },[otpbox])


  
  return (
    <div className='relative w-full h-screen overflow-hidden bg-gray-100'>
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white bg-opacity-90 shadow-md px-4 py-2 flex justify-between items-center">
        <img
          className="w-24 h-auto"
          src={logo}
          alt="roadWay"
        />
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
        <LiveLocationMap polyline={routePolyline} pickupLocation={ride?.pickup} />
      </div>
      
      {/* GoToPickup Panel at Bottom */}
      <div
        ref={gotopickRef}
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
              onClick={fetchUserData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <GoToPickup
            setgopick={() => {}}
            isFullHeight={isFullHeight}
            setIsFullHeight={setIsFullHeight}
            ride={ride}
            user={user}
            setotpbox={setotpbox}
          />
        )}
      </div>

      <div
        ref={otpboxref}
        className="fixed bottom-0 left-0 w-full bg-white rounded-t-xl shadow-lg overflow-hidden z-50"
        style={{ height: '0%', transition: 'height 0.3s ease' }}
      >
        <Otpbox
        user = {user}
        />
      </div>

    </div>
  );
}

export default RideStart;