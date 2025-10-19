import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spin, Tabs, Alert, App } from "antd";
import { AlertCircle } from "lucide-react";
import unitOfWork from "../api/unit-of-work";
import type { ITrip, TripOffersData } from "../types";
import FlightOfferCard from "../components/FlightOfferCard";
import HotelOfferCard from "../components/HotelOfferCard";
import TripCard from "../components/TripCard";
import TripFormModal from "../components/TripFormModal";
import { useAlertNotification } from "../hooks/AlertNotification";
import { formatDate } from "../utils";
import { ENV } from "../config/env";
import error_broken from "../assets/images/error-broken.png";

const TripDetailPage: React.FC = () => {
  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const openNotification = useAlertNotification();
  const urlParams = useParams();
  const tripId = urlParams.id;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<ITrip | null>(null);

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
    refetchInterval: 30000,
    enabled: !!tripId,
  });

  const updateTripMutation = useMutation({
    mutationFn: async ({ tripId, data }: { tripId: string; data: ITrip }) =>
      await unitOfWork.trip.updateTrip(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["tripOffers"] });
      openNotification("Trip updated successfully!", "success");
    },
    onError: (error: any) => {
      if (ENV.VITE_MODE === "development") {
        console.error("Update trip error:", error);
      }
      openNotification(error?.message || "Failed to update trip", "error");
    },
  });

  const deleteTripMutation = useMutation({
    mutationFn: async (tripId: string) =>
      await unitOfWork.trip.deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      openNotification("Trip deleted successfully!", "success");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      if (ENV.VITE_MODE === "development") {
        console.error("Delete trip error:", error);
      }
      openNotification(error?.message || "Failed to delete trip", "error");
    },
  });

  const toggleNotificationMutation = useMutation({
    mutationFn: async ({
      tripId,
      enabled,
    }: {
      tripId: string;
      enabled: boolean;
    }) => {
      if (!tripData) throw new Error("Trip not found");

      const updatedTrip = {
        tripId: tripData._id,
        tripName: tripData.tripName,
        origin: tripData.origin,
        originCityCode: tripData.originCityCode,
        destination: tripData.destination,
        destinationCityCode: tripData.destinationCityCode,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        budget: tripData.budget,
        markers: tripData.markers,
        notifications: {
          priceDrop: enabled,
          email: enabled,
        },
        preferences: tripData.preferences,
      };
      return await unitOfWork.trip.updateTrip(tripId, updatedTrip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["tripOffers"] });
      openNotification("Notification settings updated!", "success");
    },
    onError: (error: any) => {
      if (ENV.VITE_MODE === "development") {
        console.error("Toggle notification error:", error);
      }
      openNotification(
        error?.message || "Failed to update notification settings",
        "error"
      );
    },
  });

  const handleOpenEditModal = (trip: ITrip) => {
    setEditingTrip(trip);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTrip(null);
  };

  const handleSubmitTrip = async (trip: ITrip) => {
    if (trip._id) {
      let f_data = { ...trip };
      delete f_data._id;
      updateTripMutation.mutate({ tripId: trip._id, data: f_data });
    }
  };

  const handleDeleteTrip = (trip: ITrip) => {
    modal.confirm({
      title: (
        <div style={{ fontSize: "18px", fontWeight: 600 }}>Delete Trip</div>
      ),
      content: (
        <span
          style={{ fontSize: "15px" }}
        >{`Are you sure you want to delete "${trip.tripName}"? This action cannot be undone.`}</span>
      ),
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        if (trip._id) {
          deleteTripMutation.mutate(trip._id);
        }
      },
    });
  };

  const handleNotificationToggle = (tripId: string, enabled: boolean) => {
    toggleNotificationMutation.mutate({ tripId, enabled });
  };

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
        budget: tripData?.budget!,
        adults: tripData?.preferences?.adults,
        children: tripData?.preferences?.children,
        infants: tripData?.preferences?.infants,
        travelClass: tripData?.preferences?.travelClass,
      };
      const response = await unitOfWork.amadeus.getTripOffers(f_data);
      return response.data as TripOffersData;
    },
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
          <img src={error_broken} alt="" className="w-80 h-80" />
          <a href="https://storyset.com/web" className="hidden">
            Error broken
          </a>
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
          <TripCard
            trip={tripData}
            showActions={true}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteTrip}
            onNotificationToggle={handleNotificationToggle}
          />

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
                  <div className="flex flex-col text-center py-8  items-center justify-center">
                    <img src={error_broken} alt="" className="w-80 h-80" />
                    <a href="https://storyset.com/web" className="hidden">
                      Error broken
                    </a>
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

      <TripFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTrip}
        trip={editingTrip}
        mode="edit"
      />
    </div>
  );
};

export default TripDetailPage;
