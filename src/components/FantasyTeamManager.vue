<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface Props {
  fantasyTeam: any;
  userProfile: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['team-updated']);

const selectedPlayers = ref<any[]>([]);
const formations = ['4-4-2', '4-3-3', '3-5-2', '5-3-2', '4-5-1'];
const currentFormation = ref(props.fantasyTeam?.formation || '4-4-2');
const loading = ref(true);

onMounted(async () => {
  await loadTeamPlayers();
});

const loadTeamPlayers = async () => {
  try {
    if (!props.fantasyTeam?.id) return;

    const { data: selections } = await client.models.FantasySelection.list({
      filter: {
        fantasyTeamId: { eq: props.fantasyTeam.id },
        gameweekSelected: { eq: props.userProfile?.currentGameweek || 1 },
      },
    });

    // Load player details for each selection
    const playersWithDetails = await Promise.all(
      selections.map(async selection => {
        const { data: player } = await client.models.Player.get({ id: selection.playerId });
        const { data: team } = await client.models.FootballTeam.get({ id: player?.teamId || '' });

        return {
          ...selection,
          player: { ...player, team },
        };
      })
    );

    selectedPlayers.value = playersWithDetails;
    loading.value = false;
  } catch (error) {
    console.error('Error loading team players:', error);
    loading.value = false;
  }
};

const updateFormation = async (formation: string) => {
  try {
    await client.models.FantasyTeam.update({
      id: props.fantasyTeam.id,
      formation,
    });
    currentFormation.value = formation;
    emit('team-updated');
  } catch (error) {
    console.error('Error updating formation:', error);
  }
};

const setCaptain = async (selectionId: string) => {
  try {
    // Remove captain from all players
    await Promise.all(
      selectedPlayers.value.map(async selection => {
        if (selection.isCaptain) {
          await client.models.FantasySelection.update({
            id: selection.id,
            isCaptain: false,
            isViceCaptain: false,
          });
        }
      })
    );

    // Set new captain
    await client.models.FantasySelection.update({
      id: selectionId,
      isCaptain: true,
      isViceCaptain: false,
    });

    await loadTeamPlayers();
  } catch (error) {
    console.error('Error setting captain:', error);
  }
};

const setViceCaptain = async (selectionId: string) => {
  try {
    // Remove vice captain from all players
    await Promise.all(
      selectedPlayers.value.map(async selection => {
        if (selection.isViceCaptain) {
          await client.models.FantasySelection.update({
            id: selection.id,
            isViceCaptain: false,
          });
        }
      })
    );

    // Set new vice captain
    await client.models.FantasySelection.update({
      id: selectionId,
      isViceCaptain: true,
    });

    await loadTeamPlayers();
  } catch (error) {
    console.error('Error setting vice captain:', error);
  }
};

const playersOnField = computed(() =>
  selectedPlayers.value.filter(selection => !selection.isOnBench)
);

const playersOnBench = computed(() =>
  selectedPlayers.value.filter(selection => selection.isOnBench)
);

const getPositionPlayers = (position: string) => {
  return playersOnField.value.filter(selection => selection.player?.position === position);
};

const getPositionIcon = (position: string) => {
  const icons: { [key: string]: string } = {
    GK: '🥅',
    DEF: '🛡️',
    MID: '⚽',
    FWD: '🎯',
  };
  return icons[position] || '⚽';
};

const getAvailabilityStatus = (availability: string) => {
  const statuses: { [key: string]: { color: string; text: string } } = {
    AVAILABLE: { color: '#22c55e', text: 'Available' },
    INJURED: { color: '#ef4444', text: 'Injured' },
    SUSPENDED: { color: '#f59e0b', text: 'Suspended' },
    DOUBTFUL: { color: '#f97316', text: 'Doubtful' },
  };
  return statuses[availability] || statuses['AVAILABLE'];
};
</script>

