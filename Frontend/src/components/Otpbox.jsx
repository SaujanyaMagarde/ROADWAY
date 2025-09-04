import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { store } from '../Store/Store';
import { socket } from '../Store/SocketSlice';
import { initializeSocket } from '../Store/SocketSlice';
import { setConnected } from '../Store/SocketSlice';

function Otpbox({user}) {
  const [otp, setOtp] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const ride = useSelector((state) => (state.captainauth.rideData));
  const navigate = useNavigate();
  const rideId = ride?._id;
  const socket_id = user?.socketId;

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!otp || !paymentId) {
      alert('Please fill out both fields.');
      return;
  }

  try {
      const res = await axios.post(
      import.meta.env.VITE_STARTJURNEY,
      { rideId: rideId,
          otp : otp,
      },
      {
          withCredentials: true,
          headers: {
          "Content-Type": "application/json"
          }
      }
      );

      const res1 = await axios.post(
        import.meta.env.VITE_CAPTAIN_PICKED_CUSTOMER,
        { socket_id: socket_id},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(res1);
      navigate('/captain-ongoing-rides');
  } catch (error) {
      console.log(error);
  }

  setOtp('');
  setPaymentId('');
  };

return (
  <form
    onSubmit={handleSubmit}
    className="max-w-md mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl space-y-6 border border-gray-100"
  >
    <div>
      <h1 className="text-2xl font-semibold mb-2 text-gray-800">OTP</h1>
      <input
        type="text"
        placeholder="Enter your OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
      />
    </div>

    <div>
      <h1 className="text-2xl font-semibold mb-2 text-gray-800">Payment ID</h1>
      <input
        type="text"
        placeholder="Enter your Payment ID"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
      />
    </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition duration-300 shadow-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default Otpbox;
