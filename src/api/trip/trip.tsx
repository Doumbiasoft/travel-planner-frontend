import { type ITrip } from "../../types";
import Api from "../api-base-config";

class Trip {
  static async getTrips(): Promise<any> {
    return await Api.get(`api/v1/trips`);
  }

  static async getATrip(tripId: string): Promise<any> {
    return await Api.get(`api/v1/trips/${tripId}`);
  }

  static async createTrip(data: ITrip): Promise<any> {
    return await Api.post(`api/v1/trips`, data);
  }

  static async updateTrip(tripId: string, data: ITrip): Promise<any> {
    return await Api.patch(`api/v1/trips/${tripId}`, {
      ...data,
      tripId,
    });
  }

  static async deleteTrip(tripId: string): Promise<any> {
    return await Api.delete(`api/v1/trips/${tripId}`);
  }
}
export default Trip;
