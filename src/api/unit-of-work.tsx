import Auth from "./auth/auth";
import Trip from "./trip/trip";
class UnitOfWork {
  auth = Auth;
  trip = Trip;
}

export default new UnitOfWork();
