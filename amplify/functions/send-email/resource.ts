import { defineFunction } from '@aws-amplify/backend';

export const sendEmail = defineFunction({
  name: 'send-email',
  entry: './handler.ts',
  environment: {
    SES_REGION: 'us-east-1', // SES region
    TO_EMAIL: 'victor@gerfaud.fr'
  }
});