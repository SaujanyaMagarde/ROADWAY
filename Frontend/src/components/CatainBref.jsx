import React from 'react'
import logo from '../picture/logo.png';
import home_map from '../picture/home_map.gif'
import 'remixicon/fonts/remixicon.css';
import {Link} from 'react-router-dom';
import driverprofile from '../picture/driverprofile.png'

function CatainBref() {
  return (
    <div className='items-center justify-between'>
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
            </div>
  )
}

export default CatainBref