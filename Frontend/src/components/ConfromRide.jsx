import React from 'react';
import logo from '../picture/logo.png';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';

function ConfirmRide({ setconfromRidePanel, setLookingforDriverPanel, conformDetails }) {
  if (!conformDetails) {
    return <h1>Loading...</h1>;
  }
  console.log(conformDetails);

  const submitHandler = async (e) => {
    e.preventDefault();
    const rideData = {
      destination: conformDetails.destination,
      pickup: conformDetails.pickup,
      distance: conformDetails.distance_m,// in m
      duration: conformDetails.time, // in readable
      fare: conformDetails.price,
      rideType: conformDetails.name,
    };

    try {
      const res = await axios.post(import.meta.env.VITE_RIDE_BOOK, rideData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      setLookingforDriverPanel(true);
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
  };

  return (
    <div>
      <h3
        onClick={() => setconfromRidePanel(false)}
        className="absolute top-0 flex justify-center w-full text-3xl opacity-100 cursor-pointer mb-2"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h3>
      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>
      <div className="gap-2 flex justify-between flex-col items-center">
        <img src={logo} alt="logo" />
        <div className="w-full">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-bold">{conformDetails.pickup.location}</h3>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-2-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-bold">{conformDetails.destination.location}</h3>
            </div>
          </div>
          <div className="flex items-center gap-5 ml-3">
            <i className="ri-currency-fill"></i>
            <div>
              <h3 className="text-lg font-bold">{conformDetails.price}</h3>
              <p className="text-base text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>

        <form onSubmit={submitHandler} className="w-full">
          <button
            type="submit"
            onClick={() => {
              setconfromRidePanel(false);
            }}
            className="w-full bg-green-400 font-semibold text-white p-2 rounded-lg"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConfirmRide;
