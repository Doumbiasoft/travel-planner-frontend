import React from "react";
import { MapPin, Building2 } from "lucide-react";
import type { HotelOffer } from "../types";
import HotelMap from "./HotelMap";

interface HotelOfferCardProps {
  hotel: HotelOffer;
  isRecommended?: boolean;
}

const HotelOfferCard: React.FC<HotelOfferCardProps> = ({
  hotel,
  isRecommended = false,
}) => {
  return (
    <div
      className={`bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-all ${
        isRecommended
          ? "border-[#FFE566] bg-[#FFFEF0]"
          : "border-gray-200 hover:border-[#FFE566]"
      }`}
    >
      {isRecommended && (
        <div className="mb-4 inline-block px-3 py-1 bg-[#FFE566] text-[#2B2B2B] rounded-full text-sm font-semibold">
          ⭐ Recommended
        </div>
      )}

      {/* Hotel Name and Chain */}
      <div className="mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Building2 className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {hotel.chainCode && (
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                  {hotel.chainCode}
                </span>
              )}
              <span className="text-gray-500">Hotel ID: {hotel.hotelId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      {hotel.address && (
        <div className="mb-4">
          <div className="flex items-start gap-2 text-gray-700">
            <MapPin className="w-4 h-4 mt-1 text-blue-500" />
            <div>
              {hotel.address.lines && hotel.address.lines.length > 0 && (
                <div className="font-medium mb-1">
                  {hotel.address.lines.join(", ")}
                </div>
              )}
              <div className="text-sm text-gray-600">
                {hotel.address.cityName}
                {hotel.address.postalCode && `, ${hotel.address.postalCode}`}
              </div>
              {hotel.address.countryCode && (
                <div className="text-sm text-gray-600">
                  {hotel.address.countryCode}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Google Map - Only show for recommended hotels */}
      {isRecommended && hotel.geoCode && (
        <HotelMap
          latitude={hotel.geoCode.latitude}
          longitude={hotel.geoCode.longitude}
          hotelName={hotel.name}
        />
      )}

      {/* Location Coordinates */}
      {hotel.geoCode && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Latitude:</span>
              <span className="ml-2 font-medium text-gray-700">
                {hotel.geoCode.latitude.toFixed(5)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Longitude:</span>
              <span className="ml-2 font-medium text-gray-700">
                {hotel.geoCode.longitude.toFixed(5)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelOfferCard;
