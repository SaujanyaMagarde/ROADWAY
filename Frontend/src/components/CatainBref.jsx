import React, {useState,useEffect} from 'react'
import logo from '../picture/logo.png';
import home_map from '../picture/home_map.gif'
import 'remixicon/fonts/remixicon.css';
import {Link} from 'react-router-dom';
import driverprofile from '../picture/driverprofile.png'
import axios from  'axios';

function CatainBref({setrideAvailablle,setridePopup}) {

  const [position, setPosition] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const submiteventhandler = async () => {
    if (!position) {
      alert("Location not available yet.");
      return;
    }

    const [lat, lng] = position;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_GET_RIDE}?lat=${lat}&lng=${lng}&maxDistance=5000`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        console.log("Nearby rides:", res.data.data.nearbyRides);
        const data = res.data.data.nearbyRides;
        setrideAvailablle(data);
        setridePopup(true);
      } else {
        alert("Please refresh the page and try again later");
      }
    } catch (error) {
      alert("Please refresh the page and try again later");
    }
  };

  return (
    <div className='items-center bg-white justify-between'>
              <div className='flex items-center justify-center gap-3'>
                <img className='h-10 w-10 rounded-full object-cover' src={driverprofile} alt=''/>
                <h4 className='text-lg font-medium'>Harsh Patel</h4>
                <h4 className='text-xl font-semibold'>$295.2</h4>
                <p className='text-sm font-medium'>Earned</p>
              </div>
              <div className='flex justify-center gap-5 items-start p-3 bg-gray-50 rounded-full mt-3'>
                <div className='text-center'>
                <i className=" text-3xl mb-2 font-thin ri-timer-2-line"></i>
                <h5 className='text-lg font-medium'>10.2</h5>
                <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='  text-center'  >
                <i className=" text-3xl mb-2 font-thin ri-speed-up-fill"></i>
                <h5 className='text-lg font-medium' >10.2</h5>
                <p className='text-sm text-gray-600' >Hours Online</p>
                </div>
                <div className='text-center'>
                <i className=" text-3xl mb-2 font-thin ri-booklet-line"></i>
                <h5 className='text-lg font-medium' >10.2</h5>
                <p className='text-sm text-gray-600' >Hours Online</p>
                </div>
              </div>
              <div className="flex w-11/12 max-w-sm mx-auto items-center justify-center bg-green-500 font-bold text-lg sm:text-xl text-white h-12 rounded-full shadow-md">
  <h1
  onClick={()=>{submiteventhandler()}}
  >SEARCH FOR RIDE</h1>
</div>
            </div>
  )
}

export default CatainBref