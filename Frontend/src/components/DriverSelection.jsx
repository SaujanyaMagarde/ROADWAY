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
    pricePerKm: 10,
    image: carImage,
  },
  {
    id: 2,
    name: "Moto",
    capacity: 1,
    time: "3 mins away • 15:24",
    description: "Affordable motorcycle rides",
    pricePerKm: 8,
    image: motorImage,
  },
  {
    id: 3,
    name: "UberAuto",
    capacity: 3,
    time: "2 mins away • 15:24",
    description: "Affordable auto rides",
    pricePerKm: 9,
    image: autoImage,
  },
];

function DriverSelection({setvehicalPanel,setconfromRidePanel , setPanelOpen,setformPanel,pickup,destination,routedetails,setconformDetails}) {
  const [selectedId, setSelectedId] = useState(null);
  const ride = rideOptions
  const handleSelect = (vehicle) => {
    setvehicalPanel(false);
    setPanelOpen(false);
    setconfromRidePanel(true);
    const details = {
      name : vehicle.name,
      price : Math.round((routedetails?.distance || 1) * vehicle.pricePerKm),
      time : routedetails?.duration || vehicle?.time,
      distance : routedetails?.distance || 1,
      distance_m : routedetails?.distance_m || 1,
      pickup : pickup,
      destination : destination,
      polyline : routedetails?.polyline,
      steps : routedetails?.steps,
    }
    setconformDetails(details)
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
          <i className="ri-arrow-down-s-line"></i>
        </button>
      </div>

      {ride.map((vehicle, index) => (
        <div
          key={index}
          onClick={() => handleSelect(vehicle)}
          className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50"
        >
          <img src={vehicle.image} alt={vehicle.name} className="w-12 h-12 mr-4" />
          <div className="flex-1">
            <p className="text-lg font-semibold">
              {vehicle.name} <i className="ri-user-line ml-1"></i> {vehicle.capacity}
            </p>
            <p className="text-sm text-gray-500">{routedetails?.distance || 0}Km</p>
            <p className="text-sm text-gray-400">{routedetails?.duration || 0}</p>
          </div>
          <p className="text-lg font-semibold">
            ₹{Math.round((routedetails?.distance || 1) * vehicle.pricePerKm)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DriverSelection;
