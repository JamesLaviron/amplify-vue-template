import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
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
  backend.data.resources.tables['StaticLeague'].tableName
);

// Permissions pour accéder à la table StaticLeague
backend.data.resources.tables['StaticLeague'].grantFullAccess(
  backend.injectStaticLeagues.resources.lambda
);

// Configuration pour inject-static-players Lambda
backend.injectStaticPlayers.addEnvironment(
  'STATIC_PLAYERS_TABLE_NAME',
  backend.data.resources.tables['StaticPlayer'].tableName
);

// Permissions pour accéder à la table StaticPlayer
backend.data.resources.tables['StaticPlayer'].grantFullAccess(
  backend.injectStaticPlayers.resources.lambda
);

// Grant permissions to access Secrets Manager for API_FOOTBALL_KEY
backend.injectStaticPlayers.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
    resources: [
      `arn:aws:secretsmanager:${process.env.AWS_REGION || 'eu-west-3'}:*:secret:API_FOOTBALL_KEY*`,
    ],
  })
);
