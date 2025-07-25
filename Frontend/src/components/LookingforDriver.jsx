import React from 'react'
import logo from '../picture/logo.png'
function LookingforDriver({conformDetails}) {
  return (
    <div>
      <h3 className='text-2xl font-semibold mb-5' >Looking for a Driver</h3>
      <hr className='text-blue-700 '/>
      <div className=' gap-2 flex justify-between flex-col items-center' >
        <img src={logo} alt='logo'/>
      <div className='w-full'>
        <div className='flex items-center gap-5 p-3 border-b-2 '>
        <i className="ri-map-pin-user-fill"></i>
        <div >
          <h3 className='text-lg font-bold'>{conformDetails?.pickup.location}</h3>
          <p className='text-base text-gray-600'></p>
        </div>
        </div>
        <div className='flex items-center gap-5 p-3 border-b-2 ' >
        <i className="ri-map-pin-2-fill text-lg"></i>
        <div >
          <h3 className='text-lg font-bold'>{conformDetails?.destination.location}</h3>
          <p className='text-base text-gray-600'></p>
        </div>
        </div>
        <div className='flex items-center gap-5 ml-3 '>
        <i class="ri-currency-fill"></i>
        <div 
        >
          <h3 className='text-lg font-bold'>{conformDetails?.price}</h3>
          <p className='text-base text-gray-600'>Cash Payment</p>
        </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default LookingforDriver