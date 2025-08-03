import { defineAuth } from "@aws-amplify/backend";
import { secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource for fantasy football app
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
        scopes: ["email", "profile", "openid"],
      },
      callbackUrls: [
        "http://localhost:5173/",
        "https://main.d2x8z9k8z9k8z9.amplifyapp.com/", // Replace with your actual Amplify app URL
      ],
      logoutUrls: [
        "http://localhost:5173/",
        "https://main.d2x8z9k8z9k8z9.amplifyapp.com/", // Replace with your actual Amplify app URL
      ],
    },
  },
  userAttributes: {
    email: {
      required: true,
      mutable: false,
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
