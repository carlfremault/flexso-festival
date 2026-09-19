import cds from "@sap/cds";

export class UserService extends cds.ApplicationService {
  init() {
    this.before(["CREATE", "UPDATE", "DELETE"], "*", (req) => req.reject(405));

    return super.init();
  }
}
