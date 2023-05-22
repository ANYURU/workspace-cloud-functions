const sdk = require("node-appwrite");
module.exports = async function (req, res) {
  const client = new sdk.Client();

  if (
    !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
    !req.variables["APPWRITE_FUNCTION_PROJECT_ID"] ||
    !req.variables["SECRET_KEY"]
  ) {
    console.warn(
      "Environment variables are not set. Function cannot use Appwrite SDK."
    );
  } else {
    try {
      client
        .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
        .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
        .setKey(req.variables["SECRET_KEY"])
        .setSelfSigned(true);

      // You can remove services you don't use
      const users = new sdk.Users(client);
      const teams = new sdk.Teams(client);
      const databases = new sdk.Databases(client);
      const { Role, Permission, Query } = sdk;

      // const {
      //   documents: [{ $id: packageID }],
      // } = await databases.listDocuments(
      //   req.variables.APPWRITE_DATABASE_ID,
      //   req.variables.PACKAGES_COLLECTION_ID,
      //   [Query.equal("name", "Free")]
      // );

      const newUser = JSON.parse(req.variables.APPWRITE_FUNCTION_EVENT_DATA);
      const allUsers = await users.list();
      const roles = allUsers.total === 1 ? ["superadmin", "owner"] : ["member"];

      await teams.createMembership(
        req.variables.SYSTEM_TEAM_ID,
        newUser["email"],
        roles,
        "http://localhost:3000"
      );

      const user = await databases.createDocument(
        req.variables.APPWRITE_DATABASE_ID,
        req.variables.USERS_COLLECTION_ID,
        newUser["$id"],
        {
          isPremium: false,
          package: packageID,
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(newUser["$id"])),
          Permission.update(
            Role.team(req.variables.SYSTEM_TEAM_ID, "superadmin")
          ),
          Permission.update(Role.team(req.variables.SYSTEM_TEAM_ID, "admin")),
          Permission.delete(
            Role.team(req.variables.SYSTEM_TEAM_ID, "superadmin")
          ),
          Permission.delete(Role.team(req.variables.SYSTEM_TEAM_ID, "admin")),
        ]
      );

      res.json({ user });

      // res.json({ user, packageID });
    } catch (error) {
      res.json(error);
    }
  }
};
