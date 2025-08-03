import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { getCurrentUser } from 'aws-amplify/auth';

interface InjectResult {
  success: boolean;
  message: string;
  total: number;
  injected: number;
  errors: number;
  results: Array<{
    success: boolean;
    club: string;
    error?: string;
  }>;
}

/**
 * Service to invoke the static leagues injection Lambda function
 */
class StaticLeaguesService {
  private lambdaClient: LambdaClient | null = null;

  private async getLambdaClient(): Promise<LambdaClient> {
    if (this.lambdaClient) {
      return this.lambdaClient;
    }

    try {
      // Ensure user is authenticated
      await getCurrentUser();

      // Get credentials from Cognito Identity Pool
      const credentials = fromCognitoIdentityPool({
        clientConfig: {
          region: import.meta.env.VITE_AWS_REGION || 'eu-west-3',
        },
        identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || '',
      });

      this.lambdaClient = new LambdaClient({
        region: import.meta.env.VITE_AWS_REGION || 'eu-west-3',
        credentials,
      });

      return this.lambdaClient;
    } catch (error) {
      console.error('Failed to initialize Lambda client:', error);
      throw new Error('Authentication required to perform static leagues injection');
    }
  }

  /**
   * Inject all Premier League teams into StaticLeagues table
   */
  async injectPremierLeagueTeams(): Promise<InjectResult> {
    const client = await this.getLambdaClient();

    const functionName =
      import.meta.env.VITE_INJECT_STATIC_LEAGUES_FUNCTION_NAME || 'inject-static-leagues';

    try {
      console.log('🚀 Invoking static leagues injection Lambda function...');

      const command = new InvokeCommand({
        FunctionName: functionName,
        InvocationType: 'RequestResponse', // Synchronous invocation
        Payload: new TextEncoder().encode(JSON.stringify({})),
      });

      const response = await client.send(command);

      if (response.Payload) {
        const result = JSON.parse(new TextDecoder().decode(response.Payload)) as {
          statusCode: number;
          body: string;
        };

        if (result.statusCode === 200) {
          const body = JSON.parse(result.body);
          console.log('✅ Static leagues injection completed successfully:', body);

          return {
            success: true,
            message: body.message,
            total: body.total,
            injected: body.success,
            errors: body.total - body.success,
            results: body.results,
          };
        } else {
          throw new Error(`Lambda returned status ${result.statusCode}`);
        }
      } else {
        throw new Error('No response payload from Lambda function');
      }
    } catch (error) {
      console.error('💥 Lambda invocation failed:', error);
      return {
        success: false,
        message: `Failed to inject static leagues: ${error instanceof Error ? error.message : 'Unknown error'}`,
        total: 0,
        injected: 0,
        errors: 0,
        results: [],
      };
    }
  }
}

// Export singleton instance
export const staticLeaguesService = new StaticLeaguesService();
