<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface Props {
  fantasyTeam: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['player-selected']);

const players = ref<any[]>([]);
const teams = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const positionFilter = ref('ALL');
const teamFilter = ref('ALL');
const sortBy = ref('totalPoints');
const sortOrder = ref('desc');

const positions = [
  { value: 'ALL', label: 'All Positions', icon: '⚽' },
  { value: 'GK', label: 'Goalkeepers', icon: '🥅' },
  { value: 'DEF', label: 'Defenders', icon: '🛡️' },
  { value: 'MID', label: 'Midfielders', icon: '⚽' },
  { value: 'FWD', label: 'Forwards', icon: '🎯' },
];

const sortOptions = [
  { value: 'totalPoints', label: 'Total Points' },
  { value: 'price', label: 'Price' },
  { value: 'form', label: 'Form' },
  { value: 'name', label: 'Name' },
];

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  try {
    // Load teams first
    const { data: teamsData } = await client.models.FootballTeam.list();
    teams.value = teamsData;

    // Load players with team data
    const { data: playersData } = await client.models.Player.list();

    // Enrich players with team information
    const playersWithTeams = playersData.map(player => {
      const team = teams.value.find(t => t.id === player.teamId);
      return { ...player, team };
    });

    players.value = playersWithTeams;
    loading.value = false;
  } catch (error) {
    console.error('Error loading players:', error);
    loading.value = false;
  }
};

