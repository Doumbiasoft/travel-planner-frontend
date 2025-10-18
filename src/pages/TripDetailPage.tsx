import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tabs, Alert } from "antd";
import { Calendar, DollarSign, MapPin, AlertCircle } from "lucide-react";
import unitOfWork from "../api/unit-of-work";
import { formatDate } from "../utils";
import type { ITrip, TripOffersData } from "../types";
import FlightOfferCard from "../components/FlightOfferCard";
import HotelOfferCard from "../components/HotelOfferCard";

const TripDetailPage: React.FC = () => {
  const urlParams = useParams();
  const tripId = urlParams.id;

  // Fetch trip details
  const {
    data: tripData,
    isLoading: isTripLoading,
    isError: isTripError,
    error: tripError,
  } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const response = await unitOfWork.trip.getATrip(tripId!);
      const result: ITrip = response.data;
      return result;
    },
    refetchInterval: false,
    enabled: !!tripId,
  });

  const {
    data: offersData,
    isLoading: isOffersLoading,
    isError: isOffersError,
    error: offersError,
  } = useQuery({
    queryKey: ["tripOffers", tripId],
    queryFn: async () => {
      const f_data = {
        tripId: tripId!,
        originCityCode: tripData?.originCityCode!,
        destinationCityCode: tripData?.destinationCityCode!,
        startDate: tripData?.startDate.split("T")[0]!,
        endDate: tripData?.endDate.split("T")[0]!,
        budget: tripData?.budget.toString()!,
      };
      const response = await unitOfWork.amadeus.getTripOffers(f_data);
      return response.data as TripOffersData;
    },
    refetchInterval: false,
    enabled: !!tripData,
  });

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <div className="mb-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-[#FFE566] transition-colors text-sm"
          >
            <span className="text-2xl">←</span>
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Trip Details</h1>
      </div>

      {isTripLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spin size="large" />
          <p className="text-gray-600 mt-4">Loading trip details...</p>
        </div>
      ) : isTripError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Error loading trip
          </h3>
          <p className="text-gray-500 mb-4">
            {tripError instanceof Error
              ? tripError.message
              : "Something went wrong"}
          </p>
        </div>
      ) : tripData ? (
        <div className="space-y-6">
          {/* Trip Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {tripData.tripName}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">
                  <span className="font-medium">{tripData.origin}</span> (
                  {tripData.originCityCode}) →{" "}
                  <span className="font-medium">{tripData.destination}</span> (
                  {tripData.destinationCityCode})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">
                  {formatDate(tripData.startDate)} -{" "}
                  {formatDate(tripData.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700 font-semibold">
                  ${tripData.budget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Trip Offers Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Available Offers
            </h3>

            {/* Validation Status Alert */}
            {tripData.validationStatus && !tripData.validationStatus.isValid ? (
              <Alert
                message="Trip Validation Issue"
                description={
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">
                        {tripData.validationStatus.reason?.includes(
                          "Departure date"
                        )
                          ? tripData.validationStatus.reason.replace(
                              /\(\d{4}-\d{2}-\d{2}\)/,
                              `(${formatDate(tripData.startDate)})`
                            )
                          : tripData.validationStatus.reason?.includes(
                              "Return date"
                            )
                          ? tripData.validationStatus.reason.replace(
                              /\(\d{4}-\d{2}-\d{2}\)/,
                              `(${formatDate(tripData.endDate)})`
                            )
                          : tripData.validationStatus.reason}
                      </p>
                      {tripData.validationStatus.lastChecked && (
                        <p className="text-sm text-gray-600">
                          Last checked:{" "}
                          {new Date(
                            tripData.validationStatus.lastChecked
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                }
                type="warning"
                showIcon
              />
            ) : (
              <>
                {offersData?.tip && (
                  <p className="text-sm text-gray-600 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    💡 {offersData.tip}
                  </p>
                )}

                {isOffersLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Spin />
                    <p className="text-gray-600 mt-4">Loading offers...</p>
                  </div>
                ) : isOffersError ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {offersError instanceof Error
                        ? offersError.message
                        : "Failed to load offers"}
                    </p>
                  </div>
                ) : offersData ? (
                  <Tabs
                    defaultActiveKey="recommended"
                    items={[
                      {
                        key: "recommended",
                        label: "Recommended",
                        children: (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                Flight
                              </h4>
                              <FlightOfferCard
                                flight={offersData.recommended.flight}
                                isRecommended
                              />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                Hotel
                              </h4>
                              <HotelOfferCard
                                hotel={offersData.recommended.hotel}
                                isRecommended
                              />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-semibold">
                                  Combined Package:
                                </span>
                                <span className="text-2xl font-bold text-gray-800">
                                  ${offersData.recommended.flightPrice} + Hotel
                                </span>
                              </div>
                              <div className="mt-2 text-sm">
                                <span
                                  className={`px-2 py-1 rounded ${
                                    offersData.recommended.fitsBudget
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {offersData.recommended.fitsBudget
                                    ? "✓ Within Budget"
                                    : "✗ Over Budget"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "flights",
                        label: `All Flights (${offersData.flights.length})`,
                        children: (
                          <div className="space-y-4">
                            {offersData.flights.map((flight) => (
                              <FlightOfferCard
                                key={flight.id}
                                flight={flight}
                              />
                            ))}
                          </div>
                        ),
                      },
                      {
                        key: "hotels",
                        label: `Hotels (${offersData.hotels.length})`,
                        children: (
                          <div className="space-y-4">
                            {offersData.hotels.map((hotel) => (
                              <HotelOfferCard
                                key={hotel.hotelId}
                                hotel={hotel}
                              />
                            ))}
                          </div>
                        ),
                      },
                    ]}
                  />
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TripDetailPage;
