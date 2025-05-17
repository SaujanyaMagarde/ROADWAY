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

// Component to update map view when positions change
const SetViewOnLocation = ({ position, driverPosition, pickupPosition }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      // If we have multiple valid positions, fit bounds to show all points
      if ((driverPosition || pickupPosition)) {
        const points = [position];
        if (driverPosition) points.push(driverPosition);
        if (pickupPosition) points.push(pickupPosition);
        
        map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 15 });
      } else {
        // Otherwise just center on user position
        map.setView(position, 15);
      }
    }
  }, [position, driverPosition, pickupPosition, map]);
  
  return null;
};

// Improved RouteDisplay component with more reliable rendering
const RouteDisplay = ({ polylineString }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!polylineString) return;
    
    // Clean up function to remove layers
    let layersToRemove = [];
    
    try {
      // Decode Google's polyline format
      const decodedCoords = decodePolyline(polylineString);
      
      if (decodedCoords.length > 0) {
        // Create a shadow/outline effect first (wider, darker line underneath)
        const routeOutline = L.polyline(decodedCoords, {
          color: '#2563EB', // Darker blue
          weight: 12,      // Wider than the main line
          opacity: 0.7,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
        layersToRemove.push(routeOutline);
        
        // Create the main polyline with brighter color
        const routeHighlight = L.polyline(decodedCoords, {
          color: '#60A5FA', // Lighter blue
          weight: 8,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
        layersToRemove.push(routeHighlight);
        
        // Add simple arrow markers instead of relying on polylineDecorator
        // This is more reliable than polylineDecorator
        if (decodedCoords.length > 1) {
          // Add direction indicators (simple arrows) at regular intervals
          const arrowMarker = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            iconSize: [15, 15],
            iconAnchor: [7, 7]
          });
          
          // Place arrows at regular intervals along the route
          const interval = Math.max(1, Math.floor(decodedCoords.length / 5)); // Show about 5 arrows
          for (let i = interval; i < decodedCoords.length - 1; i += interval) {
            // Calculate arrow position and angle
            const point = decodedCoords[i];
            const nextPoint = decodedCoords[i + 1];
            const angle = calculateBearing(point, nextPoint);
            
            const marker = L.marker(point, {
              icon: arrowMarker,
              rotationAngle: angle,
              rotationOrigin: 'center'
            }).addTo(map);
            
            layersToRemove.push(marker);
          }
        }
        
        // Fit bounds to show the entire route with padding
        map.fitBounds(L.latLngBounds(decodedCoords), { padding: [50, 50] });
      }
    } catch (error) {
      console.error("Error processing polyline:", error);
    }
    
    // Clean up function to remove all added layers on unmount
    return () => {
      layersToRemove.forEach(layer => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [polylineString, map]);
  
  return null;
};

// Helper function to calculate bearing between two points
function calculateBearing(start, end) {
  const startLat = start[0] * Math.PI / 180;
  const startLng = start[1] * Math.PI / 180;
  const endLat = end[0] * Math.PI / 180;
  const endLng = end[1] * Math.PI / 180;
  
  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;
  
  return bearing;
}

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
const LiveLocationMap = ({ polyline, pickupLocation, driverLocation }) => {
  const [position, setPosition] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  
  // Helper to convert pickup location format to Leaflet format
  const convertPickupLocation = () => {
    if (!pickupLocation?.coordinates?.coordinates) return null;
    
    // Assuming coordinates are in [lng, lat] format (GeoJSON standard)
    const [lng, lat] = pickupLocation.coordinates.coordinates;
    return [lat, lng]; // Leaflet uses [lat, lng]
  };
  
  // Set driver position when driverLocation changes
  useEffect(() => {
    if (driverLocation?.lat && driverLocation?.lng) {
      setDriverPosition([driverLocation.lat, driverLocation.lng]);
    }
  }, [driverLocation]);
  
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

  // Create a pulsing circle marker effect
  const PulsingMarker = ({ position, color }) => {
    const map = useMap();
    
    useEffect(() => {
      if (!position) return;
      
      // Create a pulsing circle
      const pulsingIcon = L.divIcon({
        html: `
          <div class="pulse-marker-container">
            <div class="pulse-marker-icon" style="background-color: ${color}"></div>
            <div class="pulse-marker-ring" style="border-color: ${color}"></div>
          </div>
        `,
        className: "pulse-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      // Inject CSS for the pulsing effect if not already added
      if (!document.getElementById('pulse-marker-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-marker-style';
        style.innerHTML = `
          .pulse-marker-container {
            position: relative;
            width: 20px;
            height: 20px;
          }
          .pulse-marker-icon {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            position: absolute;
            top: 4px;
            left: 4px;
            z-index: 2;
          }
          .pulse-marker-ring {
            border: 3px solid;
            border-radius: 50%;
            height: 20px;
            width: 20px;
            position: absolute;
            animation: pulse 2s ease-out infinite;
            opacity: 0;
            z-index: 1;
          }
          @keyframes pulse {
            0% {
              transform: scale(0.3);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      const marker = L.marker(position, { icon: pulsingIcon }).addTo(map);
      
      return () => {
        map.removeLayer(marker);
      };
    }, [position, color, map]);
    
    return null;
  };

  // User icon (blue)
  const userIcon = createCustomIcon(
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    [25, 41]
  );
  
  // Pickup icon (green)
  const pickupIcon = createCustomIcon(
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    [25, 41]
  );
  
  // Driver icon (red)
  const driverIcon = createCustomIcon(
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    [25, 41]
  );

  return (
    <div className="h-screen w-full">
      {position ? (
        <MapContainer 
          center={position} 
          zoom={15} 
          className="h-full w-full"
          scrollWheelZoom={true}
          doubleClickZoom={true}
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User marker */}
          <Marker position={position} icon={userIcon}>
            <Popup>Your current location</Popup>
          </Marker>
          {/* User pulsing effect */}
          <PulsingMarker position={position} color="#3B82F6" />
          
          {/* Driver marker */}
          {driverPosition && (
            <>
              <Marker position={driverPosition} icon={driverIcon}>
                <Popup>Driver location</Popup>
              </Marker>
              {/* Driver pulsing effect */}
              <PulsingMarker position={driverPosition} color="#EF4444" />
            </>
          )}
          
          {/* Pickup location marker */}
          {pickupCoords && (
            <Marker position={pickupCoords} icon={pickupIcon}>
              <Popup>Pickup location</Popup>
            </Marker>
          )}
          
          {/* Route polyline - explicitly checking for polyline string */}
          {polyline && typeof polyline === 'string' && polyline.length > 0 && (
            <RouteDisplay polylineString={polyline} />
          )}
          
          {/* Keep view centered appropriately */}
          <SetViewOnLocation 
            position={position} 
            driverPosition={driverPosition}
            pickupPosition={pickupCoords}
          />
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