const filteredAndSortedPlayers = computed(() => {
  let filtered = players.value;

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter(
      player =>
        player.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        player.team?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Apply position filter
  if (positionFilter.value !== 'ALL') {
    filtered = filtered.filter(player => player.position === positionFilter.value);
  }

  // Apply team filter
  if (teamFilter.value !== 'ALL') {
    filtered = filtered.filter(player => player.teamId === teamFilter.value);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = a[sortBy.value];
    let bValue = b[sortBy.value];

    if (sortBy.value === 'name') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
});

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

const getFormRating = (form: number) => {
  if (form >= 8) return { color: '#22c55e', label: 'Excellent' };
  if (form >= 6) return { color: '#84cc16', label: 'Good' };
  if (form >= 4) return { color: '#f59e0b', label: 'Average' };
  return { color: '#ef4444', label: 'Poor' };
};

const addPlayerToTeam = async (player: any) => {
  try {
    // Check if player is already in team
    const { data: existingSelections } = await client.models.FantasySelection.list({
      filter: {
        fantasyTeamId: { eq: props.fantasyTeam.id },
        playerId: { eq: player.id },
      },
    });

    if (existingSelections.length > 0) {
      alert('Player is already in your team!');
      return;
    }

    // Check team composition limits (simplified)
    const { data: currentSelections } = await client.models.FantasySelection.list({
      filter: { fantasyTeamId: { eq: props.fantasyTeam.id } },
    });

    if (currentSelections.length >= 15) {
      alert('Your team is full! (15 players maximum)');
      return;
    }

    // Check budget
    if (player.price > props.fantasyTeam.budget) {
      alert('Not enough budget to buy this player!');
      return;
    }

    // Add player to team
    await client.models.FantasySelection.create({
      fantasyTeamId: props.fantasyTeam.id,
      playerId: player.id,
      gameweekSelected: 1,
      isOnBench: currentSelections.length >= 11, // Put on bench if starting XI is full
    });

    // Update team budget
    await client.models.FantasyTeam.update({
      id: props.fantasyTeam.id,
      budget: props.fantasyTeam.budget - player.price,
    });

    emit('player-selected');
    alert(`${player.name} added to your team!`);
  } catch (error) {
    console.error('Error adding player:', error);
    alert('Failed to add player to team');
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  positionFilter.value = 'ALL';
  teamFilter.value = 'ALL';
  sortBy.value = 'totalPoints';
  sortOrder.value = 'desc';
};
</script>

<template>
  <div class="player-list">
    <div class="list-header">
      <h2>Player Database</h2>
      <p class="subtitle">Browse and add players to your fantasy team</p>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search players or teams..."
          class="search-input"
        />
      </div>

      <div class="filter-controls">
        <div class="filter-group">
          <label>Position:</label>
          <select v-model="positionFilter" class="filter-select">
            <option v-for="pos in positions" :key="pos.value" :value="pos.value">
              {{ pos.icon }} {{ pos.label }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Team:</label>
          <select v-model="teamFilter" class="filter-select">
            <option value="ALL">All Teams</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">
              {{ team.shortName }} - {{ team.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Sort by:</label>
          <select v-model="sortBy" class="filter-select">
            <option v-for="sort in sortOptions" :key="sort.value" :value="sort.value">
              {{ sort.label }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Order:</label>
          <select v-model="sortOrder" class="filter-select">
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
          </select>
        </div>

        <button class="reset-btn" @click="resetFilters">Reset</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner" />
      <p>Loading players...</p>
    </div>

    <!-- Player Cards -->
    <div v-else class="players-grid">
      <div v-for="player in filteredAndSortedPlayers" :key="player.id" class="player-card">
        <div class="player-header">
          <div class="player-position-badge">
            {{ getPositionIcon(player.position) }}
            <span>{{ player.position }}</span>
          </div>
          <div
            class="availability-indicator"
            :style="{ backgroundColor: getAvailabilityStatus(player.availability).color }"
            :title="getAvailabilityStatus(player.availability).text"
          />
        </div>

        <div class="player-info">
          <h3 class="player-name">{{ player.name }}</h3>
          <p class="player-team">{{ player.team?.shortName }} - {{ player.team?.name }}</p>
        </div>

        <div class="player-stats">
          <div class="stat-item">
            <span class="stat-label">Points</span>
            <span class="stat-value points">{{ player.totalPoints }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Price</span>
            <span class="stat-value price">£{{ player.price.toFixed(1) }}m</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Form</span>
            <span class="stat-value form" :style="{ color: getFormRating(player.form).color }">
              {{ player.form.toFixed(1) }}
            </span>
          </div>
        </div>

        <button
          class="add-player-btn"
          :disabled="player.availability !== 'AVAILABLE'"
          @click="addPlayerToTeam(player)"
        >
          <span v-if="player.availability === 'AVAILABLE'">Add to Team</span>
          <span v-else>{{ getAvailabilityStatus(player.availability).text }}</span>
        </button>
      </div>
    </div>

    <!-- No Results -->
    <div v-if="!loading && filteredAndSortedPlayers.length === 0" class="no-results">
      <h3>No players found</h3>
      <p>Try adjusting your search criteria or filters</p>
      <button class="reset-btn" @click="resetFilters">Reset Filters</button>
    </div>
  </div>
</template>

<style scoped>
.player-list {
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  text-align: center;
  margin-bottom: 2rem;
}

.list-header h2 {
  color: #2d5a27;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #6b7280;
  margin: 0;
}

.filters-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.search-box {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
}

.reset-btn {
  padding: 0.5rem 1rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: fit-content;
}

.reset-btn:hover {
  background: #4b5563;
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

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.player-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  position: relative;
}

.player-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.player-position-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.availability-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.player-info {
  margin-bottom: 1rem;
}

.player-name {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
  font-size: 1.125rem;
}

.player-team {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.player-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-weight: bold;
  font-size: 1rem;
}

.stat-value.points {
  color: #2d5a27;
}

.stat-value.price {
  color: #0f172a;
}

.add-player-btn {
  width: 100%;
  padding: 0.75rem;
  background: #2d5a27;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-player-btn:hover:not(:disabled) {
  background: #1f3e1a;
}

.add-player-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.no-results h3 {
  color: #374151;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .filter-controls {
    grid-template-columns: 1fr;
  }

  .players-grid {
    grid-template-columns: 1fr;
  }
}
</style>
