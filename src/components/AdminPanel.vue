<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-foreground mb-4">🔧 Admin Panel</h2>
      <p class="text-muted-foreground mb-8">
        Administrative tools for managing the fantasy football database
      </p>
    </div>

    <!-- Database Seeding Section -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span>🌱</span>
          Database Seeding
        </CardTitle>
        <p class="text-muted-foreground">
          Populate the database with real Premier League teams and players from API-Football
        </p>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Seeding Status -->
        <Alert
          v-if="seedingStatus.message"
          :class="
            seedingStatus.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : seedingStatus.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-blue-200 bg-blue-50 text-blue-800'
          "
        >
          <div class="flex items-center">
            <svg
              v-if="seedingStatus.type === 'success'"
              class="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="seedingStatus.type === 'error'"
              class="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4 mr-2 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {{ seedingStatus.message }}
          </div>
        </Alert>

        <!-- Seeding Progress -->
        <div v-if="seedingProgress.show" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Progress</span>
            <span>{{ seedingProgress.current }} / {{ seedingProgress.total }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(seedingProgress.current / seedingProgress.total) * 100}%` }"
            />
          </div>
        </div>

        <!-- Seeding Results -->
        <div
          v-if="seedingResults.teams > 0 || seedingResults.players > 0"
          class="grid grid-cols-2 gap-4"
        >
          <div class="text-center p-4 bg-muted/30 rounded-lg">
            <div class="text-2xl font-bold text-primary">{{ seedingResults.teams }}</div>
            <div class="text-sm text-muted-foreground">Teams Created</div>
          </div>
          <div class="text-center p-4 bg-muted/30 rounded-lg">
            <div class="text-2xl font-bold text-primary">{{ seedingResults.players }}</div>
            <div class="text-sm text-muted-foreground">Players Created</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <Button :disabled="isSeeding" class="flex-1" @click="startSeeding">
            <div
              v-if="isSeeding"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
            />
            {{ isSeeding ? 'Seeding in Progress...' : 'Seed Premier League Data' }}
          </Button>

          <Button variant="outline" :disabled="isSeeding || isChecking" @click="checkData">
            <div
              v-if="isChecking"
              class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
            />
            {{ isChecking ? 'Checking...' : 'Check Current Data' }}
          </Button>
        </div>

        <!-- Current Data Status -->
        <div
          v-if="currentData.teams >= 0 || currentData.players >= 0"
          class="mt-4 p-4 bg-muted/20 rounded-lg"
        >
          <h4 class="font-semibold mb-2">Current Database Status</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-muted-foreground">Teams:</span>
              <span class="ml-2 font-medium">{{ currentData.teams }}</span>
            </div>
            <div>
              <span class="text-muted-foreground">Players:</span>
              <span class="ml-2 font-medium">{{ currentData.players }}</span>
            </div>
          </div>
        </div>

        <!-- Warning -->
        <Alert class="border-yellow-200 bg-yellow-50 text-yellow-800">
          <div class="flex items-start">
            <svg class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <strong>Warning:</strong>
              This operation will replace all existing teams and players with fresh data from
              API-Football. The process may take 10-15 minutes to complete.
            </div>
          </div>
        </Alert>
      </CardContent>
    </Card>

    <!-- API Status -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <span>📡</span>
          API Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>API-Football Connection:</span>
            <span :class="apiStatus === 'connected' ? 'text-green-600' : 'text-red-600'">
              {{ apiStatus === 'connected' ? '✅ Connected' : '❌ Disconnected' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span>Premier League ID:</span>
            <span class="font-mono">39</span>
          </div>
          <div class="flex justify-between">
            <span>Season:</span>
            <span class="font-mono">2024</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { Card, CardHeader, CardTitle, CardContent, Button, Alert } from './ui';

const client = generateClient<Schema>();

const isSeeding = ref(false);
const isChecking = ref(false);
const apiStatus = ref<'connected' | 'disconnected'>('disconnected');

const seedingStatus = ref<{
  type: 'success' | 'error' | 'info' | null;
  message: string;
}>({ type: null, message: '' });

const seedingProgress = ref({
  show: false,
  current: 0,
  total: 100,
});

const seedingResults = ref({
  teams: 0,
  players: 0,
});

const currentData = ref({
  teams: -1,
  players: -1,
});

onMounted(async () => {
  await checkData();
});

const checkData = async () => {
  isChecking.value = true;
  try {
    const [teamsResult, playersResult] = await Promise.all([
      client.models.FootballTeam.list(),
      client.models.Player.list(),
    ]);

    currentData.value = {
      teams: teamsResult.data?.length || 0,
      players: playersResult.data?.length || 0,
    };

    apiStatus.value = 'connected';
  } catch (error) {
    console.error('Error checking data:', error);
    apiStatus.value = 'disconnected';
  } finally {
    isChecking.value = false;
  }
};

const startSeeding = async () => {
  isSeeding.value = true;
  seedingStatus.value = { type: 'info', message: 'Starting Premier League data seeding...' };
  seedingProgress.value = { show: true, current: 0, total: 100 };
  seedingResults.value = { teams: 0, players: 0 };

  try {
    // Use the server-side seeding service instead of client-side seeding
    const { seedingService } = await import('../utils/seedingService');

    const result = await seedingService.seedPremierLeagueData({
      season: 2023,
      playerLimit: 2, // Reasonable limit for production
    });

    if (result.success) {
      seedingResults.value = {
        teams: result.teamsCreated,
        players: result.playersCreated,
      };

      seedingStatus.value = {
        type: 'success',
        message: `Successfully seeded ${result.teamsCreated} teams and ${result.playersCreated} players!`,
      };

      // Refresh current data
      setTimeout(() => checkData(), 2000);
    } else {
      throw new Error(result.error || 'Seeding failed');
    }
  } catch (error) {
    console.error('Seeding error:', error);
    seedingStatus.value = {
      type: 'error',
      message: `Seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    isSeeding.value = false;
    seedingProgress.value.show = false;
  }
};
</script>
