import { defineFunction } from '@aws-amplify/backend';

export const injectStaticPlayers = defineFunction({
  name: 'inject-static-players',
  entry: './handler.ts',
  timeoutSeconds: 900, // 15 minutes - API calls can take time
});
