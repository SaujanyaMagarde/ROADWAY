import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../picture/logo.png";
import "remixicon/fonts/remixicon.css";
import LiveLocationMap from "../components/LiveLocationMap";
import GoToShareEnd from "../components/GoToShareEnd.jsx";

function CaptainShareEnd({ details = null }) {
  console.log(details);
  const navigate = useNavigate();
  const gotopickRef = useRef(null);
  const [routePolyline, setRoutePolyline] = useState(null);

  useEffect(() => {
    const handlePolylineUpdate = (event) => {
      setRoutePolyline(event.detail);
    };

    window.addEventListener("polylineUpdated", handlePolylineUpdate);

    return () => {
      window.removeEventListener("polylineUpdated", handlePolylineUpdate);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Top Nav */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white bg-opacity-90 shadow-md px-4 py-2 flex justify-between items-center">
        <img className="w-24 h-auto" src={logo} alt="roadWay" />
        <div className="flex items-center gap-3">
          <button
            className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
            onClick={() => navigate("/captain-profile")}
            aria-label="Profile"
          >
            <i className="ri-user-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <LiveLocationMap
          polyline={routePolyline}
          pickupLocation={details?.destination}
        />
      </div>

      {/* Bottom Panel */}
      <div
        ref={gotopickRef}
        className="fixed w-full z-50 bottom-0 bg-white rounded-t-xl shadow-lg overflow-hidden"
        style={{ maxHeight: "85vh" }}
      >
        <GoToShareEnd ride={details} details={details} />
      </div>
    </div>
  );
}

export default CaptainShareEnd;