<template>
  <div class="fantasy-team-manager">
    <div class="team-header">
      <h2>{{ fantasyTeam?.name || 'My Team' }}</h2>
      <div class="formation-selector">
        <label>Formation:</label>
        <select v-model="currentFormation" @change="updateFormation(currentFormation)">
          <option v-for="formation in formations" :key="formation" :value="formation">
            {{ formation }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner" />
      <p>Loading your team...</p>
    </div>

    <div v-else class="team-content">
      <!-- Football Pitch Layout -->
      <div class="pitch">
        <div class="field">
          <!-- Formation Display -->
          <div class="formation-display">
            <div class="position-line goalkeepers">
              <div
                v-for="player in getPositionPlayers('GK')"
                :key="player.id"
                class="player-card"
                :class="{ captain: player.isCaptain, viceCaptain: player.isViceCaptain }"
              >
                <div class="player-info">
                  <span class="player-position">{{ getPositionIcon(player.player.position) }}</span>
                  <span class="player-name">{{ player.player.name }}</span>
                  <span class="player-team">{{ player.player.team?.shortName }}</span>
                  <span class="player-points">{{ player.player.totalPoints }}pts</span>
                </div>
                <div class="player-actions">
                  <button
                    v-if="!player.isCaptain"
                    class="captain-btn"
                    title="Make Captain"
                    @click="setCaptain(player.id)"
                  >
                    C
                  </button>
                  <button
                    v-if="!player.isViceCaptain && !player.isCaptain"
                    class="vice-captain-btn"
                    title="Make Vice Captain"
                    @click="setViceCaptain(player.id)"
                  >
                    VC
                  </button>
                </div>
                <div
                  class="availability-indicator"
                  :style="{
                    backgroundColor: getAvailabilityStatus(player.player.availability).color,
                  }"
                  :title="getAvailabilityStatus(player.player.availability).text"
                />
              </div>
            </div>

            <div class="position-line defenders">
              <div
                v-for="player in getPositionPlayers('DEF')"
                :key="player.id"
                class="player-card"
                :class="{ captain: player.isCaptain, viceCaptain: player.isViceCaptain }"
              >
                <div class="player-info">
                  <span class="player-position">{{ getPositionIcon(player.player.position) }}</span>
                  <span class="player-name">{{ player.player.name }}</span>
                  <span class="player-team">{{ player.player.team?.shortName }}</span>
                  <span class="player-points">{{ player.player.totalPoints }}pts</span>
                </div>
                <div class="player-actions">
                  <button
                    v-if="!player.isCaptain"
                    class="captain-btn"
                    @click="setCaptain(player.id)"
                  >
                    C
                  </button>
                  <button
                    v-if="!player.isViceCaptain && !player.isCaptain"
                    class="vice-captain-btn"
                    @click="setViceCaptain(player.id)"
                  >
                    VC
                  </button>
                </div>
                <div
                  class="availability-indicator"
                  :style="{
                    backgroundColor: getAvailabilityStatus(player.player.availability).color,
                  }"
                />
              </div>
            </div>

            <div class="position-line midfielders">
              <div
                v-for="player in getPositionPlayers('MID')"
                :key="player.id"
                class="player-card"
                :class="{ captain: player.isCaptain, viceCaptain: player.isViceCaptain }"
              >
                <div class="player-info">
                  <span class="player-position">{{ getPositionIcon(player.player.position) }}</span>
                  <span class="player-name">{{ player.player.name }}</span>
                  <span class="player-team">{{ player.player.team?.shortName }}</span>
                  <span class="player-points">{{ player.player.totalPoints }}pts</span>
                </div>
                <div class="player-actions">
                  <button
                    v-if="!player.isCaptain"
                    class="captain-btn"
                    @click="setCaptain(player.id)"
                  >
                    C
                  </button>
                  <button
                    v-if="!player.isViceCaptain && !player.isCaptain"
                    class="vice-captain-btn"
                    @click="setViceCaptain(player.id)"
                  >
                    VC
                  </button>
                </div>
                <div
                  class="availability-indicator"
                  :style="{
                    backgroundColor: getAvailabilityStatus(player.player.availability).color,
                  }"
                />
              </div>
            </div>

            <div class="position-line forwards">
              <div
                v-for="player in getPositionPlayers('FWD')"
                :key="player.id"
                class="player-card"
                :class="{ captain: player.isCaptain, viceCaptain: player.isViceCaptain }"
              >
                <div class="player-info">
                  <span class="player-position">{{ getPositionIcon(player.player.position) }}</span>
                  <span class="player-name">{{ player.player.name }}</span>
                  <span class="player-team">{{ player.player.team?.shortName }}</span>
                  <span class="player-points">{{ player.player.totalPoints }}pts</span>
                </div>
                <div class="player-actions">
                  <button
                    v-if="!player.isCaptain"
                    class="captain-btn"
                    @click="setCaptain(player.id)"
                  >
                    C
                  </button>
                  <button
                    v-if="!player.isViceCaptain && !player.isCaptain"
                    class="vice-captain-btn"
                    @click="setViceCaptain(player.id)"
                  >
                    VC
                  </button>
                </div>
                <div
                  class="availability-indicator"
                  :style="{
                    backgroundColor: getAvailabilityStatus(player.player.availability).color,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bench -->
      <div class="bench-section">
        <h3>Bench</h3>
        <div class="bench-players">
          <div v-for="player in playersOnBench" :key="player.id" class="bench-player">
            <span class="player-position">{{ getPositionIcon(player.player.position) }}</span>
            <span class="player-name">{{ player.player.name }}</span>
            <span class="player-team">{{ player.player.team?.shortName }}</span>
            <span class="player-points">{{ player.player.totalPoints }}pts</span>
            <div
              class="availability-indicator"
              :style="{ backgroundColor: getAvailabilityStatus(player.player.availability).color }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fantasy-team-manager {
  max-width: 800px;
  margin: 0 auto;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.team-header h2 {
  color: #2d5a27;
  margin: 0;
}

.formation-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.formation-selector select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e3e3e3;
  border-top: 3px solid #2d5a27;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.pitch {
  background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  min-height: 400px;
}

.field {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: 8px;
  padding: 1rem;
  height: 100%;
}

.formation-display {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 1rem;
}

.position-line {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.player-card {
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 120px;
  text-align: center;
  position: relative;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.player-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.player-card.captain {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff 0%, #fffbeb 100%);
}

.player-card.viceCaptain {
  border-color: #c0c0c0;
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.player-position {
  font-size: 1.2rem;
}

.player-name {
  font-weight: bold;
  font-size: 0.85rem;
  color: #1f2937;
}

.player-team {
  font-size: 0.75rem;
  color: #6b7280;
}

.player-points {
  font-size: 0.8rem;
  color: #2d5a27;
  font-weight: 600;
}

.player-actions {
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  gap: 2px;
}

.captain-btn,
.vice-captain-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  font-size: 0.7rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.captain-btn {
  background: #ffd700;
  color: #1f2937;
}

.vice-captain-btn {
  background: #c0c0c0;
  color: #1f2937;
}

.availability-indicator {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.bench-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.bench-section h3 {
  color: #2d5a27;
  margin: 0 0 1rem 0;
}

.bench-players {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.bench-player {
  background: white;
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 100px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

@media (max-width: 768px) {
  .pitch {
    padding: 1rem;
  }

  .player-card {
    min-width: 100px;
    padding: 0.5rem;
  }

  .bench-players {
    justify-content: center;
  }
}
</style>
