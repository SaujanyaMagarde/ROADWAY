import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

function WaitforDriver({ ride, isCollapsed, setIsCollapsed, closePanel }) {
  const rideData = useSelector((state) => state.auth.rideData);
  const [captaindata, setcaptaindata] = useState(null);
  const [rideinfo, setrideinfo] = useState(null);

  const getCaptaindata = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_GETCAPTAINDATA,
        { captain_id: rideData.captainId },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setcaptaindata(res.data.data.captain);
    } catch (error) {
      console.log(error);
    }
  };

  const getRidedata = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_GETRIDEINFO,
        { ride_id: rideData.rideId },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setrideinfo(res.data.data.ride);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCaptaindata();
    getRidedata();
  }, []);

  return (
    <div className="relative">
      <h5
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-1 text-center w-[93%] absolute top-0 z-50"
      >
        <i
          className={`text-3xl text-gray-400 ri-arrow-${isCollapsed ? 'up' : 'down'}-wide-line`}
        ></i>
      </h5>

      <div className="flex items-center justify-between mt-8">
        <img
          className="h-12"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">
            {captaindata?.fullname?.firstname} {captaindata?.fullname?.lastname}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">{captaindata?.vehicle?.plate}</h4>
          <p className="text-sm text-gray-600">{captaindata?.vehicle?.vehicleType}</p>
          <h1 className="text-lg font-semibold">{captaindata?.vehicle?.color}</h1>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{rideinfo?.pickup?.location}</h3>
              <p className="text-sm -mt-1 text-gray-600">{rideinfo?.rideType}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{rideinfo?.destination?.location}</h3>
              <p className="text-sm -mt-1 text-gray-600">{(rideinfo?.distance * 0.001).toFixed(2)} km</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">{rideinfo?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitforDriver;
