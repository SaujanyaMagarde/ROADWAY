import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import WaitforAccept from "../components/WaitforAccept";

function InfoBuddy() {
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 Fetch ongoing ride
  const fetchOngoingRide = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_GIVE_REQUEST_RIDE, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const data = res?.data?.data;
      setRide(data);
    } catch (error) {
      console.error("Error fetching ongoing ride:", error);
    }
  };

  // 🔹 Fetch ride on mount
  useEffect(() => {
    fetchOngoingRide();
  }, []);

  // 🔹 Log ride updates
  useEffect(() => {
    if (ride) {
      console.log("Ride updated:", ride);
    }
  }, [ride]);

  // 🔹 Handle no ride
  if (!ride) {
    return (
      <div className="p-6 text-center text-gray-700 space-y-3">
        <p>No ride created yet</p>
        <p
          onClick={() => navigate("/user-find-buddy")}
          className="cursor-pointer text-blue-500 underline"
        >
          Return to home
        </p>
      </div>
    );
  }

  // 🔹 Ride waiting for acceptance
  if (ride.status === "open") {
    return <WaitforAccept ride={ride} />;
  }

  // 🔹 Ride in other statuses
  return (
    <div className="p-6 text-center text-gray-700">
      <p>No active ride available</p>
    </div>
  );
}

export default InfoBuddy;
