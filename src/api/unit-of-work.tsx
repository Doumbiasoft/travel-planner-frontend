import Amadeus from "./amadeus/amadeus";
import Auth from "./auth/auth";
import Trip from "./trip/trip";
class UnitOfWork {
  auth = Auth;
  trip = Trip;
  amadeus = Amadeus;
}

export default new UnitOfWork();
