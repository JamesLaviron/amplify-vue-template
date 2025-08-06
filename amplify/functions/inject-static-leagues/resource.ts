import { defineFunction } from '@aws-amplify/backend';

export const injectStaticLeagues = defineFunction({
  name: 'inject-static-leagues',
  entry: './handler.ts',
});
