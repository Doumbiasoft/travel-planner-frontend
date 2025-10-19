import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  // Extract date portion only to avoid timezone issues
  const dateOnly = dateString.split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString("en-US", {
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
  // For datetime with time component, use as-is
  return format(new Date(datetime), "HH:mm");
};

export const formatDateF = (datetime: string) => {
  // Extract date portion only to avoid timezone issues
  const dateOnly = datetime.split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return format(date, "MMM dd");
};
