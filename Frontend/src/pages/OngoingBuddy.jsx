import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "../Store/SocketSlice.jsx";
import { useSelector, useDispatch } from "react-redux";
import { initializeSocket } from "../Store/SocketSlice.jsx";
import WaitForBuddy from "../components/waitforbuddy.jsx";
import ConformBuddy from "../components/ConformBuddy.jsx";
import LookingforDriver from "../components/lookingforshareddriver.jsx";
import BuddyPickup from "../components/BuddyPickup.jsx";
import BuddyEndJourney from "./BuddyEndJourney.jsx";

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
        console.log("📩 Incoming socket message:", data);

        if (["buddy_requested", "ride_accepted", "ride_confirmed", "ride_start","ride_completed"].includes(data.type)) {
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

  // 🔹 Waiting for buddy (no requests yet)
  if (ride.status === "open" && ride.request.length === 0) {
    return <WaitForBuddy ride={ride} />;
  }

  // 🔹 Buddy has requested, waiting for confirmation
  if (ride.status === "open" && ride.request.length > 0) {
    return <ConformBuddy ride={ride} />;
  }

  // 🔹 Ride accepted, searching for captain/driver
  if (ride.status === "accepted" && !ride.captain) {
    return <LookingforDriver conformDetails={ride} type="creater" />;
  }

  // 🔹 Ride accepted with captain assigned
  if (ride.status === "accepted" && ride.captain) {
    return <BuddyPickup details={ride} />;
  }

  // 🔹 Ongoing ride
  if (ride.status === "ongoing") {
    return <BuddyEndJourney details={ride} />;
  }

  // 🔹 Fallback
  return (
    <div className="p-6 text-center text-gray-700 space-y-3">
      <p>No active ride available</p>
      <p
        onClick={() => navigate("/user-find-buddy")}
        className="cursor-pointer text-blue-500 underline"
      >
        Return to home
      </p>
    </div>
  );
}

export default OngoingBuddy;
