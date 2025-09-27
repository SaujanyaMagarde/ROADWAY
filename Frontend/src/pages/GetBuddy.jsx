import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {socket} from '../Store/SocketSlice.jsx';
import { useSelector,useDispatch } from 'react-redux';
import { initializeSocket } from '../Store/SocketSlice.jsx';
import { setConnected } from '../Store/SocketSlice.jsx';
import { store } from '../Store/Store.jsx';
import Selectbuddy from '../components/Selectbuddy.jsx';

function GetBuddy() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userid = useSelector((state) => state.auth.userdata);
  const [activeTab, setActiveTab] = useState("find"); // "find" or "join"
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [suggestion, setSuggestion] = useState([]);
  const [type, setType] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Separate loading states
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isSubmittingRide, setIsSubmittingRide] = useState(false);

  // Find Buddy states
  const [PickupCreate, setPickupCreate] = useState({
    location: "",
    lat: null,
    lng: null,
  });
  const [DestinationCreate, setDestinationCreate] = useState({
    location: "",
    lat: null,
    lng: null,
  });
  const [dateCreate, setDateCreate] = useState("");
  const [timeCreate, setTimeCreate] = useState("");
  const [rideTypeCreate, setRideTypeCreate] = useState("Moto");

  // Join Ride states
  const [PickupJoin, setPickupJoin] = useState({
    location: "",
    lat: null,
    lng: null,
  });
  const [DestinationJoin, setDestinationJoin] = useState({
    location: "",
    lat: null,
    lng: null,
  });
  const [dateJoin, setDateJoin] = useState("");
  const [timeJoin, setTimeJoin] = useState("");
  const [rideTypeJoin, setRideTypeJoin] = useState("Moto");

  //api data
  const [ride, setride] = useState(null);
  const [reqride, setReqride] = useState(null);

  //component controller
  const [buddyFound, setbuddyFound] = useState(false);

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
        alert("Please enable location access for better suggestions");
      }
    );
  }, []);

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchSuggestions = async (input) => {
    if (!input || !userLocation.lat || !userLocation.lon || input.length < 2) {
      setSuggestion([]);
      setShowSuggestions(false);
      return;
    }

    setIsFetchingSuggestions(true);
    setShowSuggestions(true);

    const url =
      `https://api.olamaps.io/places/v1/autocomplete?` +
      `location=${userLocation.lat},${userLocation.lon}` +
      `&input=${encodeURIComponent(input)}` +
      `&api_key=${import.meta.env.VITE_OLA_MAP_API_KEY}`;

    try {
      const response = await axios.get(url, {
        headers: {
          "X-Request-Id": `req_${Date.now()}`,
          "Content-Type": "application/json",
        },
      });

      let predictions = response.data.predictions || [];

      if (predictions.length > 0) {
        predictions = predictions
          .map((prediction) => {
            if (prediction.geometry?.location?.lat && prediction.geometry?.location?.lng) {
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lon,
                prediction.geometry.location.lat,
                prediction.geometry.location.lng
              );
              return {
                ...prediction,
                calculatedDistance: distance,
                distance_meters: distance * 1000,
              };
            }
            return prediction;
          })
          .sort((a, b) => {
            if (a.calculatedDistance && b.calculatedDistance) {
              return a.calculatedDistance - b.calculatedDistance;
            }
            return 0;
          });
      }

      setSuggestion(predictions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestion([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  const handleSuggestionSelect = (selectedSuggestion) => {
    const locationData = {
      location: selectedSuggestion.description,
      lat: selectedSuggestion.geometry?.location?.lat,
      lng: selectedSuggestion.geometry?.location?.lng,
    };

    if (activeTab === "find") {
      if (type === "from") {
        setPickupCreate(locationData);
      } else if (type === "to") {
        setDestinationCreate(locationData);
      }
    } else {
      if (type === "from") {
        setPickupJoin(locationData);
      } else if (type === "to") {
        setDestinationJoin(locationData);
      }
    }

    setSuggestion([]);
    setShowSuggestions(false);
  };

  const formatDistance = (distanceMeters) => {
    if (!distanceMeters) return "";
    if (distanceMeters < 1000) {
      return `${Math.round(distanceMeters)}m away`;
    } else {
      return `${(distanceMeters / 1000).toFixed(1)}km away`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let rideData = null;

    if (activeTab === "find") {
      if (!PickupCreate.location || !DestinationCreate.location || !dateCreate || !timeCreate) {
        alert("Please fill in all fields");
        return;
      }
      rideData = {
        pickup: PickupCreate,
        destination: DestinationCreate,
        date: dateCreate,
        time: timeCreate,
        rideType: rideTypeCreate,
      };
      console.log("Find Buddy - Ride Data Submitted:", rideData);
    } else {
      if (!PickupJoin.location || !DestinationJoin.location || !dateJoin || !timeJoin) {
        alert("Please fill in all fields");
        return;
      }
      rideData = {
        pickup: PickupJoin,
        destination: DestinationJoin,
        date: dateJoin,
        time: timeJoin,
        rideType: rideTypeJoin,
      };
      console.log("Join Ride - Ride Data Submitted:", rideData);
    }

    if (!rideData?.pickup?.lat || !rideData?.destination?.lat) {
      alert("Please select valid pickup and destination from suggestions");
      return;
    }

    setIsSubmittingRide(true);

    try {
      const res = await axios.post(
        import.meta.env.VITE_MAP_DIRECTION,
        {
          pickup: { lat: rideData.pickup.lat, lng: rideData.pickup.lng },
          destination: { lat: rideData.destination.lat, lng: rideData.destination.lng },
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const dis = (res?.data?.data?.data?.routes?.[0]?.legs?.[0]?.distance || 0) / 1000; //convert in kms
      const dur = (res?.data?.data?.data?.routes?.[0]?.legs?.[0]?.duration || 0) / 60; //convert in min
      const poly = res?.data?.data?.data?.routes?.[0]?.overview_polyline || "";

      const finalrideCreate = {
        pickup: {
          location: rideData.pickup.location,
          coordinates: {
            type: "Point",
            coordinates: [rideData.pickup.lng, rideData.pickup.lat],
          },
        },
        destination: {
          location: rideData.destination.location,
          coordinates: {
            type: "Point",
            coordinates: [rideData.destination.lng, rideData.destination.lat],
          },
        },
        distance: dis,
        duration: dur,
        departureDate: rideData.date,
        departureTime: rideData.time,
        fare: dis * 10,
        polyline: poly,
        rideType: rideData.rideType,
      };

      if(activeTab === "find"){
        try {
          const res = await axios.post(
            import.meta.env.VITE_BUDDY_SHARE_RIDE,
            finalrideCreate,
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log(res);
          navigate('/ongoing-for-buddy');
        } catch (error) {
          console.log(error)
        }
      }
      else if(activeTab === "join"){
        try {
          const res = await axios.post(
            import.meta.env.VITE_GET_BUDDY,
            finalrideCreate,
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log(res?.data?.data);
          setride(res?.data?.data);
          setbuddyFound(true);
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      console.error("Error fetching route:", error.response?.data || error.message);
      alert("Failed to submit ride. Please try again.");
    } finally {
      setIsSubmittingRide(false);
    }
  };

  const closeSuggestions = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setSuggestion([]);
    }, 200);
  };

  // Reset forms when switching tabs
  useEffect(() => {
    setPickupCreate({ location: "", lat: null, lng: null });
    setDestinationCreate({ location: "", lat: null, lng: null });
    setDateCreate("");
    setTimeCreate("");
    setRideTypeCreate("Moto");
    setPickupJoin({ location: "", lat: null, lng: null });
    setDestinationJoin({ location: "", lat: null, lng: null });
    setDateJoin("");
    setTimeJoin("");
    setRideTypeJoin("Moto");
    setSuggestion([]);
    setShowSuggestions(false);
  }, [activeTab]);


  //initialize socket , connect user and listen for getting accepted
  store.dispatch(initializeSocket());
  dispatch(setConnected(true));

  const user = useSelector((state) => state.auth.userdata);
  const isConnected = useSelector((state) => state.socket.connected);
  
  useEffect(() => {
    if (user && isConnected) {
      socket.emit("join", {
        userId: user._id,
        userType: "user",
      });
      
      const handleMessage = (data) => {
        if (data.type === "buddy_requested") {
          navigate('/ongoing-for-buddy');
          console.log(data);
          setReqride(data);
        }
      };
      socket.on("message", handleMessage);
      return () => {
        socket.off("message", handleMessage);
      };
    }
  }, [user, isConnected]);

  const fetchOngoingRide = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_GIVE_RIDE, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const data = res?.data?.data;
      if(data?.createdBy == userid._id){
        navigate('/ongoing-for-buddy');
      }
    } catch (error) {
      console.error("Error fetching ongoing ride:", error);
    }
  };

  const fetchOngoingRide2 = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_GIVE_REQUEST_RIDE, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const data = res?.data?.data;
      if(data){
        navigate('/info-buddy');
      }
    } catch (error) {
      console.error("Error fetching ongoing ride:", error);
    }
  };
  

  // 🔹 Fetch ride on mount
  useEffect(() => {
    fetchOngoingRide();
    fetchOngoingRide2();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4 text-white">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          className="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ✨ New Feature
        </motion.span>
      <h2
        onClick={()=>(
          navigate('/user-profile')
        )}
      className='w-15 h-15 absolute right-3 top-3 z-20'>
        <i className="ri-account-circle-2-line text-5xl"></i>
      </h2>
        <h1 className="text-2xl font-extrabold">Find Your Travel Buddy</h1>
        <p className="text-sm opacity-90">Share rides, save money, and make new friends 🚗</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("find")}
          className={`px-6 py-2 rounded-l-xl font-semibold transition ${
            activeTab === "find"
              ? "bg-white text-blue-600 shadow-lg"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Find Buddy
        </button>
        <button
          onClick={() => setActiveTab("join")}
          className={`px-6 py-2 rounded-r-xl font-semibold transition ${
            activeTab === "join"
              ? "bg-white text-green-600 shadow-lg"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Join Buddy
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={`bg-white text-gray-800 rounded-2xl shadow-xl p-5 border-l-4 ${
            activeTab === "find" ? "border-blue-500" : "border-green-500"
          }`}
        >
          <h2
            className={`text-lg font-semibold mb-3 ${
              activeTab === "find" ? "text-blue-600" : "text-green-600"
            }`}
          >
            {activeTab === "find" ? "🚘 Create Ride & Find Buddy" : "🤝 Be a Buddy & Join Ride"}
          </h2>

          {/* Shared Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Pickup */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Pickup Location *</label>
              <input
                type="text"
                placeholder="Enter pickup location"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={
                  activeTab === "find" ? PickupCreate.location || "" : PickupJoin.location || ""
                }
                onChange={(e) => {
                  if (activeTab === "find") {
                    setPickupCreate({ ...PickupCreate, location: e.target.value, lat: null, lng: null });
                  } else {
                    setPickupJoin({ ...PickupJoin, location: e.target.value, lat: null, lng: null });
                  }
                  fetchSuggestions(e.target.value);
                }}
                onClick={() => setType("from")}
                onBlur={closeSuggestions}
                required
              />
              {showSuggestions && type === "from" && (
                <div className="absolute top-full left-0 right-0 bg-white text-black rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 border">
                  {isFetchingSuggestions ? (
                    <div className="p-3 text-center text-gray-500">
                      <div className="animate-pulse">Finding closest locations...</div>
                    </div>
                  ) : suggestion.length > 0 ? (
                    suggestion.map((s, i) => (
                      <div
                        key={i}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                        onMouseDown={() => handleSuggestionSelect(s)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium">{s.description}</div>
                            {s.distance_meters && (
                              <div className="text-xs text-blue-600 mt-1">
                                📍 {formatDistance(s.distance_meters)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">No locations found</div>
                  )}
                </div>
              )}
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Destination *</label>
              <input
                type="text"
                placeholder="Enter destination"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={
                  activeTab === "find"
                    ? DestinationCreate.location || ""
                    : DestinationJoin.location || ""
                }
                onChange={(e) => {
                  if (activeTab === "find") {
                    setDestinationCreate({
                      ...DestinationCreate,
                      location: e.target.value,
                      lat: null,
                      lng: null,
                    });
                  } else {
                    setDestinationJoin({
                      ...DestinationJoin,
                      location: e.target.value,
                      lat: null,
                      lng: null,
                    });
                  }
                  fetchSuggestions(e.target.value);
                }}
                onClick={() => setType("to")}
                onBlur={closeSuggestions}
                required
              />
              {showSuggestions && type === "to" && (
                <div className="absolute top-full left-0 right-0 bg-white text-black rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 border">
                  {isFetchingSuggestions ? (
                    <div className="p-3 text-center text-gray-500">
                      <div className="animate-pulse">Finding closest locations...</div>
                    </div>
                  ) : suggestion.length > 0 ? (
                    suggestion.map((s, i) => (
                      <div
                        key={i}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                        onMouseDown={() => handleSuggestionSelect(s)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium">{s.description}</div>
                            {s.distance_meters && (
                              <div className="text-xs text-blue-600 mt-1">
                                📍 {formatDistance(s.distance_meters)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">No locations found</div>
                  )}
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Departure Date *</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={activeTab === "find" ? dateCreate || "" : dateJoin || ""}
                onChange={(e) =>
                  activeTab === "find" ? setDateCreate(e.target.value) : setDateJoin(e.target.value)
                }
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium mb-1">Departure Time *</label>
              <input
                type="time"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={activeTab === "find" ? timeCreate || "" : timeJoin || ""}
                onChange={(e) =>
                  activeTab === "find" ? setTimeCreate(e.target.value) : setTimeJoin(e.target.value)
                }
                required
              />
            </div>

            {/* Ride Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Ride Type *</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={activeTab === "find" ? rideTypeCreate : rideTypeJoin}
                onChange={(e) =>
                  activeTab === "find"
                    ? setRideTypeCreate(e.target.value)
                    : setRideTypeJoin(e.target.value)
                }
              >
                <option value="Moto">Moto</option>
                <option value="UberGo">UberGo</option>
                <option value="UberAuto">UberAuto</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`py-2 rounded-lg font-semibold transition disabled:bg-gray-400 ${
                activeTab === "find"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              disabled={isSubmittingRide}
            >
              {isSubmittingRide
                ? activeTab === "find"
                  ? "Creating Ride..."
                  : "Joining Ride..."
                : activeTab === "find"
                ? "Create Ride"
                : "Join Ride"}
            </button>
          </form>
        </div>
      </motion.div>

      {buddyFound && <Selectbuddy ride={ride} />}
    </div>
  );
}

export default GetBuddy;
