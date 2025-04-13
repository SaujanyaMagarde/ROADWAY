import React, { useState, useEffect } from "react";
import axios from "axios";
import 'remixicon/fonts/remixicon.css';

function FormPanel({
    setroutedetails,
    setvehicalPanel,
    setPanelOpen, 
    panelCloseRef, 
    setsuggestion, 
    settype, 
    pickup, 
    setPickup,
    destination, 
    setDestination,
    suggestion, // Added this prop to handle location suggestions
    type // Tracks if user is selecting "from" or "to"
}) {
    const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
    // Get user's current location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, []);

    // Function to fetch suggestions using Axios
    const fetchSuggestions = async (input) => {
        if (!input || !userLocation.lat || !userLocation.lon) return;

        const url = `https://api.olamaps.io/places/v1/autocomplete?location=${userLocation.lat},${userLocation.lon}&input=${input}&api_key=${import.meta.env.VITE_OLA_MAP_API_KEY}`;

        try {
            const response = await axios.get(url, {
                headers: { "X-Request-Id": "XXX" }
            });
            setsuggestion(response.data.predictions);
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
        }
    };

    // Handles user selection of a suggested location
    const handleSelectLocation = (location) => {
        if (type === 'from') {
            setPickup({
                location: location.description,
                lat: location.geometry.location.lat,
                lng: location.geometry.location.lng,
            });
        } else {
            setDestination({
                location: location.description,
                lat: location.geometry.location.lat,
                lng: location.geometry.location.lng,
            });
        }
        setPanelOpen(false); // Close suggestions panel
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!pickup.lat || !destination.lat) {
            alert("Please enter both pickup and destination locations.");
            return; // Stop function execution if validation fails
        }


        setvehicalPanel(true);
        setPanelOpen(false);

    
        try {
            const res = await axios.post(import.meta.env.VITE_MAP_DIRECTION, {
                pickup: { lat: pickup.lat, lng: pickup.lng },
                destination: { lat: destination.lat, lng: destination.lng }
            }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            });
            // Safely check if the routes array exists and has at least one element
            if (res.data && res.data.data && Array.isArray(res.data.data.data.routes) && res.data.data.data.routes.length > 0) {
                const routeData = res.data.data.data.routes[0];
                const routeInfo = {
                    distance: routeData.legs[0]?.readable_distance || "N/A",
                    distance_m: routeData.legs[0]?.distance || "N/A",
                    duration: routeData.legs[0]?.readable_duration || "N/A",
                    startLocation: routeData.legs[0]?.start_location || {},
                    endLocation: routeData.legs[0]?.end_location || {},
                    steps: routeData.legs[0]?.steps || [],
                    polyline: routeData.overview_polyline || "",
                    source: res.data.data.source_from || "Unknown",
                };
                                
                setroutedetails(routeInfo);
            } else {
                console.error("Route data is empty or unavailable.");
            }
        } catch (error) {
            console.error("Error fetching route:", error.response?.data || error.message);
        }
    };
    
    return (
        <>
            <h3
                ref={panelCloseRef}
                onClick={() => setPanelOpen(false)}
                className="absolute top-2 right-5 text-2xl opacity-0 cursor-pointer"
            >
                <i className="ri-arrow-down-wide-fill"></i>
            </h3>
            <h4 className="text-2xl font-bold">Find trip</h4>
            <form onSubmit={submitHandler}>
                <div className="line absolute h-16 w-1 top-[30%] bg-gray-600 left-9 rounded-full"></div>
                <input
                    className="input-field bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3 mb-3"
                    type="text"
                    value={pickup.location || ""}
                    onChange={(e) => {
                        setPickup({ location: e.target.value });
                        fetchSuggestions(e.target.value);
                    }}
                    onClick={() => (settype('from') , setPanelOpen(true))}
                    placeholder="Add a pickup location"
                />

                {/* Destination Input */}
                <input
                    className="input-field bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mb-3"
                    type="text"
                    value={destination.location || ""}
                    onChange={(e) => {
                        setDestination({ location: e.target.value });
                        fetchSuggestions(e.target.value);
                    }}
                    onClick={() => (settype('to') , setPanelOpen(true))}
                    placeholder="Enter your destination"
                />

                {/* Suggestions List */}
                {Array.isArray(suggestion) && suggestion.length > 0 && (
                    <div className="bg-white shadow-md p-2 rounded-lg mt-2">
                        {suggestion.map((loc, index) => (
                            <div 
                                key={index} 
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelectLocation(loc)}
                            >
                                {loc.description}
                            </div>
                        ))}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 mt-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300"
                >
                    Search for Ride
                </button>
            </form>
        </>
    );
}

export default FormPanel;
