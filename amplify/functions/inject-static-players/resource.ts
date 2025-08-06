import { defineFunction } from '@aws-amplify/backend';

export const injectStaticPlayers = defineFunction({
  name: 'inject-static-players',
  entry: './handler.ts',
  environment: {
    API_FOOTBALL_KEY: process.env.API_FOOTBALL_KEY || '',
  },
  timeoutSeconds: 900, // 15 minutes - API calls can take time
});
