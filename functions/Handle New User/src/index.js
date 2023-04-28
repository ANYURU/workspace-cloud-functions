const sdk = require("node-appwrite");
module.exports = async function (req, res) {
  const client = new sdk.Client();

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_PROJECT_ID'] ||
    !req.variables['SECRET_KEY']
  ) {
    console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['SECRET_KEY'])
      .setSelfSigned(true);
    
    // You can remove services you don't use
    const users = new sdk.Users(client);
    const teams = new sdk.Teams(client);

    const newUser = JSON.parse(req.variables.APPWRITE_FUNCTION_EVENT_DATA)
    const allUsers = await users.list();
    const roles = allUsers.total === 1 ? ['superAdmin', 'owner'] : ['member'];

    await teams.createMembership(
      req.variables.SYSTEM_TEAM_ID, 
      newUser['email'], 
      roles, 
      'http://localhost:3000'
    )
  
    const newUsersDocument = await databases.createDocument(
      req.variables.APPWRITE_DATABASE_ID, 
      req.variables.USERS_COLLECTION_ID, 
      newUser['$id'], 
      { 
        role: allUsers.length === 1 ? 'superadmin' : "member",
        isPremium: false
      }
    );

    res.json({ newUsersDocument })

    // await databases.createDocument(
    //   req.variables.DATABASE_COLLECTION_ID,
    //   req.variables.APPWRITE_USER_ORG_COLLECTION_ID,
    //   'unique()',
    //   {
    //     userID: newUser['$id'],
    //     orgID: req.variables.DEFAULT_ORG_ID,
    //     role: allUsers.length === 1 ? 'superadmin' : "member"
    //   } 
    // )    
  } 
};
