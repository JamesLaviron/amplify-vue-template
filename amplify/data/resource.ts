import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/

const schema = a.schema({
  // User profile extending the built-in authentication
  UserProfile: a
    .model({
      username: a.string().required(),
      email: a.string().required(),
      favoriteTeam: a.string(),
      totalPoints: a.integer().default(0),
      currentGameweek: a.integer().default(1),
      createdAt: a.datetime(),
      fantasyTeams: a.hasMany('FantasyTeam', 'owner'),
      createdLeagues: a.hasMany('League', 'creatorId'),
      leagueMemberships: a.hasMany('LeagueMembership', 'userId'),
      owner: a.string().authorization(allow => [allow.owner().to(['read'])]), // Prevent owner reassignment
    })
    .authorization(allow => [allow.owner(), allow.authenticated().to(['read'])]),

  // Real football teams
  FootballTeam: a
    .model({
      name: a.string().required(),
      shortName: a.string().required(),
      code: a.string().required(), // e.g., "MUN", "LIV"
      league: a.string().required(), // e.g., "Premier League"
      logoUrl: a.string(),
      players: a.hasMany('Player', 'teamId'),
      homeMatches: a.hasMany('MatchUpdate', 'homeTeamId'),
      awayMatches: a.hasMany('MatchUpdate', 'awayTeamId'),
    })
    .authorization(allow => [
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
      allow.publicApiKey().to(['read']),
    ]),

  // Real football players
  Player: a
    .model({
      name: a.string().required(),
      position: a.enum(['GK', 'DEF', 'MID', 'FWD']),
      teamId: a.id().required(),
      price: a.float().required(), // in millions
      totalPoints: a.integer().default(0),
      form: a.float().default(0.0), // recent performance rating
      availability: a.enum(['AVAILABLE', 'INJURED', 'SUSPENDED', 'DOUBTFUL']),
      photoUrl: a.string(),
      team: a.belongsTo('FootballTeam', 'teamId'),
      fantasySelections: a.hasMany('FantasySelection', 'playerId'),
      gameweekScores: a.hasMany('GameweekScore', 'playerId'),
    })
    .authorization(allow => [
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
      allow.publicApiKey().to(['read']),
    ]),

  // Fantasy teams created by users
  FantasyTeam: a
    .model({
      name: a.string().required(),
      owner: a.string().authorization(allow => [allow.owner().to(['read'])]), // Prevent owner reassignment
      budget: a.float().default(100.0), // remaining budget
      totalPoints: a.integer().default(0),
      currentGameweekPoints: a.integer().default(0),
      formation: a.string().default('4-4-2'),
      user: a.belongsTo('UserProfile', 'owner'),
      selections: a.hasMany('FantasySelection', 'fantasyTeamId'),
      leagueMemberships: a.hasMany('LeagueMembership', 'fantasyTeamId'),
    })
    .authorization(allow => [allow.owner(), allow.authenticated().to(['read'])]),

  // Players selected in fantasy teams
  FantasySelection: a
    .model({
      fantasyTeamId: a.id().required(),
      playerId: a.id().required(),
      isCaptain: a.boolean().default(false),
      isViceCaptain: a.boolean().default(false),
      isOnBench: a.boolean().default(false),
      gameweekSelected: a.integer().required(),
      fantasyTeam: a.belongsTo('FantasyTeam', 'fantasyTeamId'),
      player: a.belongsTo('Player', 'playerId'),
    })
    .authorization(allow => [allow.authenticated().to(['read', 'create', 'update', 'delete'])]),

  // Gameweek scores and updates
  GameweekScore: a
    .model({
      playerId: a.id().required(),
      gameweek: a.integer().required(),
      points: a.integer().default(0),
      goals: a.integer().default(0),
      assists: a.integer().default(0),
      cleanSheets: a.integer().default(0),
      minutesPlayed: a.integer().default(0),
      yellowCards: a.integer().default(0),
      redCards: a.integer().default(0),
      saves: a.integer().default(0),
      player: a.belongsTo('Player', 'playerId'),
    })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),

  // Leagues for competition
  League: a
    .model({
      name: a.string().required(),
      code: a.string().required(), // join code
      creatorId: a
        .id()
        .required()
        .authorization(allow => [allow.authenticated().to(['read'])]), // Creator ID read-only
      isPublic: a.boolean().default(false),
      maxParticipants: a.integer().default(20),
      currentParticipants: a.integer().default(1),
      creator: a.belongsTo('UserProfile', 'creatorId'),
      memberships: a.hasMany('LeagueMembership', 'leagueId'),
      owner: a.string().authorization(allow => [allow.owner().to(['read'])]), // Prevent owner reassignment
    })
    .authorization(allow => [
      allow.authenticated().to(['read', 'create']),
      allow.owner().to(['update', 'delete']),
    ]),

  // League memberships
  LeagueMembership: a
    .model({
      leagueId: a.id().required(),
      userId: a
        .id()
        .required()
        .authorization(allow => [allow.authenticated().to(['read'])]), // User ID read-only
      fantasyTeamId: a.id().required(),
      joinedAt: a.datetime(),
      totalPoints: a.integer().default(0),
      rank: a.integer().default(0),
      league: a.belongsTo('League', 'leagueId'),
      user: a.belongsTo('UserProfile', 'userId'),
      fantasyTeam: a.belongsTo('FantasyTeam', 'fantasyTeamId'),
      owner: a.string().authorization(allow => [allow.owner().to(['read'])]), // Prevent owner reassignment
    })
    .authorization(allow => [
      allow.authenticated().to(['read', 'create']),
      allow.owner().to(['update', 'delete']),
    ]),

  // Real-time match updates
  MatchUpdate: a
    .model({
      gameweek: a.integer().required(),
      homeTeamId: a.id().required(),
      awayTeamId: a.id().required(),
      homeScore: a.integer().default(0),
      awayScore: a.integer().default(0),
      status: a.enum(['SCHEDULED', 'LIVE', 'FINISHED']),
      kickoffTime: a.datetime(),
      homeTeam: a.belongsTo('FootballTeam', 'homeTeamId'),
      awayTeam: a.belongsTo('FootballTeam', 'awayTeamId'),
    })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.publicApiKey().to(['read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // API Key for public data like teams and players
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
