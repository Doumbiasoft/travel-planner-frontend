import Api from "../api-base-config";

class PDF {
  static async exportTripPDF(tripId: string): Promise<Blob> {
    return await Api.downloadBlob(`api/v1/pdf/export/${tripId}`);
  }
}
export default PDF;
