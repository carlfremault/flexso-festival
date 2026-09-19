import cds from "@sap/cds";

export class UserService extends cds.ApplicationService {
  init() {
    this.before(["CREATE", "UPDATE", "DELETE"], "*", (req) => req.reject(405));

    this.on("whoami", (req) => ({ isAdmin: req.user.is("admin") }));

    return super.init();
  }
}
