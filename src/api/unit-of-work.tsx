import Amadeus from "./amadeus/amadeus";
import Auth from "./auth/auth";
import MailBox from "./mailbox/mailbox";
import PDF from "./pdf/pdf";
import Trip from "./trip/trip";
class UnitOfWork {
  auth = Auth;
  trip = Trip;
  amadeus = Amadeus;
  pdf = PDF;
  mailbox = MailBox;
}

export default new UnitOfWork();
