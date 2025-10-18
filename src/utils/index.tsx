import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDuration = (duration: string) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  if (!match) return duration;
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  return `${hours}h ${minutes}m`;
};

export const formatTime = (datetime: string) => {
  return format(new Date(datetime), "HH:mm");
};

export const formatDateF = (datetime: string) => {
  return format(new Date(datetime), "MMM dd");
};
