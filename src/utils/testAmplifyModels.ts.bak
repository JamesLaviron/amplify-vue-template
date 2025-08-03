import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export async function testAmplifyModels() {
  console.log('🔍 Testing Amplify Data Models...');

  try {
    // Test client generation
    console.log('Client:', client);
    console.log('Client models:', client.models);

    // Test FootballTeam model
    console.log('FootballTeam model:', client.models.FootballTeam);

    // Test simple team creation
    console.log('Testing FootballTeam.create...');

    const teamResult = await client.models.FootballTeam.create({
      name: 'Test Team',
      shortName: 'TST',
      code: 'TST',
      league: 'Test League',
    });

    console.log('Team creation result:', teamResult);

    if (teamResult.data) {
      console.log('✅ Team created successfully:', teamResult.data);

      // Test Player model
      console.log('Testing Player.create...');

      const playerResult = await client.models.Player.create({
        name: 'Test Player',
        position: 'MID',
        teamId: teamResult.data.id,
        price: 5.0,
        totalPoints: 0,
        form: 6.0,
        availability: 'AVAILABLE',
      });

      console.log('Player creation result:', playerResult);

      if (playerResult.data) {
        console.log('✅ Player created successfully:', playerResult.data);
      } else {
        console.error('❌ Player creation failed:', playerResult.errors);
      }
    } else {
      console.error('❌ Team creation failed:', teamResult.errors);
    }
  } catch (error) {
    console.error('❌ Model test error:', error);
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).testAmplifyModels = testAmplifyModels;
}
