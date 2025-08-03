import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { getCurrentUser } from 'aws-amplify/auth';

interface SeedingOptions {
  league?: string;
  season?: number;
  teamLimit?: number;
  playerLimit?: number;
}

interface SeedingResult {
  success: boolean;
  teamsCreated: number;
  playersCreated: number;
  error?: string;
  duration: number;
}

/**
 * Service to invoke server-side data seeding Lambda function
 * This should only be called programmatically, not from admin buttons
 */
class SeedingService {
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
          region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
        },
        identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || '',
      });

      this.lambdaClient = new LambdaClient({
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
        credentials,
      });

      return this.lambdaClient;
    } catch (error) {
      console.error('Failed to initialize Lambda client:', error);
      throw new Error('Authentication required to perform seeding operations');
    }
  }

  /**
   * Invoke the seeding Lambda function
   * This is an internal method - should only be called programmatically
   */
  private async invokeSeedingLambda(options: SeedingOptions = {}): Promise<SeedingResult> {
    const client = await this.getLambdaClient();

    const functionName = import.meta.env.VITE_SEED_LAMBDA_FUNCTION_NAME || 'seed-data';

    try {
      console.log('🚀 Invoking seeding Lambda function...', options);

      const command = new InvokeCommand({
        FunctionName: functionName,
        InvocationType: 'RequestResponse', // Synchronous invocation
        Payload: new TextEncoder().encode(JSON.stringify(options)),
      });

      const response = await client.send(command);

      if (response.Payload) {
        const result = JSON.parse(new TextDecoder().decode(response.Payload)) as SeedingResult;

        if (result.success) {
          console.log('✅ Seeding completed successfully:', result);
        } else {
          console.error('❌ Seeding failed:', result.error);
        }

        return result;
      } else {
        throw new Error('No response payload from Lambda function');
      }
    } catch (error) {
      console.error('💥 Lambda invocation failed:', error);
      throw new Error(
        `Failed to invoke seeding: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if Premier League data needs seeding
   * Returns true if teams count is below threshold
   */
  async checkIfSeedingNeeded(): Promise<boolean> {
    // This would typically query the database to check if teams exist
    // For now, we'll implement this check later when integrating with GraphQL
    return true; // Assume seeding is needed for now
  }

  /**
   * Seed Premier League data - called programmatically during league creation
   * This is the main entry point for seeding operations
   */
  async seedPremierLeagueData(options: SeedingOptions = {}): Promise<SeedingResult> {
    console.log('🌱 Starting server-side Premier League data seeding...');

    try {
      // Check if seeding is actually needed
      const needsSeeding = await this.checkIfSeedingNeeded();

      if (!needsSeeding) {
        console.log('ℹ️  Premier League data already exists, skipping seeding');
        return {
          success: true,
          teamsCreated: 0,
          playersCreated: 0,
          duration: 0,
        };
      }

      // Invoke the Lambda function
      return await this.invokeSeedingLambda({
        league: 'premier-league',
        season: 2023,
        playerLimit: 2, // Limit to 2 pages per team for initial seeding
        ...options,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Seeding operation failed:', errorMessage);

      return {
        success: false,
        teamsCreated: 0,
        playersCreated: 0,
        error: errorMessage,
        duration: 0,
      };
    }
  }

  /**
   * Seed test data with limited scope for development
   */
  async seedTestData(): Promise<SeedingResult> {
    console.log('🧪 Seeding test data (limited scope)...');

    return this.invokeSeedingLambda({
      league: 'premier-league',
      season: 2023,
      teamLimit: 4, // Only 4 teams for testing
      playerLimit: 1, // Only 1 page of players per team
    });
  }
}

// Export singleton instance
export const seedingService = new SeedingService();

// Types for external use
export type { SeedingOptions, SeedingResult };
