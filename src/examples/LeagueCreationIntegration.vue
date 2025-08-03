<!--
  Example component showing how seeding should be integrated
  into league creation workflows (NOT as admin buttons)
-->
<template>
  <div class="league-creation-form">
    <h2>Create New League</h2>

    <form @submit.prevent="handleCreateLeague">
      <div class="form-group">
        <label for="leagueName">League Name</label>
        <input
          id="leagueName"
          v-model="leagueName"
          type="text"
          required
          placeholder="My Fantasy League"
        />
      </div>

      <div class="form-group">
        <label for="leagueType">League Type</label>
        <select id="leagueType" v-model="selectedLeagueType" required>
          <option value="">Select league type</option>
          <option value="premier-league">Premier League</option>
          <option value="la-liga">La Liga</option>
          <option value="serie-a">Serie A</option>
        </select>
      </div>

      <div class="form-group">
        <label for="maxMembers">Maximum Members</label>
        <input id="maxMembers" v-model="maxMembers" type="number" min="2" max="20" required />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isCreating" class="btn btn-primary">
          {{ isCreating ? 'Creating League...' : 'Create League' }}
        </button>
      </div>

      <!-- Seeding progress (hidden from user, for monitoring only) -->
      <div v-if="seedingInProgress" class="seeding-status">
        <div class="seeding-indicator">
          <div class="spinner" />
          <span>Setting up league data...</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { seedingService } from '../utils/seedingService';

const client = generateClient<Schema>();

// Form data
const leagueName = ref('');
const selectedLeagueType = ref('');
const maxMembers = ref(10);

// UI state
const isCreating = ref(false);
const seedingInProgress = ref(false);

/**
 * Handle league creation - this is where seeding is triggered
 * The seeding happens transparently as part of the league setup process
 */
async function handleCreateLeague() {
  if (!leagueName.value || !selectedLeagueType.value) {
    return;
  }

  isCreating.value = true;

  try {
    console.log('🏆 Creating new league:', {
      name: leagueName.value,
      type: selectedLeagueType.value,
      maxMembers: maxMembers.value,
    });

    // Step 1: Check if we need to seed data for this league type
    if (selectedLeagueType.value === 'premier-league') {
      console.log('🔍 Checking if Premier League data needs seeding...');

      // Check if teams exist for this league
      const existingTeams = await client.models.FootballTeam.list({
        filter: { league: { eq: 'Premier League' } },
        limit: 1,
      });

      if (existingTeams.data.length === 0) {
        console.log('🌱 No Premier League data found, triggering seeding...');
        seedingInProgress.value = true;

        // Trigger seeding programmatically (NOT via admin button)
        const seedingResult = await seedingService.seedPremierLeagueData({
          season: 2023,
          playerLimit: 2, // Reasonable limit for production
        });

        if (!seedingResult.success) {
          throw new Error(`Data seeding failed: ${seedingResult.error}`);
        }

        console.log('✅ Seeding completed:', {
          teamsCreated: seedingResult.teamsCreated,
          playersCreated: seedingResult.playersCreated,
          duration: `${seedingResult.duration}ms`,
        });

        seedingInProgress.value = false;
      } else {
        console.log('ℹ️  Premier League data already exists, proceeding with league creation');
      }
    }

    // Step 2: Create the actual league
    const leagueResult = await client.models.League.create({
      name: leagueName.value,
      code: `LEAGUE-${Date.now()}`, // Generate unique join code
      creatorId: 'current-user-id', // This would be the actual user ID from auth
      maxParticipants: maxMembers.value,
      isPublic: false,
    });

    if (leagueResult.data) {
      console.log('🎉 League created successfully:', leagueResult.data);

      // Step 3: Add current user as league admin
      await client.models.LeagueMembership.create({
        leagueId: leagueResult.data.id,
        userId: 'current-user-id', // This would be the actual user ID from auth
        fantasyTeamId: 'fantasy-team-id', // This would be the user's fantasy team ID
        joinedAt: new Date().toISOString(),
      });

      // Reset form
      leagueName.value = '';
      selectedLeagueType.value = '';
      maxMembers.value = 10;

      // Navigate to league or show success message
      console.log('✅ League creation completed successfully!');
    } else {
      throw new Error('Failed to create league');
    }
  } catch (error) {
    console.error('❌ League creation failed:', error);
    // Show error message to user
  } finally {
    isCreating.value = false;
    seedingInProgress.value = false;
  }
}
</script>

<style scoped>
.league-creation-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  text-align: center;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.seeding-status {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
}

.seeding-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6c757d;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e9ecef;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
