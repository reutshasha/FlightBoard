export type FlightStatus = "Scheduled" | "Boarding" | "Departed" | "Landed" | "Delayed";

export function getFlightStatus(departureTime: string): FlightStatus {
  const now = new Date();
  const departure = new Date(departureTime);
  const diff = (departure.getTime() - now.getTime()) / 60000;

  if (diff > 30) return "Scheduled";
  if (diff > 10) return "Boarding";
  if (diff >= -60) return "Departed";
  if (diff < -60) return "Landed";
  if (diff < -15) return "Delayed";
  return "Scheduled";
}