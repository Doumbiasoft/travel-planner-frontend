import React, { useState } from "react";
import type { ITrip } from "../types";
import { Calendar, DollarSign, MapPin, Plus } from "lucide-react";

const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<ITrip[]>([
    {
      _id: "1",
      tripName: "Summer in Paris",
      origin: "New York",
      originCityCode: "NYC",
      destination: "Paris",
      destinationCityCode: "PAR",
      startDate: "2025-07-15",
      endDate: "2025-07-25",
      budget: 3500,
      markers: [
        {
          lat: 48.8566,
          lng: 2.3522,
          label: "Eiffel Tower",
        },
        {
          lat: 48.8606,
          lng: 2.3376,
          label: "Louvre Museum",
        },
      ],
      createdAt: "2025-01-15",
    },
    {
      _id: "2",
      tripName: "Tokyo Adventure",
      origin: "Los Angeles",
      originCityCode: "LAX",
      destination: "Tokyo",
      destinationCityCode: "TYO",
      startDate: "2025-09-10",
      endDate: "2025-09-20",
      budget: 4200,
      markers: [
        {
          lat: 35.6762,
          lng: 139.6503,
          label: "Tokyo Tower",
        },
      ],
      createdAt: "2025-02-01",
    },
    {
      _id: "3",
      tripName: "Tokyo Adventure",
      origin: "Los Angeles",
      originCityCode: "LAX",
      destination: "Tokyo",
      destinationCityCode: "TYO",
      startDate: "2025-09-10",
      endDate: "2025-09-20",
      budget: 4200,
      markers: [
        {
          lat: 35.6762,
          lng: 139.6503,
          label: "Tokyo Tower",
        },
      ],
      createdAt: "2025-02-01",
    },
    {
      _id: "4",
      tripName: "Tokyo Adventure",
      origin: "Los Angeles",
      originCityCode: "LAX",
      destination: "Tokyo",
      destinationCityCode: "TYO",
      startDate: "2025-09-10",
      endDate: "2025-09-20",
      budget: 4200,
      markers: [
        {
          lat: 35.6762,
          lng: 139.6503,
          label: "Tokyo Tower",
        },
      ],
      createdAt: "2025-02-01",
    },
    {
      _id: "5",
      tripName: "Tokyo Adventure",
      origin: "Los Angeles",
      originCityCode: "LAX",
      destination: "Tokyo",
      destinationCityCode: "TYO",
      startDate: "2025-09-10",
      endDate: "2025-09-20",
      budget: 4200,
      markers: [
        {
          lat: 35.6762,
          lng: 139.6503,
          label: "Tokyo Tower",
        },
      ],
      createdAt: "2025-02-01",
    },
  ]);

  const [selectedTrip, setSelectedTrip] = useState<ITrip | null>(null);
  const [showAddTrip, setShowAddTrip] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setShowAddTrip(!showAddTrip)}
        className="w-full flex gap-2 items-center justify-center py-3 bg-[#FFE566] text-[#2B2B2B] rounded-lg hover:bg-[#FFFF66] transition-all font-semibold text-lg shadow transform hover:scale-[1.02] cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        Add New Trip
      </button>
      <br />
      {trips.map((trip) => (
        <div
          key={trip._id}
          onClick={() => setSelectedTrip(trip)}
          className={`p-4 mb-3 rounded-lg border-2 cursor-pointer transition-all ${
            selectedTrip?._id === trip._id
              ? "border-y-amber-300 bg-blue-50"
              : "border-gray-200 bg-white hover:border-y-amber-300"
          }`}
        >
          <h3 className="font-semibold text-gray-800 mb-2">{trip.tripName}</h3>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                {trip.origin} → {trip.destination}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Budget: ${trip.budget.toLocaleString()}</span>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              {trip.markers.length} marker{trip.markers.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
