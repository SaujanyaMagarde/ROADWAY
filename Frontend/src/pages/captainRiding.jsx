import React from 'react'
import home_map from '../picture/home_map.gif'
import logo from '../picture/logo.png'
import 'remixicon/fonts/remixicon.css';
function CaptainRiding() {
  return (
    <div className='h-screen relative'>
        <img className="w-25 absolute left-5 top-5" src={logo}alt="roadWay" />
        <div className="h-3/4 w-screen">
            <img className="h-full w-full object-cover" src={home_map} alt="map" />
        </div>
        <div className="h-1/4 w-full bg-amber-300 flex flex-col items-center  p-1 gap-3">
        <div className="h-fit">
          <h3 className="text-3xl text-gray-200">
            <i className="ri-arrow-up-wide-line"></i>
          </h3>
        </div>
        <div className='flex gap-5 items-center justify-between'>
        <h4 className="text-xl font-bold">4 KM away</h4>
        <button className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform duration-200 hover:scale-105">
          Complete Ride
        </button>
        </div>
      </div>
    </div>
  )
}
export default CaptainRiding