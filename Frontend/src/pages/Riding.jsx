import React from 'react'
import logo from '../picture/logo.png';
import home_map from '../picture/home_map.gif'
import 'remixicon/fonts/remixicon.css';
import {Link} from 'react-router-dom'
function Riding() {
  return (
    <div className='h-screen'>
        <img className="w-25 absolute left-5 top-5" src={logo} alt="roadWay" />
        <Link to='/user-home' className='fixed right-2 top-2 h-15 w-15 bg-white flex items-center justify-center rounded-full'>
        <i className=" text-3xl font-bold ri-home-5-line"></i>
        </Link>
        <div className="h-1/2 w-screen">
            <img className="h-full w-full object-cover" src={home_map} alt="map" /> {/* Added alt tag */}
        </div>
          <div className='h-1/2 p-4'>
          <div className='flex items-center justify-between'>
          <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
          <div className='text-right'>
            <h2 className='text-lg font-medium capitalize'>Hamilton</h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1'>0000</h4>
            <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
            <h1 className='text-lg font-semibold'>4567</h1>
          </div>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
          <div className='w-full mt-5'>
            <div className='flex items-center gap-5 p-3 border-b-2'>
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm -mt-1 text-gray-600'>Shivajinagar</p>
              </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
              <i className="ri-currency-line"></i>
              <div>
                <h3 className='text-lg font-medium'>₹193.20</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
            <button className='w-full bg-green-500 h-15 text-2xl font-bold rounded-lg mt-4' >Make a payment</button>
        </div>
    </div>
  )
}

export default Riding