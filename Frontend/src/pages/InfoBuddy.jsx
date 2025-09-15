import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../Store/SocketSlice.jsx";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import WaitforAccept from "../components/WaitforAccept";
import { initializeSocket } from "../Store/SocketSlice.jsx";
import LookingforDriver from "../components/lookingforshareddriver.jsx";

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

  const user = useSelector((state) => state.auth.userdata);
  const isConnected = useSelector((state) => state.socket.connected);

  useEffect(() => {
    dispatch(initializeSocket());
  }, [dispatch]);

  // 🔹 Socket listeners
  useEffect(() => {
    if (user && isConnected) {
      socket.emit("join", {
        userId: user._id,
        userType: user.role || "user", // send actual role
      });
      console.log("🧩 Emitted join event!", user._id, user.role);

      const handleMessage = (data) => {
        console.log("📩 Ride status update:", data);
        if (data.type === "ride_confirmed") {
          console.log("📩 Ride confirmed:", data);
          fetchOngoingRide();
        }
      };

      socket.on("message", handleMessage);
      return () => socket.off("message", handleMessage);
    }
  }, [user, isConnected]);

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
  else if(ride.status==="accepted"){
    return(
      <LookingforDriver conformDetails = {ride} type = "buddy"/>
    )
  }

  // 🔹 Ride in other statuses
  return (
    <div className="p-6 text-center text-gray-700">
      <p>No active ride available</p>
    </div>
  );
}

export default InfoBuddy;
