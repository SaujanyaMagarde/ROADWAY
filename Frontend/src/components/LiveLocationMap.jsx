import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icons
const createCustomIcon = (iconUrl, size = [32, 32]) => {
  return L.icon({
    iconUrl,
    iconSize: size,
    iconAnchor: [size[0]/2, size[1]],
    popupAnchor: [0, -size[1]]
  });
};

// Component to update map view when position changes
const SetViewOnLocation = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  
  return null;
};

// Component to handle polyline display - simplified and more reliable
const RouteDisplay = ({ polylineString }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!polylineString) return;
    
    try {
      // Decode Google's polyline format
      const decodedCoords = decodePolyline(polylineString);
      
      if (decodedCoords.length > 0) {
        // Create the polyline directly with Leaflet
        const polyline = L.polyline(decodedCoords, {
          color: '#3B82F6',
          weight: 8, // Thicker line for better visibility
          opacity: 0.8
        }).addTo(map);
        
        // Fit bounds to show the entire route
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        
        // Clean up on unmount
        return () => {
          map.removeLayer(polyline);
        };
      }
    } catch (error) {
      console.error("Error processing polyline:", error);
    }
  }, [polylineString, map]);
  
  return null;
};

// Utility function to decode Google Maps Polyline format
function decodePolyline(str) {
  if (!str) return [];
  
  const poly = [];
  let index = 0, lat = 0, lng = 0;

  while (index < str.length) {
    let b, shift = 0, result = 0;
    
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    
    shift = 0;
    result = 0;
    
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    
    poly.push([lat * 1e-5, lng * 1e-5]);
  }
  
  return poly;
}

// Main component
const LiveLocationMap = ({ polyline, pickupLocation }) => {
  const [position, setPosition] = useState(null);
  
  // Helper to convert pickup location format to Leaflet format
  const convertPickupLocation = () => {
    if (!pickupLocation?.coordinates?.coordinates) return null;
    
    // Assuming coordinates are in [lng, lat] format (GeoJSON standard)
    const [lng, lat] = pickupLocation.coordinates.coordinates;
    return [lat, lng]; // Leaflet uses [lat, lng]
  };
  
  const pickupCoords = convertPickupLocation();
  
  // Setup geolocation tracking
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
      
      // Clean up on component unmount
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Driver icon (blue)
  const driverIcon = createCustomIcon(
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    [25, 41]
  );
  
  // Pickup icon (green)
  const pickupIcon = createCustomIcon(
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    [25, 41]
  );

  return (
    <div className="h-screen w-full">
      {position ? (
        <MapContainer 
          center={position} 
          zoom={15} 
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Driver marker */}
          <Marker position={position} icon={driverIcon}>
            <Popup>Your current location</Popup>
          </Marker>
          
          {/* Pickup location marker */}
          {pickupCoords && (
            <Marker position={pickupCoords} icon={pickupIcon}>
              <Popup>Pickup location</Popup>
            </Marker>
          )}
          
          {/* Route polyline - now using the simpler approach */}
          {polyline && <RouteDisplay polylineString={polyline} />}
          
          {/* Keep view centered on driver */}
          <SetViewOnLocation position={position} />
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700">Locating your position...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveLocationMap;