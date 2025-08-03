# Security Guidelines

## API Keys and Secrets

### ⚠️ Important: Never commit API keys to version control

This project uses server-side environment variables to secure API keys:

1. **API-Football Key**: Required for server-side data seeding
   - Get from: https://rapidapi.com/api-sports/api/api-football
   - Set as `API_FOOTBALL_KEY` in Lambda environment
   - Never exposed to client-side code

### Environment Variable Setup

```bash
# Copy example file
cp .env.example .env

# Edit .env with your keys (for local development)
API_FOOTBALL_KEY=your_actual_api_key_here
VITE_AWS_REGION=your_aws_region
VITE_AWS_IDENTITY_POOL_ID=your_identity_pool_id
```

### Server-Side Security

- **API keys are stored in AWS Lambda environment variables only**
- **No API keys exposed to browser/client-side**
- **Seeding functions require user authentication via AWS Cognito**
- **Lambda functions have minimal IAM permissions for DynamoDB access**

### Best Practices

1. ✅ Use environment variables for all secrets
2. ✅ Add `.env` to `.gitignore`
3. ✅ Use different keys for different environments (dev/prod)
4. ❌ Never commit actual API keys to git

### AWS Amplify Deployment

For production deployment, set environment variables in:

1. **AWS Lambda Environment Variables** (for seeding function):
   - `API_FOOTBALL_KEY`: Your API-Football API key
2. **AWS Amplify Console → Environment Variables** (for build process):
   - `API_FOOTBALL_KEY`: Same API key (used during backend build)
3. **Frontend Environment Variables** (in Amplify Console):
   - `VITE_AWS_REGION`: Your AWS region
   - `VITE_AWS_IDENTITY_POOL_ID`: Cognito Identity Pool ID
   - `VITE_SEED_LAMBDA_FUNCTION_NAME`: Lambda function name

## Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers.
