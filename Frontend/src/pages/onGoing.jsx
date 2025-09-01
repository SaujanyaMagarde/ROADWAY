import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './Home.jsx';
import UserRide from './UserRide.jsx';
import UserEndJourney from './UserEndJourney.jsx';
function OnGoing() {
  const [ride, setRide] = useState(null);

  const fetchRide = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_GET_ONGOING_RIDES, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
      });

      setRide(response?.data?.data); // assuming backend sends one ride object
    } catch (error) {
      console.error("Error fetching ongoing rides:", error);
    }
  };

  useEffect(() => {
    fetchRide();
  }, []);

  if (!ride) return <>Loading...</>;
  if (ride.status === "pending") return <><Home status="pending" details={ride}/></>;
  if (ride.status === "accepted") return <><UserRide status="accepted" details={ride}/></>;
  if (ride.status === "ongoing") return <><UserEndJourney status="ongoing" details={ride}/></>;
  return <>Unknown status</>;
}

export default OnGoing;
