import React, { useState, useRef,useEffect } from 'react';
import logo from '../picture/logo.png';
import 'remixicon/fonts/remixicon.css';
import { Link, useNavigate } from 'react-router-dom';
import driverprofile from '../picture/driverprofile.png';
import CatainBref from '../components/CatainBref';
import RidePopup from '../components/ridePopup.jsx';
import ConformRidePopup from '../components/ConformRidePopup.jsx';
import LiveLocationMap from '../components/LiveLocationMap.jsx';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import GoToPickup from '../components/GoToPickup.jsx';
import { useSelector,useDispatch } from 'react-redux';
import { initializeSocket } from '../Store/SocketSlice.jsx';
import { setConnected } from '../Store/SocketSlice.jsx';
import { store } from '../Store/Store.jsx';
import { socket } from '../Store/SocketSlice.jsx';

function CaptainHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ridePopup, setridePopup] = useState(false);
  const ridePopupRef = useRef(null);
  const [routedetails, setroutedetails] = useState(null);
  const [conformRide, setConformRide] = useState(false);
  const conformRideRef = useRef(null);
  const [rideAvailablle, setrideAvailablle] = useState([])
  const [confromDetails, setconfromDetails] = useState(null)
  const [pickupride,setpickupride] = useState(null);

  store.dispatch(initializeSocket());
  dispatch(setConnected(true));

  const user = useSelector((state) => state.captainauth.captaindata);
  const isConnected = useSelector((state) => state.socket.connected);

  console.log(user);
  console.log(isConnected);
  useEffect(() => {
      console.log("juibdsv");
      if (user && isConnected) {
        console.log("running")
          socket.emit("join", {
              userId: user._id,
              userType: "captain",
          });
          console.log("🧩 Emitted join event!", user._id, user.role);
      }
  }, []);

  useGSAP(() => {
    gsap.to(ridePopupRef.current, {
      transform: ridePopup ? 'translateY(0)' : 'translateY(100%)',
      duration: 0.3,
    });
  }, [ridePopup]);

  useGSAP(() => {
    gsap.to(conformRideRef.current, {
      transform: conformRide ? 'translateY(0)' : 'translateY(100%)',
      duration: 0.3,
    });
  }, [conformRide]);

  return (
    <div className='relative w-full h-screen overflow-hidden bg-white'>
      {/* Logo */}
      <img
        className="w-24 h-auto absolute right-4 top-4 z-20"
        src={logo}
        alt="roadWay"
      />

      {/* Profile Icon */}
      <button
        onClick={() => navigate('/captain-profile')}
        className="absolute right-10 top-12 z-20"
      >
        <i className="ri-account-circle-2-line text-4xl text-gray-800"></i>
      </button>

      {/* Live Location Map */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <LiveLocationMap routedetails={routedetails} />
      </div>
      {/* Captain Brief */}
      <div className="absolute bottom-[0%] w-full z-30">
        <CatainBref setrideAvailablle={setrideAvailablle} setridePopup={setridePopup}/>
      </div>

      {/* Ride Popup */}
      <div
        ref={ridePopupRef}
        className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-4 py-6 rounded-t-2xl shadow-lg"
      >
        <RidePopup setridePopup={setridePopup} setConformRide={setConformRide} rideAvailablle={rideAvailablle} setconfromDetails={setconfromDetails}/>
      </div>

      {/* Confirm Ride Popup */}
      <div
        ref={conformRideRef}
        className="fixed w-full h-screen z-100 bottom-0 translate-y-full bg-white px-4 py-6 overflow-y-auto"
      >
        <ConformRidePopup
          setConformRide={setConformRide}
          setridePopup={setridePopup}
          confromDetails={confromDetails}
          setpickupride={setpickupride}
        />
      </div>
    </div>
  );
}

export default CaptainHome;
