import cds from "@sap/cds";

import { DeezerConnection } from "./external/deezer";

export class UserService extends cds.ApplicationService {
  init() {
    this.on("whoami", (req) => ({
      isAdmin: req.user.is("admin"),
      id: req.user.id,
      givenName: req.user.attr.givenName,
      familyName: req.user.attr.familyName,
    }));

    const deezerConnection = new DeezerConnection();

    this.on("searchArtists", async ({ data: { searchString } }) => {
      return deezerConnection.searchArtists({ data: { searchString } });
    });

    return super.init();
  }
}
