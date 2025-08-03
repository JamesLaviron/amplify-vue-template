// Test function to examine actual API-Football response structure
export async function testApiFootballResponse(apiKey?: string) {
  if (!apiKey && typeof window !== 'undefined') {
    const userInput = prompt('Enter your API-Football API Key:');
    if (!userInput) {
      console.error('❌ API key is required for testing');
      return { success: false, error: 'API key is required' };
    }
    apiKey = userInput;
  }

  const baseUrl = 'https://v3.football.api-sports.io/';
  const headers = {
    'X-RapidAPI-Key': apiKey || '',
    'X-RapidAPI-Host': 'v3.football.api-sports.io',
    'Content-Type': 'application/json',
  };

  try {
    console.log('🔍 Testing API-Football Teams endpoint...');

    // Test teams endpoint
    const teamsUrl = new URL(`${baseUrl}/teams`);
    teamsUrl.searchParams.append('league', '39'); // Premier League
    teamsUrl.searchParams.append('season', '2024');

    console.log(`Making request to: ${teamsUrl.toString()}`);

    const teamsResponse = await fetch(teamsUrl.toString(), {
      method: 'GET',
      headers,
    });

    if (!teamsResponse.ok) {
      throw new Error(`Teams API failed: ${teamsResponse.status} ${teamsResponse.statusText}`);
    }

    const teamsData = await teamsResponse.json();
    console.log('📊 Teams API Full Response:', teamsData);

    if (teamsData.response && teamsData.response.length > 0) {
      console.log('🏆 First Team Structure:', teamsData.response[0]);
    }

    // Test players endpoint with first team
    if (teamsData.response && teamsData.response.length > 0) {
      const firstTeam = teamsData.response[0];
      const teamId = firstTeam.team?.id || firstTeam.id;

      console.log('🔍 Testing API-Football Players endpoint...');

      const playersUrl = new URL(`${baseUrl}/players`);
      playersUrl.searchParams.append('team', teamId.toString());
      playersUrl.searchParams.append('season', '2024');
      playersUrl.searchParams.append('page', '1');

      console.log(`Making request to: ${playersUrl.toString()}`);

      const playersResponse = await fetch(playersUrl.toString(), {
        method: 'GET',
        headers,
      });

      if (!playersResponse.ok) {
        throw new Error(
          `Players API failed: ${playersResponse.status} ${playersResponse.statusText}`
        );
      }

      const playersData = await playersResponse.json();
      console.log('⚽ Players API Full Response:', playersData);

      if (playersData.response && playersData.response.length > 0) {
        console.log('👤 First Player Structure:', playersData.response[0]);

        if (playersData.response[0].statistics && playersData.response[0].statistics.length > 0) {
          console.log('📈 First Player Statistics:', playersData.response[0].statistics[0]);
        }
      }
    }

    return {
      success: true,
      message: 'API test completed - check console for details',
    };
  } catch (error) {
    console.error('❌ API Test Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// This function is for server-side testing only
// Browser-based API testing has been removed for security reasons
