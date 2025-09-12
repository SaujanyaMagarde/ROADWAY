import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "../Store/SocketSlice.jsx";
import { useSelector, useDispatch } from "react-redux";
import { initializeSocket } from "../Store/SocketSlice.jsx";
import WaitForBuddy from "../components/waitforbuddy.jsx";
import ConformBuddy from "../components/ConformBuddy.jsx";

function OngoingBuddy() {
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.userdata);
  const isConnected = useSelector((state) => state.socket.connected);

  // 🔹 Fetch ongoing ride
  const fetchOngoingRide = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_GIVE_RIDE, {
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

  // 🔹 Initialize socket once
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
        if (data.type === "buddy_requested") {
          console.log("📩 Buddy requested:", data);
          fetchOngoingRide();
        }
      };

      socket.on("message", handleMessage);
      return () => socket.off("message", handleMessage);
    }
  }, [user, isConnected]);

  // 🔹 Conditional UI
  if (!ride) {
    return (
      <div>
        <p>No ride Created</p>
        <p onClick={() => navigate('/user-find-buddy')}>return to home</p>
      </div>
    )
  }

  if (ride.status === "open" && ride.request.length === 0) {
    return (
      <><WaitForBuddy ride = {ride}/></>
    )
  }

  if (ride.status === "open" && ride.request.length > 0) {
    // const buddy = ride.request[0]; // just showing the first buddy for now
    return (
      <><ConformBuddy ride = {ride}/></>
    );
  }

  if( ride.status === "accepted"){
    return(
      <div>ride bookedby buddies</div>
    )
  }

  return (
    <div>
        <p>No ride Created</p>
        <p onClick={() => navigate('/user-find-buddy')}>return to home</p>
      </div>
  )
}

export default OngoingBuddy;
