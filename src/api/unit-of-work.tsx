import Auth from "./auth/auth";
class UnitOfWork {
  auth = Auth;
}

export default new UnitOfWork();
