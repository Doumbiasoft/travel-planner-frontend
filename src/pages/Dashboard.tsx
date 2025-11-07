import React, { useState, useMemo } from "react";
import { type FilterState, type ITrip } from "../types";
import { Plus, Search, X, Filter } from "lucide-react";
import TripFormModal from "../components/TripFormModal";
import TripCard from "../components/TripCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import unitOfWork from "../api/unit-of-work";
import { Spin, App } from "antd";
import { useAlertNotification } from "../hooks/AlertNotification";
import trip_empty_state from "../assets/images/trip-empty-state-1.png";
import error_broken from "../assets/images/error-broken.png";
import { useNavigate } from "react-router-dom";
import { ENV } from "../config/env";

const Dashboard: React.FC = () => {
  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const openNotification = useAlertNotification();
  const [selectedTrip, setSelectedTrip] = useState<ITrip | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingTrip, setEditingTrip] = useState<ITrip | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    tripName: "",
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    minBudget: "",
    maxBudget: "",
  });

  const {
    data: trips = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const response = await unitOfWork.trip.getTrips();
      return response.data || [];
    },
    refetchInterval: 60000,
  });

  const createTripMutation = useMutation({
    mutationFn: async (newTrip: ITrip) =>
      await unitOfWork.trip.createTrip(newTrip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      openNotification("Trip created successfully!", "success");
    },
    onError: (error: any) => {
      if (ENV.VITE_MODE === "development") {
        console.error("Create trip error:", error);
      }
      openNotification(error?.message || "Failed to create trip", "error");
    },
  });

  const updateTripMutation = useMutation({
    mutationFn: async ({ tripId, data }: { tripId: string; data: ITrip }) =>
      await unitOfWork.trip.updateTrip(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
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
      setSelectedTrip(null);
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
      const trip = trips.find((t: ITrip) => t._id === tripId);
      if (!trip) throw new Error("Trip not found");

      const updatedTrip = {
        tripId: trip._id,
        tripName: trip.tripName,
        origin: trip.origin,
        originCityCode: trip.originCityCode,
        destination: trip.destination,
        destinationCityCode: trip.destinationCityCode,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        markers: trip.markers,
        notifications: {
          priceDrop: enabled,
          email: enabled,
        },
        preferences: trip.preferences,
      };
      return await unitOfWork.trip.updateTrip(tripId, updatedTrip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
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

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingTrip(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (trip: ITrip) => {
    setModalMode("edit");
    setEditingTrip(trip);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTrip(null);
  };

  const handleSubmitTrip = async (trip: ITrip) => {
    if (modalMode === "add") {
      createTripMutation.mutate(trip);
    } else if (trip._id) {
      let f_data = { ...trip };
      delete f_data._id;
      updateTripMutation.mutate({ tripId: trip._id, data: f_data });
      if (selectedTrip?._id === trip._id) {
        setSelectedTrip(trip);
      }
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
  const clearFilters = () => {
    setFilters({
      tripName: "",
      origin: "",
      destination: "",
      startDate: "",
      endDate: "",
      minBudget: "",
      maxBudget: "",
    });
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((value) => value !== "").length;
  }, [filters]);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip: ITrip) => {
      const matchesTripName = filters.tripName
        ? trip.tripName.toLowerCase().includes(filters.tripName.toLowerCase())
        : true;

      const matchesOrigin = filters.origin
        ? trip.origin.toLowerCase().includes(filters.origin.toLowerCase()) ||
          trip.originCityCode
            .toLowerCase()
            .includes(filters.origin.toLowerCase())
        : true;

      const matchesDestination = filters.destination
        ? trip.destination
            .toLowerCase()
            .includes(filters.destination.toLowerCase()) ||
          trip.destinationCityCode
            .toLowerCase()
            .includes(filters.destination.toLowerCase())
        : true;

      const matchesStartDate = filters.startDate
        ? new Date(trip.startDate) >= new Date(filters.startDate)
        : true;

      const matchesEndDate = filters.endDate
        ? new Date(trip.endDate) <= new Date(filters.endDate)
        : true;

      const matchesMinBudget = filters.minBudget
        ? trip.budget >= Number(filters.minBudget)
        : true;

      const matchesMaxBudget = filters.maxBudget
        ? trip.budget <= Number(filters.maxBudget)
        : true;

      return (
        matchesTripName &&
        matchesOrigin &&
        matchesDestination &&
        matchesStartDate &&
        matchesEndDate &&
        matchesMinBudget &&
        matchesMaxBudget
      );
    });
  }, [trips, filters]);

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Trips</h1>
        <p className="text-gray-600 mt-1">Plan and manage your adventures</p>
      </div>
      {/** Trip filter component */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-3 items-center mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by trip name..."
              value={filters.tripName}
              onChange={(e) => handleFilterChange("tripName", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] transition-all font-semibold border border-[#FFE566] cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Trip</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all cursor-pointer ${
              showFilters
                ? "bg-[#FFE566] border-[#FFE566] text-[#2B2B2B]"
                : "bg-white border-gray-300 text-gray-700 hover:border-[#FFE566]"
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#2B2B2B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origin
                <input
                  type="text"
                  placeholder="City or code..."
                  value={filters.origin}
                  onChange={(e) => handleFilterChange("origin", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
                <input
                  type="text"
                  placeholder="City or code..."
                  value={filters.destination}
                  onChange={(e) =>
                    handleFilterChange("destination", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date From
                <input
                  autoComplete=""
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date Until
                <input
                  autoComplete=""
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Budget ($)
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minBudget}
                  onChange={(e) =>
                    handleFilterChange("minBudget", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Budget ($)
                <input
                  type="number"
                  placeholder="10000"
                  value={filters.maxBudget}
                  onChange={(e) =>
                    handleFilterChange("maxBudget", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE566] focus:border-transparent"
                />
              </label>
            </div>
          </div>
        )}
      </div>
      {/** Trip number label */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredTrips.length} of {trips.length} trip
          {trips.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spin size="large" />
            <p className="text-gray-600 mt-4">Loading trips...</p>
          </div>
        ) : isError && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img src={error_broken} alt="" className="w-80 h-80" />
            <a href="https://storyset.com/web" className="hidden">
              Error broken
            </a>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Error loading trips
            </h3>
            <p className="text-gray-500 mb-4">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img src={trip_empty_state} alt="" className="w-80 h-80" />
            <a href="https://storyset.com/money" className="hidden">
              Trip Illustration
            </a>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No trips found
            </h3>
            <p className="text-gray-500 mb-4">
              {activeFilterCount > 0
                ? "Try adjusting your filters to see more results"
                : "Start planning your first adventure!✨"}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] transition-all font-semibold cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTrips.map((trip: ITrip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                isSelected={selectedTrip?._id === trip._id}
                onClick={() => {
                  setSelectedTrip(trip);
                  navigate(`/dashboard/trips/${trip._id}`);
                }}
                onEdit={(trip) => {
                  setSelectedTrip(trip);
                  handleOpenEditModal(trip);
                }}
                onDelete={(trip) => {
                  setSelectedTrip(trip);
                  handleDeleteTrip(trip);
                }}
                onNotificationToggle={handleNotificationToggle}
              />
            ))}
          </div>
        )}
      </div>

      <TripFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTrip}
        trip={editingTrip}
        mode={modalMode}
      />
    </div>
  );
};

export default Dashboard;
