import React from "react";
import { GoogleMap, InfoWindow, MarkerF, useLoadScript } from "@react-google-maps/api";
import { ENV } from "../config/env";

interface HotelMapProps {
  latitude: number;
  longitude: number;
  hotelName: string;
}

const HotelMap: React.FC<HotelMapProps> = ({
  latitude,
  longitude,
  hotelName,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: ENV.VITE_GOOGLE_MAP_API_KEY,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "8px",
  };

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    mapId: "TRAVEL_PLANNER_MAP", // Required for advanced markers
  };

  if (loadError) {
    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Hotel Location
        </h4>
        <div className="rounded-lg overflow-hidden border border-gray-200 p-4 text-center text-red-600">
          Error loading maps
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Hotel Location
        </h4>
        <div className="rounded-lg overflow-hidden border border-gray-200 p-4 text-center">
          Loading map...
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        Hotel Location
      </h4>
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={mapOptions}
        >
          <MarkerF
            position={center}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
          <InfoWindow
            position={center}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
              disableAutoPan: true,
            }}
          >
            <div style={{ padding: 0, margin: 0 }}>
              <h4
                style={{
                  margin: 0,
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#2B2B2B",
                }}
              >
                {hotelName}
              </h4>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  lineHeight: "1.4",
                }}
              >
                <div>Lat: {latitude.toFixed(5)}</div>
                <div>Lng: {longitude.toFixed(5)}</div>
              </div>
            </div>
          </InfoWindow>
        </GoogleMap>
      </div>
    </div>
  );
};

export default HotelMap;
