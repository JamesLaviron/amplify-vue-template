import { defineAuth } from '@aws-amplify/backend';
import { secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource for fantasy football app
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'profile', 'openid'],
      },
      callbackUrls: [
        'http://localhost:5173/',
        // TODO: Replace with your actual production URL from Amplify Console
        'https://main.d28b7tcuowp4up.amplifyapp.com/',
      ],
      logoutUrls: [
        'http://localhost:5173/',
        // TODO: Replace with your actual production URL from Amplify Console
        'https://main.d28b7tcuowp4up.amplifyapp.com/',
      ],
    },
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    givenName: {
      required: false,
      mutable: true,
    },
    familyName: {
      required: false,
      mutable: true,
    },
  },
});
