import Api from "../api-base-config";

class Amadeus {
  static async getCitiesCode(keyword: string): Promise<any> {
    return await Api.get(`api/v1/amadeus/city-code?keyword=${keyword}`);
  }
}
export default Amadeus;
