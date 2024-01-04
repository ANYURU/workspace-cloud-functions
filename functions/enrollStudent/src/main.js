import {
  Client,
  Teams,
  Databases,
  Permission,
  Role,
  ID,
  Query,
} from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_PROJECT_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const teams = new Teams(client);
  const database = new Databases(client);

  const { programId, organisation, userId } = JSON.parse(req.body);

  log(`Program Id: ${programId}`);
  log(`Organisation: ${organisation}`);
  log(`User Id: ${userId}`);
  log(`Body: ${req.body}`);

  const permissions = [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.read(Role.team(organisation, 'admin')),
    Permission.read(Role.team(organisation, 'owner')),
    Permission.update(Role.team(organisation, 'admin')),
    Permission.update(Role.team(organisation, 'owner')),
  ];

  try {
    const membership = await teams.createMembership(
      organisation,
      ['student'],
      process.env.APPWRITE_FUNCTION_PROJECT_ENDPOINT,
      undefined,
      userId
    );

    log(JSON.stringify(membership, null, 2));

    const enrolment = await database.createDocument(
      process.env.APPWRITE_FUNCTION_DATABASE_ID,
      process.env.APPWRITE_FUNCTION_ENROLMENTS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        programId,
      },
      permissions
    );

    log(JSON.stringify(enrolment, null, 2));

    return res.json({
      ok: true,
      message: `Congratulations. You've successfuly enrolled for the program`,
      enrolment,
    });
  } catch (err) {
    error(err);
    const { total: currentProgramEnrolments } = await database.listDocuments(
      process.env.APPWRITE_FUNCTION_DATABASE_ID,
      process.env.APPWRITE_FUNCTION_ENROLMENTS_COLLECTION_ID,
      [
        Query.equal('completionStatus', [
          'pendingPayment',
          'inProgress',
          'pendingApproval',
          'completed',
        ]),
        Query.equal('programId', [programId]),
        Query.equal('userId', [userId]),
      ]
    );

    log(`Number of current program Enrolments: ${currentProgramEnrolments}`);
    if (currentProgramEnrolments === 0) {
      const enrolment = await database.createDocument(
        process.env.APPWRITE_FUNCTION_DATABASE_ID,
        process.env.APPWRITE_FUNCTION_ENROLMENTS_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          programId,
        },
        permissions
      );

      return res.json({
        ok: true,
        message: `Congratulations. You've successfuly enrolled for the program`,
        enrolment,
      });
    }

    return res.json({
      ok: true,
      message: `You are already enrolled in this program`,
    });
  }
};
