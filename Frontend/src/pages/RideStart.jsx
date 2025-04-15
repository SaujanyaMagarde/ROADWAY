import React from 'react'
import { useSelector } from 'react-redux'
function RideStart() {
  const ride = useSelector(state => state.captainauth.rideData);
  console.log(ride);
  return (
    <div>RideStart</div>
  )
}

export default RideStart