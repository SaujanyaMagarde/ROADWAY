import React from 'react'
import logo from '../picture/logo.png'
import {Link} from 'react-router-dom'
function ConformRidePopup({setridePopup,setConformRide}) {
  const submithandler = ()=>{
    e.preventdefault();
  }
  return (
    
    <div>
          <h3
          onClick={()=>(setridePopup(false) , setConformRide(false))}
            className="absolute top-0 flex justify-center w-full text-3xl opacity-100 cursor-pointer mb-2"
          >
              <i className="ri-arrow-down-wide-line"></i>
          </h3>
          <h3 className='text-2xl mt-5 mb-5 font-bold ' >Conform this ride to start</h3>
          <div className='flex items-center bg-amber-400 p-3 mt-4 rounded-r-full justify-between'>
            <div className='flex items-center gap-3'>
              <img className='h-15 w-15 rounded-full' src={logo}/>
              <h2 className='text-xl font-bold'>Harsh Patel</h2>
            </div>
            <h5 className='text-lg font-semibold'>2.2 kM</h5>
          </div>
          <div className=' flex justify-between mt-4 gap-3 flex-col items-center' >
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
            <form 
            onSubmit={(e)=>(submithandler(e))}
            >
              <input type='text' className="input-field bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3 mb-3" placeholder='ENTER OTP'/>
            <Link
              to='/captain-riding'
              className='w-full flex justify-center mt-5 bg-green-400 font-semibold text-white p-2 rounded-lg '>Conform</Link>
            <button 
              onClick={()=>(setridePopup(false))}
              className='w-full mt-5  bg-gray-400 font-semibold text-white p-2 rounded-lg '>Cancel Ride</button>
            </form>
          </div>
        </div>
  )
}

export default ConformRidePopup