import React, { useEffect, useState } from "react";
import axios from "axios";
import RideStart from "./RideStart";
import CaptainendJurny from "./CaptainendJurny";
import { useNavigate } from "react-router-dom";
function OnGoingCaptain() {
  const [ongoingRide, setOngoingRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOngoingRide = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_CAPTAIN_FETCH_ONGOING_RIDES,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setOngoingRide(response?.data?.data || null);
      } catch (error) {
        console.error("❌ Error fetching ongoing ride:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingRide();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="animate-pulse">Fetching your ride...</p>
      </div>
    );
  }

  if (ongoingRide?.[0]?.status === "accepted") {
    return <RideStart status="accepted" details={ongoingRide?.[0]} />;
  }

  if (ongoingRide?.[0]?.status === "ongoing") {
    return <CaptainendJurny status="ongoing" details={ongoingRide?.[0]} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">
        No Ongoing Rides
      </h2>
      <p className="text-gray-600">You have no ongoing rides at the moment.</p>
      <div onClick={()=>navigate('/captain-home')}  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Go to Home
      </div>
    </div>
  );
}

export default OnGoingCaptain;
