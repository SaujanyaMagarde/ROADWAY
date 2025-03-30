import React from 'react'
import logo from '../picture/logo.png';
import home_map from '../picture/home_map.gif'
import 'remixicon/fonts/remixicon.css';
import {Link} from 'react-router-dom';
import driverprofile from '../picture/driverprofile.png'
import CatainBref from '../components/CatainBref';
import RidePopup from '../components/ridePopup.jsx'
import { useState,useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConformRidePopup from '../components/ConformRidePopup.jsx';
function CaptainHome() {
  const [ridePopup, setridePopup] = useState(true)
  const ridePopupRef = useRef(null);

  const [conformRide,setConformRide] = useState(false);
  const conformRideRef = useRef(null);

  useGSAP(() => {
    if (ridePopup) {
      gsap.to(ridePopupRef.current, {
        transform : 'translateY(0)',
        duration: 0.3 // Added animation duration
      });
    } else {
      gsap.to(ridePopupRef.current, {
        transform : 'translateY(100%)',
        duration: 0.3 // Added animation duration
      });
    }
  }, [ridePopup]);

  useGSAP(() => {
    if (conformRide) {
      gsap.to(conformRideRef.current, {
        transform : 'translateY(0)',
        duration: 0.3 // Added animation duration
      });
    } else {
      gsap.to(conformRideRef.current, {
        transform : 'translateY(100%)',
        duration: 0.3 // Added animation duration
      });
    }
  }, [conformRide]);

  return (
    <div className='h-screen'>
        <img className="w-25 absolute left-5 top-5" src={logo} alt="roadWay" />
        {/* <Link to='/captain-home' className='fixed right-2 top-2 h-15 w-15 bg-white flex items-center justify-center rounded-full'>
        <i className=" text-3xl font-bold ri-home-5-line"></i>
        </Link> */}
        <div className="h-3/4 w-screen">
            <img className="h-full w-full object-cover" src={home_map} alt="map" /> {/* Added alt tag */}
        </div>
          <div className='h-1/4 p-4'>
          <CatainBref/>
          </div>
        <div ref={ridePopupRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 ' >
          <RidePopup setridePopup={setridePopup} setConformRide={setConformRide} />
        </div>
        <div ref={conformRideRef} className='fixed w-full z-10 h-screen bottom-0 translate-y-full bg-white px-3 py-6 ' >
          <ConformRidePopup setConformRide={setConformRide}
          setridePopup={setridePopup}
          />
        </div>
    </div>
        
  )
}

export default CaptainHome