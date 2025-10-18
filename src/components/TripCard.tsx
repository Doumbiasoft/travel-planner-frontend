import React from "react";
import { Calendar, DollarSign, MapPin, Edit, Trash2 } from "lucide-react";
import { formatDate } from "../utils";
import type { ITrip } from "../types";

interface TripCardProps {
  trip: ITrip;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: (trip: ITrip) => void;
  onDelete?: (trip: ITrip) => void;
  showActions?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-lg border-2 transition-all relative ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      } ${
        isSelected
          ? "border-[#FFE566] bg-[#FFFEF0] shadow-md"
          : "border-gray-200 bg-white hover:border-[#FFE566]"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-800 text-lg flex-1">
          {trip.tripName}
        </h3>
        {showActions && (onEdit || onDelete) && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(trip);
                }}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-[#FFE566] hover:text-[#2B2B2B] transition-all cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(trip);
                }}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>
            <span className="font-medium">{trip.origin}</span> (
            {trip.originCityCode}) →
            <span className="font-medium"> {trip.destination}</span> (
            {trip.destinationCityCode})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-green-500" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-yellow-600" />
          <span className="font-semibold">${trip.budget.toLocaleString()}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {trip.markers.length} marker
            {trip.markers.length !== 1 ? "s" : ""}
          </span>
          {trip.createdAt && (
            <span className="text-xs text-gray-400">
              Created {formatDate(trip.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;
