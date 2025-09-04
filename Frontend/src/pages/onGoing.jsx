import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './Home.jsx';
import UserRide from './UserRide.jsx';
import UserEndJourney from './UserEndJourney.jsx';
import { useNavigate } from 'react-router-dom';
function OnGoing() {
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();

  const fetchRide = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_GET_ONGOING_RIDES, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
      });

      setRide(response?.data?.data); // assuming backend sends one ride object

      console.log("Fetched ride:", response?.data?.data);
    } catch (error) {
      console.error("Error fetching ongoing rides:", error);
    }
  };

  useEffect(() => {
    fetchRide();
  }, []);

  if (!ride) return (
    <><button onClick={() => (navigate('/user-home'))}>Go to Home</button></>
  )
  if (ride.status === "pending") return <><Home status="pending" details={ride}/></>;
  if (ride.status === "accepted") return <><UserRide status="accepted" details={ride}/></>;
  if (ride.status === "ongoing") return <><UserEndJourney status="ongoing" details={ride}/></>;
  return <>Unknown status</>;
}

export default OnGoing;
