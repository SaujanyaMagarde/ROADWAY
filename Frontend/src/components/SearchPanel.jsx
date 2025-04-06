import React,{useState} from "react";
import 'remixicon/fonts/remixicon.css';
const SearchPanel = ({suggestion,type,setPickup,setDestination}) => {
  
  const locationSuggestions = suggestion;

  const handleSelectLocation = (location, type) => {
    if (type === 'from') {
      setPickup({
        location : location.description,
        lat : location.geometry.location.lat,
        lng : location.geometry.location.lng,
      })
    } else {
      setDestination({
        location : location.description,
        lat : location.geometry.location.lat,
        lng : location.geometry.location.lng,
      });
    }
  };

  return (
    <div className="bg-white h-full px-4 rounded-t-xl shadow-md">
      <div>
        {locationSuggestions.map((name , index) => (
          <div
            key={index}
            className="flex items-start py-3 border-b cursor-pointer"
            onClick={() =>{ 
              handleSelectLocation(name, type)
            }}
          >
            <i className="ri-map-pin-fill"></i>
            <div>
              <p className="text-lg font-medium">{name.description}</p>
              <p className="text-sm text-gray-500">{name.distance_meters
              }m</p>
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={()=>(alert('sooryy this function is currently under development '))}
      className="mt-4 flex items-center cursor-pointer text-lg">
        <i className="ri-map-pin-line text-2xl mr-3"></i> Set location on map
      </div>
    </div>
  );
};

export default SearchPanel;
