<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import FantasyTeamManager from './FantasyTeamManager.vue';
import PlayerList from './PlayerList.vue';
import LeagueStandings from './LeagueStandings.vue';
import LiveScores from './LiveScores.vue';
import { Card, CardContent, Button } from './ui';

const client = generateClient<Schema>();

interface Props {
  user: any;
}

const props = defineProps<Props>();

const activeTab = ref('team');
const userProfile = ref<any>(null);
const fantasyTeam = ref<any>(null);
const loading = ref(true);

const tabs = [
  { id: 'team', label: 'My Team', icon: '👥' },
  { id: 'players', label: 'Players', icon: '⚽' },
  { id: 'leagues', label: 'Leagues', icon: '🏆' },
  { id: 'scores', label: 'Live Scores', icon: '⚡' },
  { id: 'transfers', label: 'Transfers', icon: '🔄' },
];

onMounted(async () => {
  await loadUserData();
});

const loadUserData = async () => {
  try {
    // Check if user has a profile
    const { data: profiles } = await client.models.UserProfile.list({
      filter: { email: { eq: props.user.signInDetails?.loginId || props.user.attributes?.email } },
    });

    if (profiles.length === 0) {
      // Create user profile
      const { data: newProfile } = await client.models.UserProfile.create({
        username:
          props.user.username || props.user.signInDetails?.loginId?.split('@')[0] || 'Player',
        email: props.user.signInDetails?.loginId || props.user.attributes?.email,
        createdAt: new Date().toISOString(),
      });

      if (!newProfile) {
        throw new Error('Failed to create user profile');
      }

      userProfile.value = newProfile;
    } else {
      userProfile.value = profiles[0];
    }

    // Check if user has a fantasy team
    if (!userProfile.value || !userProfile.value.id) {
      throw new Error('Failed to create or load user profile');
    }

    const { data: teams } = await client.models.FantasyTeam.list({
      filter: { owner: { eq: userProfile.value.id } },
    });

    if (teams.length === 0) {
      // Create default fantasy team
      const { data: newTeam } = await client.models.FantasyTeam.create({
        name: `${userProfile.value.username}'s Team`,
        owner: userProfile.value.id,
        budget: 100.0,
        formation: '4-4-2',
      });
      fantasyTeam.value = newTeam;
    } else {
      fantasyTeam.value = teams[0];
    }

    loading.value = false;
  } catch (error) {
    console.error('Error loading user data:', error);
    loading.value = false;
  }
};

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId;
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto max-w-6xl p-4">
      <div v-if="loading" class="flex flex-col items-center justify-center h-80 gap-4">
        <div class="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
        <p class="text-muted-foreground">Loading your fantasy team...</p>
      </div>

      <div v-else class="dashboard-content">
        <!-- Navigation Tabs -->
        <nav class="flex bg-card rounded-lg p-2 shadow-sm mb-6 gap-2">
          <Button
            v-for="tab in tabs"
            :key="tab.id"
            :variant="activeTab === tab.id ? 'default' : 'ghost'"
            class="flex-1 justify-center gap-2"
            @click="setActiveTab(tab.id)"
          >
            <span class="text-lg">{{ tab.icon }}</span>
            <span class="font-medium">{{ tab.label }}</span>
          </Button>
        </nav>

        <!-- User Stats Bar -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent class="p-4 text-center">
              <div class="text-sm text-muted-foreground mb-2">Total Points</div>
              <div class="text-2xl font-bold text-primary">{{ userProfile?.totalPoints || 0 }}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-4 text-center">
              <div class="text-sm text-muted-foreground mb-2">Gameweek</div>
              <div class="text-2xl font-bold text-primary">
                {{ userProfile?.currentGameweek || 1 }}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-4 text-center">
              <div class="text-sm text-muted-foreground mb-2">Budget</div>
              <div class="text-2xl font-bold text-primary">
                £{{ fantasyTeam?.budget?.toFixed(1) || '100.0' }}m
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Tab Content -->
        <Card>
          <CardContent class="p-6">
            <FantasyTeamManager
              v-if="activeTab === 'team'"
              :fantasy-team="fantasyTeam"
              :user-profile="userProfile"
              @team-updated="loadUserData"
            />

            <PlayerList
              v-if="activeTab === 'players'"
              :fantasy-team="fantasyTeam"
              @player-selected="loadUserData"
            />

            <LeagueStandings
              v-if="activeTab === 'leagues'"
              :user-profile="userProfile"
              :fantasy-team="fantasyTeam"
            />

            <LiveScores v-if="activeTab === 'scores'" />

            <div v-if="activeTab === 'transfers'" class="text-center py-12">
              <h2 class="text-2xl font-bold text-primary mb-4">Transfers</h2>
              <p class="text-muted-foreground">Transfer functionality coming soon!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
