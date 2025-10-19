import Api from "../api-base-config";

class Amadeus {
  static async getCitiesCode(keyword: string): Promise<any> {
    return await Api.get(`api/v1/amadeus/city-code?keyword=${keyword}`);
  }
  static async getTripOffers(data: {
    tripId?: string;
    originCityCode: string;
    destinationCityCode: string;
    startDate: string;
    endDate: string;
    budget: number;
    adults?: number;
    children?: number;
    infants?: number;
    travelClass?: string;
  }): Promise<any> {
    let url = `api/v1/amadeus/search?originCityCode=${data.originCityCode}&destinationCityCode=${data.destinationCityCode}&startDate=${data.startDate}&endDate=${data.endDate}&budget=${data.budget}`;
    // Add optional parameters
    if (data.tripId !== undefined) {
      url += `&tripId=${data.tripId}`;
    }
    if (data.adults !== undefined) {
      url += `&adults=${data.adults}`;
    }
    if (data.children !== undefined && data.children > 0) {
      url += `&children=${data.children}`;
    }
    if (data.infants !== undefined && data.infants > 0) {
      url += `&infants=${data.infants}`;
    }
    if (data.travelClass) {
      url += `&travelClass=${data.travelClass}`;
    }

    return await Api.get(url, undefined, undefined, 1, 30000);
  }
}
export default Amadeus;
