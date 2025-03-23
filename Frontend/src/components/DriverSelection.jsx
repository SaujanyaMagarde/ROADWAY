import React, { useState } from "react";
import autoImage from "../picture/auto-removebg-preview.png";
import carImage from "../picture/carlogo-removebg-preview.png";
import motorImage from "../picture/motorcycle.png";
import 'remixicon/fonts/remixicon.css';


const rideOptions = [
  {
    id: 1,
    name: "UberGo",
    capacity: 4,
    time: "2 mins away • 15:24",
    description: "Affordable, compact rides",
    price: 193.2,
    image: carImage,
  },
  {
    id: 2,
    name: "Moto",
    capacity: 1,
    time: "3 mins away • 15:24",
    description: "Affordable motorcycle rides",
    price: 65.17,
    image: motorImage,
  },
  {
    id: 3,
    name: "UberAuto",
    capacity: 3,
    time: "2 mins away • 15:24",
    description: "Affordable auto rides",
    price: 118.21,
    image: autoImage,
  },
];

function DriverSelection({setvehicalPanel,setconfromRidePanel , setPanelOpen,setformPanel}) {
  const [selectedId, setSelectedId] = useState(null);
  const handleSelect = (id) => {
    setvehicalPanel(false);
    setPanelOpen(false);
    setconfromRidePanel(true);
    setSelectedId(id);
  };

  return (
    <div className="bg-white p-4 rounded-t-xl shadow-lg">
      <div className="relative">
        <h3
          onClick={() => setvehicalPanel(false)}
          className="absolute top-2 right-5 text-2xl opacity-100 cursor-pointer"
        >
          <i className="ri-arrow-down-wide-line"></i>
        </h3>

        <button className="flex items-center justify-between bg-gray-200 px-4 py-2 rounded-full text-lg mb-3 w-1/2">
          <i className="ri-time-line mr-2"></i> Leave Now 
          <i className="ri-arrow-down-s-line"></i> {/* Moved it inside flex */}
        </button>
      </div>

      {/* Ride Options List */}
      {rideOptions.map((ride) => (
        <div
          key={ride.id}
          className={`flex items-center p-4 border rounded-lg mb-2 cursor-pointer transition ${
            selectedId === ride.id ? "border-black shadow-md" : "border-gray-300"
          }`}
          onClick={() => handleSelect(ride.id)}
        >
          <img src={ride.image} alt={ride.name} className="w-12 h-12 mr-4" />
          <div className="flex-1">
            <p className="text-lg font-semibold">
              {ride.name} <i className="ri-user-line ml-1"></i> {ride.capacity}
            </p>
            <p className="text-sm text-gray-500">{ride.time}</p>
            <p className="text-sm text-gray-400">{ride.description}</p>
          </div>
          <p className="text-lg font-semibold">₹{ride.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default DriverSelection;
