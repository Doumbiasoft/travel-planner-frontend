import type { createTrip } from "../../types";
import Api from "../api-base-config";

class Trip {
  static async getTrips(): Promise<any> {
    return await Api.get(`api/v1/trips`);
  }
  static async getATrip(tripId: string): Promise<any> {
    return await Api.get(`api/v1/trips/${tripId}`);
  }
  static async addTrip(data: createTrip): Promise<any> {
    return await Api.get(`api/v1/trips`, data);
  }
}
export default Trip;
