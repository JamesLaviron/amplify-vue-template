import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sendEmail } from './functions/send-email/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  sendEmail,
});

// Add SES permissions to the sendEmail function
backend.sendEmail.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'ses:SendEmail',
      'ses:SendRawEmail',
      'ses:VerifyEmailIdentity'
    ],
    resources: ['*']
  })
);
