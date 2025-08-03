import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export async function debugAmplifySeeding() {
  console.log('🔍 Debug: Starting Amplify seeding test...');

  try {
    // 1. Check client setup
    console.log('1. Client:', client);
    console.log('2. Client models:', Object.keys(client.models));
    console.log('3. FootballTeam model exists:', !!client.models.FootballTeam);
    console.log('4. Player model exists:', !!client.models.Player);

    if (client.models.FootballTeam) {
      console.log('5. FootballTeam methods:', Object.keys(client.models.FootballTeam));
    }

    // 2. Test simple team creation
    console.log('\n🏆 Testing FootballTeam creation...');

    const testTeamData = {
      name: 'Test Manchester United',
      shortName: 'TEST_MUN',
      code: 'TEST_MUN',
      league: 'Test Premier League',
    };

    console.log('Team data to create:', testTeamData);

    const teamResult = await client.models.FootballTeam.create(testTeamData);
    console.log('Team creation result:', teamResult);

    if (teamResult.data) {
      console.log('✅ Team created successfully!');
      console.log('Created team:', teamResult.data);

      // 3. Test player creation
      console.log('\n⚽ Testing Player creation...');

      const testPlayerData = {
        name: 'Test Cristiano Ronaldo',
        position: 'FWD' as const,
        teamId: teamResult.data.id,
        price: 12.5,
        totalPoints: 150,
        form: 8.5,
        availability: 'AVAILABLE' as const,
      };

      console.log('Player data to create:', testPlayerData);

      const playerResult = await client.models.Player.create(testPlayerData);
      console.log('Player creation result:', playerResult);

      if (playerResult.data) {
        console.log('✅ Player created successfully!');
        console.log('Created player:', playerResult.data);

        return {
          success: true,
          message: 'Both team and player creation successful!',
          teamId: teamResult.data.id,
          playerId: playerResult.data.id,
        };
      } else {
        console.error('❌ Player creation failed');
        console.error('Player errors:', playerResult.errors);
        return {
          success: false,
          error: 'Player creation failed',
          details: playerResult.errors,
        };
      }
    } else {
      console.error('❌ Team creation failed');
      console.error('Team errors:', teamResult.errors);
      return {
        success: false,
        error: 'Team creation failed',
        details: teamResult.errors,
      };
    }
  } catch (error) {
    console.error('❌ Debug seeding error:', error);
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown');

    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.name : 'Unknown',
    };
  }
}

// Test just the client setup
export async function debugClientSetup() {
  console.log('🔍 Debug: Client Setup Test...');

  try {
    console.log('Client exists:', !!client);
    console.log('Client models exists:', !!client.models);
    console.log('Available models:', Object.keys(client.models || {}));

    // Test a simple operation
    console.log('\n📊 Testing UserProfile model (should work)...');
    const userProfiles = await client.models.UserProfile.list();
    console.log('UserProfile list result:', userProfiles);

    console.log('\n🏆 Testing FootballTeam model...');
    const footballTeams = await client.models.FootballTeam.list();
    console.log('FootballTeam list result:', footballTeams);

    console.log('\n⚽ Testing Player model...');
    const players = await client.models.Player.list();
    console.log('Player list result:', players);

    return {
      success: true,
      message: 'Client setup test completed - check console for details',
    };
  } catch (error) {
    console.error('❌ Client setup test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Test schema permissions by attempting API Key auth
export async function testApiKeyAuth() {
  console.log('🔍 Testing API Key authorization...');

  try {
    // Create client with API key authorization
    const apiKeyClient = generateClient<Schema>({
      authMode: 'apiKey',
    });

    console.log('API Key client:', apiKeyClient);

    // Test FootballTeam creation with API key
    console.log('Testing FootballTeam creation with API key...');
    const teamResult = await apiKeyClient.models.FootballTeam.create({
      name: 'API Test Team',
      shortName: 'API',
      code: 'API',
      league: 'Test League',
    });

    console.log('API Key team creation result:', teamResult);

    return {
      success: !!teamResult.data,
      error: teamResult.errors?.[0]?.message,
    };
  } catch (error) {
    console.error('API Key auth test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Test with explicit auth mode
export async function testExplicitUserAuth() {
  console.log('🔍 Testing explicit user pool authorization...');

  try {
    // Create client with explicit user pool auth
    const userClient = generateClient<Schema>({
      authMode: 'userPool',
    });

    console.log('User pool client:', userClient);

    // Test FootballTeam creation
    console.log('Testing FootballTeam creation with user pool auth...');
    const teamResult = await userClient.models.FootballTeam.create({
      name: 'User Test Team',
      shortName: 'USER',
      code: 'USER',
      league: 'Test League',
    });

    console.log('User pool team creation result:', teamResult);

    return {
      success: !!teamResult.data,
      error: teamResult.errors?.[0]?.message,
    };
  } catch (error) {
    console.error('User pool auth test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).debugAmplifySeeding = debugAmplifySeeding;
  (window as any).debugClientSetup = debugClientSetup;
  (window as any).testApiKeyAuth = testApiKeyAuth;
  (window as any).testExplicitUserAuth = testExplicitUserAuth;
}
