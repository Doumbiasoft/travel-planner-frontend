import React from "react";
import { Plane, Clock, Users, Briefcase } from "lucide-react";
import type { FlightOffer } from "../types";
import { format } from "date-fns";

interface FlightOfferCardProps {
  flight: FlightOffer;
  isRecommended?: boolean;
}

const FlightOfferCard: React.FC<FlightOfferCardProps> = ({
  flight,
  isRecommended = false,
}) => {
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (datetime: string) => {
    return format(new Date(datetime), "HH:mm");
  };

  const formatDate = (datetime: string) => {
    return format(new Date(datetime), "MMM dd");
  };

  // Get outbound and return itineraries
  const outbound = flight.itineraries[0];
  const returnFlight = flight.itineraries[1];

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

      {/* Price Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-3xl font-bold text-gray-800">
            ${parseFloat(flight.price.total).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {flight.validatingAirlineCodes.join(", ")}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{flight.numberOfBookableSeats} seats available</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {flight.pricingOptions.fareType.join(", ")}
          </div>
        </div>
      </div>

      {/* Outbound Flight */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
          <Plane className="w-4 h-4" />
          <span>Outbound</span>
        </div>
        <div className="space-y-3">
          {outbound.segments.map((segment, index) => (
            <div key={segment.id} className="relative">
              {index > 0 && (
                <div className="absolute left-8 -top-2 text-xs text-gray-500">
                  Layover
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        {formatTime(segment.departure.at)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {segment.departure.iataCode}
                        {segment.departure.terminal &&
                          ` T${segment.departure.terminal}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(segment.departure.at)}
                      </div>
                    </div>

                    <div className="flex-1 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          {formatDuration(segment.duration)}
                        </div>
                        <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                      </div>
                      <div className="text-center text-xs text-gray-500 mt-1">
                        {segment.carrierCode} {segment.number}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-800">
                        {formatTime(segment.arrival.at)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {segment.arrival.iataCode}
                        {segment.arrival.terminal &&
                          ` T${segment.arrival.terminal}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(segment.arrival.at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Total: {formatDuration(outbound.duration)}</span>
        </div>
      </div>

      {/* Return Flight */}
      {returnFlight && (
        <div>
          <div className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
            <Plane className="w-4 h-4 transform rotate-180" />
            <span>Return</span>
          </div>
          <div className="space-y-3">
            {returnFlight.segments.map((segment, index) => (
              <div key={segment.id} className="relative">
                {index > 0 && (
                  <div className="absolute left-8 -top-2 text-xs text-gray-500">
                    Layover
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold text-gray-800">
                          {formatTime(segment.departure.at)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {segment.departure.iataCode}
                          {segment.departure.terminal &&
                            ` T${segment.departure.terminal}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(segment.departure.at)}
                        </div>
                      </div>

                      <div className="flex-1 px-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="w-3 h-3" />
                            {formatDuration(segment.duration)}
                          </div>
                          <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                        </div>
                        <div className="text-center text-xs text-gray-500 mt-1">
                          {segment.carrierCode} {segment.number}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-800">
                          {formatTime(segment.arrival.at)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {segment.arrival.iataCode}
                          {segment.arrival.terminal &&
                            ` T${segment.arrival.terminal}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(segment.arrival.at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Total: {formatDuration(returnFlight.duration)}</span>
          </div>
        </div>
      )}

      {/* Baggage Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>
              {flight.travelerPricings[0]?.fareDetailsBySegment[0]
                ?.includedCheckedBags.quantity || 0}{" "}
              checked bag(s)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              {flight.travelerPricings[0]?.fareDetailsBySegment[0]
                ?.includedCabinBags.quantity || 0}{" "}
              cabin bag(s)
            </span>
          </div>
          <div className="ml-auto">
            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
              {flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightOfferCard;
