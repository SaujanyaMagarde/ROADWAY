import React from "react";

const SearchPanel = ({ setvehicalPanel }) => {
  const locationSuggestions = [
    { name: "Kempegowda International Airport", address: "KIAL Rd, Devanahalli, Bengaluru, Karnataka", icon: "ri-flight-takeoff-line" },
    { name: "Phoenix Marketcity", address: "Whitefield Rd, Devasandra Industrial Estate, Mahadevapura, Bengaluru, Karnataka", icon: "ri-map-pin-line" },
    { name: "Salarpuria Aura Block B", address: "BLOCK-B, TOUCH STONE, Chandana, Kadabeesanahalli, Bengaluru, Karnataka", icon: "ri-map-pin-line" },
    { name: "Sheraton Grand Bengaluru Whitefield", address: "Prestige Shantiniketan Hoodi, Whitefield, Bengaluru, Karnataka", icon: "ri-hotel-line" },
    { name: "KSR Bengaluru City Junction", address: "M.G. Railway Colony, Majestic, Bengaluru, Karnataka", icon: "ri-map-pin-line" }
  ];

  const handleSelectLocation = () => {
    setvehicalPanel(true); // Explicitly setting to `true` instead of toggling
  };

  return (
    <div className="bg-white h-full px-4 rounded-t-xl shadow-md">
      <div>
        {locationSuggestions.map((loc, index) => (
          <div
            key={index}
            className="flex items-start py-3 border-b cursor-pointer"
            onClick={handleSelectLocation} // Removed setPickup (lift state in `Home`)
          >
            <i className={`${loc.icon} text-2xl text-gray-700 mr-4`}></i>
            <div>
              <p className="text-lg font-medium">{loc.name}</p>
              <p className="text-sm text-gray-500">{loc.address}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Set Location on Map */}
      <div className="mt-4 flex items-center cursor-pointer text-lg">
        <i className="ri-map-pin-line text-2xl mr-3"></i> Set location on map
      </div>
    </div>
  );
};

export default SearchPanel;
