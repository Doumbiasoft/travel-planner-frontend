import Amadeus from "./amadeus/amadeus";
import Auth from "./auth/auth";
import PDF from "./pdf/pdf";
import Trip from "./trip/trip";
class UnitOfWork {
  auth = Auth;
  trip = Trip;
  amadeus = Amadeus;
  pdf = PDF;
}

export default new UnitOfWork();
