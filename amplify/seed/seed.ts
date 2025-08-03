/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../data/resource';
import { Amplify } from 'aws-amplify';
import amplifyOutputs from '../../amplify_outputs.json';
import {
  parseCsvFile,
  convertToStaticLeague,
  convertToStaticPlayer,
  convertToFootballTeam,
  convertToPlayer,
  type TeamRecord,
  type PlayerRecord,
} from './utils';
import path from 'path';

// Configure Amplify
Amplify.configure(amplifyOutputs);

// Initialize client with appropriate auth mode based on amplify_outputs configuration
const getOptimalClient = () => {
  const defaultAuthType = amplifyOutputs.data?.default_authorization_type;
  const availableAuthTypes = amplifyOutputs.data?.authorization_types || [];

  // Prefer API key for seeding operations if available
  if (availableAuthTypes.includes('AWS_API_KEY') || defaultAuthType === 'AWS_API_KEY') {
    console.log('🔑 Using API key client for seeding operations');
    return generateClient<Schema>({
      authMode: 'apiKey',
    });
  }

  // Fallback to default client (usually user pool auth)
  console.log('🔐 Using default authenticated client for seeding operations');
  return generateClient<Schema>();
};

const client = getOptimalClient();

async function verifyTablesAndLog() {
  console.log('🔍 Verifying DynamoDB tables and Amplify configuration...');

  // Log Amplify outputs info (without sensitive data)
  console.log('📊 Amplify Configuration:');
  console.log('  Region:', amplifyOutputs.data?.aws_region || 'not found');
  console.log('  GraphQL Endpoint:', amplifyOutputs.data?.url ? 'configured' : 'missing');
  console.log('  Auth configured:', !!amplifyOutputs.auth);
  console.log('  API Key configured:', !!amplifyOutputs.data?.api_key);
  console.log('  Default Auth Type:', amplifyOutputs.data?.default_authorization_type || 'unknown');
  console.log('  Available Auth Types:', amplifyOutputs.data?.authorization_types || []);

  // Log User Pool info (without sensitive details)
  if (amplifyOutputs.auth) {
    console.log('  User Pool Region:', amplifyOutputs.auth.aws_region);
    console.log('  User Pool ID:', amplifyOutputs.auth.user_pool_id ? 'configured' : 'missing');
    console.log(
      '  Identity Pool ID:',
      amplifyOutputs.auth.identity_pool_id ? 'configured' : 'missing'
    );
  }

  // Log model information from amplify_outputs
  const modelIntrospection = amplifyOutputs.data?.model_introspection;
  if (modelIntrospection) {
    console.log('  Model Introspection Version:', modelIntrospection.version);
    console.log('  Available Models:', Object.keys(modelIntrospection.models || {}));

    // Extract and log authorization information for seeding models
    const seedingModels = ['StaticLeague', 'StaticPlayer', 'FootballTeam', 'Player'];

    for (const modelName of seedingModels) {
      const model = (modelIntrospection.models as any)?.[modelName];
      if (model) {
        // Extract authorization rules
        const authAttribute = model.attributes?.find((attr: any) => attr.type === 'auth');
        const authRules = authAttribute?.properties?.rules || [];

        const formattedRules = authRules.map((rule: any) => {
          const provider = rule.provider ? `(${rule.provider})` : '';
          const operations = rule.operations ? `[${rule.operations.join(',')}]` : '';
          return `${rule.allow}${provider}${operations}`;
        });

        console.log(
          `  ${modelName} Auth Rules:`,
          formattedRules.length > 0 ? formattedRules : ['No auth rules found']
        );

        // Check if model supports API key access for seeding
        const supportsApiKey = authRules.some(
          (rule: any) => rule.allow === 'public' || rule.provider === 'apiKey'
        );
        const supportsPrivate = authRules.some(
          (rule: any) => rule.allow === 'private' || rule.provider === 'cognito'
        );

        console.log(`    - API Key Access: ${supportsApiKey ? '✅' : '❌'}`);
        console.log(`    - Private Access: ${supportsPrivate ? '✅' : '❌'}`);
      } else {
        console.log(`  ${modelName}: Model not found in introspection`);
      }
    }
  }

  // Verify client and models
  console.log('🔧 Client Configuration:');
  console.log('  Client exists:', !!client);
  console.log('  Models available:', !!client.models);
  console.log('  Available models:', client.models ? Object.keys(client.models) : []);
  console.log('  StaticLeague model:', !!client.models?.StaticLeague);
  console.log('  StaticPlayer model:', !!client.models?.StaticPlayer);
  console.log('  FootballTeam model:', !!client.models?.FootballTeam);
  console.log('  Player model:', !!client.models?.Player);

  // Test table accessibility with simple queries
  const clientAuthMode =
    amplifyOutputs.data?.default_authorization_type === 'AWS_API_KEY' ||
    amplifyOutputs.data?.authorization_types?.includes('AWS_API_KEY')
      ? 'apiKey'
      : 'authenticated';
  console.log(`🧪 Testing table accessibility (using ${clientAuthMode} client)...`);

  const tableTests = [
    { name: 'StaticLeague', model: client.models?.StaticLeague as any },
    { name: 'StaticPlayer', model: client.models?.StaticPlayer as any },
    { name: 'FootballTeam', model: client.models?.FootballTeam as any },
    { name: 'Player', model: client.models?.Player as any },
  ];

  for (const test of tableTests) {
    if (!test.model) {
      console.log(`  ❌ ${test.name}: Model not available on ${clientAuthMode} client`);
      continue;
    }

    try {
      const result = await test.model.list({ limit: 1 });
      const itemCount = result.data?.length || 0;
      const errorCount = result.errors?.length || 0;

      console.log(
        `  ✅ ${test.name}: Accessible via ${clientAuthMode} (${itemCount} items, ${errorCount} errors)`
      );

      if (result.errors && result.errors.length > 0) {
        console.log(
          '    ⚠️ Errors:',
          result.errors.map((e: { message: string }) => e.message)
        );
      }

      // Log first item structure if available for debugging
      if (itemCount > 0 && result.data?.[0]) {
        const sampleFields = Object.keys(result.data[0]).slice(0, 5);
        console.log(
          `    📝 Sample fields: [${sampleFields.join(', ')}${sampleFields.length < Object.keys(result.data[0]).length ? ', ...' : ''}]`
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`  ❌ ${test.name}: Error with ${clientAuthMode} client -`, errorMessage);
    }
  }

  console.log('✨ Table verification completed\n');
}

async function seedStaticTeams(): Promise<string[]> {
  console.log('🏟️ Seeding static teams...');

  try {
    const teamsPath = path.resolve(__dirname, '../../teams.csv');
    const teamRecords = parseCsvFile<TeamRecord>(teamsPath);

    console.log(`Found ${teamRecords.length} teams to seed`);

    const createdTeamIds: string[] = [];

    for (let i = 0; i < teamRecords.length; i++) {
      const teamRecord = teamRecords[i];
      const staticLeague = convertToStaticLeague(teamRecord);

      try {
        const result = await client.models.StaticLeague.create(staticLeague);

        if (result.data) {
          createdTeamIds.push(result.data.id);
          console.log(
            `✅ Created static team: ${result.data.name} (${i + 1}/${teamRecords.length})`
          );
        } else {
          console.error(`❌ Failed to create team ${staticLeague.name}:`, result.errors);
        }
      } catch (error: any) {
        console.error(`💥 Error creating team ${staticLeague.name}:`, error);
      }

      // Small delay to avoid overwhelming the API
      if (i < teamRecords.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(
      `✨ Static teams seeding completed: ${createdTeamIds.length}/${teamRecords.length} teams created`
    );
    return createdTeamIds;
  } catch (error: any) {
    console.error('💥 Error seeding static teams:', error);
    throw error;
  }
}

async function seedStaticPlayers(): Promise<string[]> {
  console.log('⚽ Seeding static players...');

  try {
    const playersPath = path.resolve(__dirname, '../../players.csv');
    const playerRecords = parseCsvFile<PlayerRecord>(playersPath);

    console.log(`Found ${playerRecords.length} players to seed`);

    const createdPlayerIds: string[] = [];
    let batchCount = 0;

    for (let i = 0; i < playerRecords.length; i++) {
      const playerRecord = playerRecords[i];
      const staticPlayer = convertToStaticPlayer(playerRecord);

      try {
        const result = await client.models.StaticPlayer.create(staticPlayer);

        if (result.data) {
          createdPlayerIds.push(result.data.id);
          batchCount++;

          // Progress logging every 10 players
          if (batchCount % 10 === 0) {
            console.log(
              `✅ Created ${batchCount} static players... (${i + 1}/${playerRecords.length})`
            );
          }
        } else {
          console.error(`❌ Failed to create player ${staticPlayer.name}:`, result.errors);
        }
      } catch (error: any) {
        console.error(`💥 Error creating player ${staticPlayer.name}:`, error);
      }

      // Small delay every 5 players to avoid rate limiting
      if ((i + 1) % 5 === 0 && i < playerRecords.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    console.log(
      `✨ Static players seeding completed: ${createdPlayerIds.length}/${playerRecords.length} players created`
    );
    return createdPlayerIds;
  } catch (error: any) {
    console.error('💥 Error seeding static players:', error);
    throw error;
  }
}

async function seedOperationalTeams(): Promise<Map<string, string>> {
  console.log('🏆 Seeding operational football teams...');

  try {
    const teamsPath = path.resolve(__dirname, '../../teams.csv');
    const teamRecords = parseCsvFile<TeamRecord>(teamsPath);

    console.log(`Found ${teamRecords.length} teams to seed`);

    const apiIdToTeamId = new Map<string, string>();

    for (let i = 0; i < teamRecords.length; i++) {
      const teamRecord = teamRecords[i];
      const footballTeam = convertToFootballTeam(teamRecord);

      try {
        const result = await client.models.FootballTeam.create(footballTeam);

        if (result.data) {
          apiIdToTeamId.set(teamRecord.apiId, result.data.id);
          console.log(
            `✅ Created football team: ${result.data.name} (${i + 1}/${teamRecords.length})`
          );
        } else {
          console.error(`❌ Failed to create team ${footballTeam.name}:`, result.errors);
        }
      } catch (error: any) {
        console.error(`💥 Error creating team ${footballTeam.name}:`, error);
      }

      // Small delay to avoid overwhelming the API
      if (i < teamRecords.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(
      `✨ Operational teams seeding completed: ${apiIdToTeamId.size}/${teamRecords.length} teams created`
    );
    return apiIdToTeamId;
  } catch (error: any) {
    console.error('💥 Error seeding operational teams:', error);
    throw error;
  }
}

async function seedOperationalPlayers(teamMapping: Map<string, string>): Promise<string[]> {
  console.log('👥 Seeding operational players...');

  try {
    const playersPath = path.resolve(__dirname, '../../players.csv');
    const playerRecords = parseCsvFile<PlayerRecord>(playersPath);

    console.log(`Found ${playerRecords.length} players to seed`);

    const createdPlayerIds: string[] = [];
    let batchCount = 0;

    for (let i = 0; i < playerRecords.length; i++) {
      const playerRecord = playerRecords[i];
      const teamId = teamMapping.get(playerRecord.teamApiId);

      if (!teamId) {
        console.warn(
          `⚠️ No team found for player ${playerRecord.name} (teamApiId: ${playerRecord.teamApiId})`
        );
        continue;
      }

      const player = convertToPlayer(playerRecord, teamId);

      try {
        const result = await client.models.Player.create(player);

        if (result.data) {
          createdPlayerIds.push(result.data.id);
          batchCount++;

          // Progress logging every 10 players
          if (batchCount % 10 === 0) {
            console.log(
              `✅ Created ${batchCount} operational players... (${i + 1}/${playerRecords.length})`
            );
          }
        } else {
          console.error(`❌ Failed to create player ${player.name}:`, result.errors);
        }
      } catch (error: any) {
        console.error(`💥 Error creating player ${player.name}:`, error);
      }

      // Small delay every 5 players to avoid rate limiting
      if ((i + 1) % 5 === 0 && i < playerRecords.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    console.log(
      `✨ Operational players seeding completed: ${createdPlayerIds.length} players created`
    );
    return createdPlayerIds;
  } catch (error: any) {
    console.error('💥 Error seeding operational players:', error);
    throw error;
  }
}

export default async function main() {
  const startTime = Date.now();
  console.log('🌱 Starting Premier League data seeding...');

  try {
    // Phase 0: Verify tables and configuration
    console.log('\n🔍 Phase 0: Verifying tables and configuration...');
    await verifyTablesAndLog();

    // Seed static data (reference tables)
    console.log('\n📊 Phase 1: Seeding static reference data...');
    const staticTeamIds = await seedStaticTeams();
    const staticPlayerIds = await seedStaticPlayers();

    // Seed operational data (used by the fantasy game)
    console.log('\n🎮 Phase 2: Seeding operational game data...');
    const teamMapping = await seedOperationalTeams();
    const operationalPlayerIds = await seedOperationalPlayers(teamMapping);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('📈 Summary:');
    console.log(`   Static teams: ${staticTeamIds.length}`);
    console.log(`   Static players: ${staticPlayerIds.length}`);
    console.log(`   Operational teams: ${teamMapping.size}`);
    console.log(`   Operational players: ${operationalPlayerIds.length}`);
    console.log(`   Duration: ${duration} seconds`);
  } catch (error: any) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}
