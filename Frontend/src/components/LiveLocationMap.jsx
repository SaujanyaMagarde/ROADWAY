import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import polyline from "@mapbox/polyline";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LiveLocationMap = ({ routedetails }) => {
  const [position, setPosition] = useState(null);

  // ✅ Decode polyline if it exists, else set an empty array
  const polylineString = routedetails?.polyline ?? "";
  const decodedPolyline = polyline.decode(polylineString);
  const formattedPolyline = decodedPolyline.map(([lat, lng]) => ({ lat, lng }));

  // Get Start and End Points
  const startPoint = formattedPolyline.length > 0 ? formattedPolyline[0] : null;
  const endPoint = formattedPolyline.length > 1 ? formattedPolyline[formattedPolyline.length - 1] : null;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="h-[70%]">
      {position && Array.isArray(position) ? (
        <MapContainer center={position} zoom={13} className="h-full w-full" style={{ zIndex: 1 }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>Your current location</Popup>
          </Marker>

          {/* ✅ Polyline for the Route */}
          {formattedPolyline.length > 1 && (
            <>
              <Polyline positions={formattedPolyline} color="blue" weight={5} opacity={0.8} />

              {/* ✅ Start Marker */}
              {startPoint && (
                <Marker position={startPoint}>
                  <Popup>Start Point</Popup>
                </Marker>
              )}

              {/* ✅ End Marker */}
              {endPoint && (
                <Marker position={endPoint}>
                  <Popup>End Point</Popup>
                </Marker>
              )}
            </>
          )}
        </MapContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <p className="text-lg">Loading your location...</p>
        </div>
      )}
    </div>
  );
};

export default LiveLocationMap;
