import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { injectStaticLeagues } from './functions/inject-static-leagues/resource';
import { injectStaticPlayers } from './functions/inject-static-players/resource';

export const backend = defineBackend({
  auth,
  data,
  injectStaticLeagues,
  injectStaticPlayers,
});

// Donner l'accès DynamoDB à la Lambda
backend.injectStaticLeagues.addEnvironment(
  'STATIC_LEAGUES_TABLE_NAME',
  backend.data.resources.tables['StaticLeagues'].tableName
);

// Permissions pour accéder à la table StaticLeagues
backend.data.resources.tables['StaticLeagues'].grantFullAccess(
  backend.injectStaticLeagues.resources.lambda
);

// Configuration pour inject-static-players Lambda
backend.injectStaticPlayers.addEnvironment(
  'STATIC_PLAYERS_TABLE_NAME',
  backend.data.resources.tables['StaticPlayers'].tableName
);

// Permissions pour accéder à la table StaticPlayers
backend.data.resources.tables['StaticPlayers'].grantFullAccess(
  backend.injectStaticPlayers.resources.lambda
);
