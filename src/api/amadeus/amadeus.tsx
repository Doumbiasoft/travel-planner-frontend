import Api from "../api-base-config";

class Amadeus {
  static async getCitiesCode(keyword: string): Promise<any> {
    return await Api.get(`api/v1/amadeus/city-code?keyword=${keyword}`);
  }
  static async getTripOffers(data: {
    tripId: string;
    originCityCode: string;
    destinationCityCode: string;
    startDate: string;
    endDate: string;
    budget: string;
  }): Promise<any> {
    return await Api.get(
      `api/v1/amadeus/search?originCityCode=${data.originCityCode}&destinationCityCode=${data.destinationCityCode}&startDate=${data.startDate}&endDate=${data.endDate}&budget=${data.budget}&tripId=${data.tripId}`
    );
  }
}
export default Amadeus;
