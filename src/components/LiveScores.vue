<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const matches = ref<any[]>([]);
const loading = ref(true);
const currentGameweek = ref(1);
let matchSubscription: any = null;

onMounted(async () => {
  await loadMatches();
  subscribeToMatchUpdates();
});

onUnmounted(() => {
  if (matchSubscription) {
    matchSubscription.unsubscribe();
  }
});

const loadMatches = async () => {
  try {
    const { data: matchData } = await client.models.MatchUpdate.list({
      filter: { gameweek: { eq: currentGameweek.value } },
    });

    // Load team details for each match
    const matchesWithTeams = await Promise.all(
      matchData.map(async match => {
        const { data: homeTeam } = await client.models.FootballTeam.get({ id: match.homeTeamId });
        const { data: awayTeam } = await client.models.FootballTeam.get({ id: match.awayTeamId });

        return {
          ...match,
          homeTeam,
          awayTeam,
        };
      })
    );

    matches.value = matchesWithTeams.sort((a, b) => {
      const timeA = a.kickoffTime ? new Date(a.kickoffTime).getTime() : 0;
      const timeB = b.kickoffTime ? new Date(b.kickoffTime).getTime() : 0;
      return timeA - timeB;
    });

    loading.value = false;
  } catch (error) {
    console.error('Error loading matches:', error);
    loading.value = false;
  }
};

const subscribeToMatchUpdates = () => {
  try {
    matchSubscription = client.models.MatchUpdate.onUpdate().subscribe({
      next: updatedMatch => {
        console.log('Match updated:', updatedMatch);

        // Find and update the match in our local state
        const matchIndex = matches.value.findIndex(m => m.id === updatedMatch.id);
        if (matchIndex !== -1) {
          matches.value[matchIndex] = { ...matches.value[matchIndex], ...updatedMatch };
        }
      },
      error: error => {
        console.error('Subscription error:', error);
      },
    });
  } catch (error) {
    console.error('Error setting up subscription:', error);
  }
};

const getMatchStatus = (status: string) => {
  const statuses: { [key: string]: { text: string; class: string; color: string } } = {
    SCHEDULED: { text: 'Upcoming', class: 'scheduled', color: '#6b7280' },
    LIVE: { text: 'LIVE', class: 'live', color: '#ef4444' },
    FINISHED: { text: 'FT', class: 'finished', color: '#22c55e' },
  };
  return statuses[status] || statuses['SCHEDULED'];
};

const formatKickoffTime = (kickoffTime: string) => {
  return new Date(kickoffTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const refreshMatches = async () => {
  loading.value = true;
  await loadMatches();
};
</script>

<template>
  <div class="live-scores">
    <div class="scores-header">
      <h2>Live Scores</h2>
      <div class="header-controls">
        <select v-model="currentGameweek" class="gameweek-select" @change="loadMatches">
          <option v-for="gw in 38" :key="gw" :value="gw">Gameweek {{ gw }}</option>
        </select>
        <button class="refresh-btn" :disabled="loading" @click="refreshMatches">🔄 Refresh</button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner" />
      <p>Loading matches...</p>
    </div>

    <div v-else-if="matches.length === 0" class="no-matches">
      <h3>No matches scheduled</h3>
      <p>Check back later for match updates</p>
    </div>

    <div v-else class="matches-list">
      <div
        v-for="match in matches"
        :key="match.id"
        class="match-card"
        :class="getMatchStatus(match.status).class"
      >
        <div class="match-status">
          <span class="status-indicator" :style="{ color: getMatchStatus(match.status).color }">
            {{ getMatchStatus(match.status).text }}
          </span>
          <span v-if="match.status === 'SCHEDULED'" class="kickoff-time">
            {{ formatKickoffTime(match.kickoffTime) }}
          </span>
        </div>

        <div class="match-teams">
          <div class="team home-team">
            <div class="team-info">
              <span class="team-name">{{ match.homeTeam?.shortName }}</span>
              <span class="full-name">{{ match.homeTeam?.name }}</span>
            </div>
            <div class="team-score">
              {{ match.homeScore }}
            </div>
          </div>

          <div class="match-separator">
            <span class="vs">VS</span>
          </div>

          <div class="team away-team">
            <div class="team-score">
              {{ match.awayScore }}
            </div>
            <div class="team-info">
              <span class="team-name">{{ match.awayTeam?.shortName }}</span>
              <span class="full-name">{{ match.awayTeam?.name }}</span>
            </div>
          </div>
        </div>

        <div v-if="match.status === 'LIVE'" class="live-indicator">
          <div class="pulse-dot" />
          <span>LIVE</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-scores {
  max-width: 800px;
  margin: 0 auto;
}

.scores-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.scores-header h2 {
  color: #2d5a27;
  margin: 0;
}

.header-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.gameweek-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #2563eb;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e3e3e3;
  border-top: 4px solid #2d5a27;
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

.no-matches {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.match-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  position: relative;
}

.match-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.match-card.live {
  border-left: 4px solid #ef4444;
  background: linear-gradient(135deg, #fff 0%, #fef2f2 100%);
}

.match-card.finished {
  border-left: 4px solid #22c55e;
}

.match-card.scheduled {
  border-left: 4px solid #6b7280;
}

.match-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.status-indicator {
  font-weight: 600;
  text-transform: uppercase;
}

.kickoff-time {
  color: #6b7280;
}

.match-teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}

.team {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.away-team {
  flex-direction: row-reverse;
}

.team-info {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.away-team .team-info {
  text-align: center;
}

.team-name {
  font-weight: bold;
  font-size: 1.125rem;
  color: #1f2937;
}

.full-name {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.team-score {
  font-size: 2rem;
  font-weight: bold;
  color: #2d5a27;
  min-width: 40px;
  text-align: center;
}

.match-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}

.vs {
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 500;
}

.live-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

@media (max-width: 768px) {
  .scores-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-controls {
    justify-content: space-between;
  }

  .match-teams {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }

  .team {
    justify-content: center;
  }

  .away-team {
    flex-direction: row;
  }

  .match-separator {
    order: -1;
  }

  .live-indicator {
    position: static;
    margin-top: 1rem;
    align-self: center;
    width: fit-content;
  }
}
</style>
