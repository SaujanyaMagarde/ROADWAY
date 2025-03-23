import React from 'react'
import logo from '../picture/logo.png'
import 'remixicon/fonts/remixicon.css';
function ConfromRide({setconfromRidePanel,setLookingforDriverPanel}) {
  return (
    <div>
      <h3
        onClick={()=>(setconfromRidePanel(false))}
        className="absolute top-0 flex justify-center w-full text-3xl opacity-100 cursor-pointer mb-2"
      >
          <i className="ri-arrow-down-wide-line"></i>
      </h3>
      <h3 className='text-2xl font-semibold mb-5' >Conform your Ride</h3>
      <div className=' gap-2 flex justify-between flex-col items-center' >
        <img src={logo} alt='logo'/>
      <div className='w-full'>
        <div className='flex items-center gap-5 p-3 border-b-2 '>
        <i className="ri-map-pin-user-fill"></i>
        <div >
          <h3 className='text-lg font-bold'>pune institute of technology</h3>
          <p className='text-base text-gray-600'></p>
        </div>
        </div>
        <div className='flex items-center gap-5 p-3 border-b-2 ' >
        <i className="ri-map-pin-2-fill text-lg"></i>
        <div >
          <h3 className='text-lg font-bold'>shivajinagar</h3>
          <p className='text-base text-gray-600'></p>
        </div>
        </div>
        <div className='flex items-center gap-5 ml-3 '>
        <i class="ri-currency-fill"></i>
        <div >
          <h3 className='text-lg font-bold'>$193.20</h3>
          <p className='text-base text-gray-600'>Cash Payment</p>
        </div>
        </div>
      </div>
        <button 
        onClick={()=>{
          setLookingforDriverPanel(true)
          setconfromRidePanel(false)
        }}
        className='w-full bg-green-400 font-semibold text-white p-2 rounded-lg '>Conform</button>
      </div>
    </div>
  )
}

export default ConfromRide