import cds from "@sap/cds";

import { DeezerConnection } from "./external/deezer";

export class UserService extends cds.ApplicationService {
  init() {
    const { Artists } = cds.entities("festival");

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

    this.before("CREATE", "Artists", async (req) => {
      const { deezerId } = req.data;

      const storedArtist = await SELECT.one.from(Artists).columns("ID").where({ deezerId });

      if (storedArtist) {
        req.reject(409, "This artist was already suggested!");
      }
    });

    return super.init();
  }
}
