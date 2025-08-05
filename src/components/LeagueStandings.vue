<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

interface Props {
  userProfile: any;
  fantasyTeam: any;
}

const props = defineProps<Props>();

const userLeagues = ref<any[]>([]);
const publicLeagues = ref<any[]>([]);
const loading = ref(true);
const showCreateForm = ref(false);
const showJoinForm = ref(false);
const newLeagueName = ref('');
const joinCode = ref('');

onMounted(async () => {
  await loadLeagues();
});

const loadLeagues = async () => {
  try {
    // Load user's league memberships
    const { data: memberships } = await client.models.LeagueMembership.list({
      filter: { userId: { eq: props.userProfile.id } },
    });

    // Load league details for each membership
    const leaguesWithDetails = await Promise.all(
      memberships.map(async membership => {
        const { data: league } = await client.models.League.get({ id: membership.leagueId });

        if (!league) return null;

        // Get all members of this league
        const { data: allMembers } = await client.models.LeagueMembership.list({
          filter: { leagueId: { eq: league.id } },
        });

        // Load user and team details for each member
        const membersWithDetails = await Promise.all(
          allMembers.map(async member => {
            const { data: user } = await client.models.UserProfile.get({ id: member.userId });
            const { data: team } = await client.models.FantasyTeam.get({
              id: member.fantasyTeamId,
            });
            return { ...member, user, team };
          })
        );

        // Sort by total points (descending)
        membersWithDetails.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

        // Update ranks
        membersWithDetails.forEach((member, index) => {
          member.rank = index + 1;
        });

        return { ...league, members: membersWithDetails };
      })
    );

    userLeagues.value = leaguesWithDetails.filter(league => league !== null);

    // Load public leagues (sample)
    const { data: allLeagues } = await client.models.League.list({
      filter: { isPublic: { eq: true } },
    });

    publicLeagues.value = allLeagues.slice(0, 5); // Show top 5 public leagues

    loading.value = false;
  } catch (error) {
    console.error('Error loading leagues:', error);
    loading.value = false;
  }
};

const createLeague = async () => {
  if (!newLeagueName.value.trim()) return;

  try {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data: newLeague } = await client.models.League.create({
      name: newLeagueName.value,
      code,
      creatorId: props.userProfile.id,
      isPublic: false,
    });

    if (!newLeague) throw new Error('Failed to create league');

    // Join the league as creator
    await client.models.LeagueMembership.create({
      leagueId: newLeague.id,
      userId: props.userProfile.id,
      fantasyTeamId: props.fantasyTeam.id,
      joinedAt: new Date().toISOString(),
      totalPoints: props.userProfile.totalPoints || 0,
    });

    newLeagueName.value = '';
    showCreateForm.value = false;
    await loadLeagues();
    alert(`League created! Share code: ${code}`);
  } catch (error) {
    console.error('Error creating league:', error);
    alert('Failed to create league');
  }
};

const joinLeague = async () => {
  if (!joinCode.value.trim()) return;

  try {
    // Find league by code
    const { data: leagues } = await client.models.League.list({
      filter: { code: { eq: joinCode.value.toUpperCase() } },
    });

    if (leagues.length === 0) {
      alert('League not found! Please check the code.');
      return;
    }

    const league = leagues[0];

    // Check if already a member
    const { data: existingMembership } = await client.models.LeagueMembership.list({
      filter: {
        leagueId: { eq: league.id },
        userId: { eq: props.userProfile.id },
      },
    });

    if (existingMembership.length > 0) {
      alert('You are already a member of this league!');
      return;
    }

    // Check league capacity
    const { data: currentMembers } = await client.models.LeagueMembership.list({
      filter: { leagueId: { eq: league.id } },
    });

    if (currentMembers.length >= (league.maxParticipants || 20)) {
      alert('League is full!');
      return;
    }

    // Join the league
    await client.models.LeagueMembership.create({
      leagueId: league.id,
      userId: props.userProfile.id,
      fantasyTeamId: props.fantasyTeam.id,
      joinedAt: new Date().toISOString(),
      totalPoints: props.userProfile.totalPoints || 0,
    });

    // Update league participant count
    await client.models.League.update({
      id: league.id,
      currentParticipants: currentMembers.length + 1,
    });

    joinCode.value = '';
    showJoinForm.value = false;
    await loadLeagues();
    alert(`Successfully joined ${league.name}!`);
  } catch (error) {
    console.error('Error joining league:', error);
    alert('Failed to join league');
  }
};

const leaveLeague = async (leagueId: string) => {
  if (!confirm('Are you sure you want to leave this league?')) return;

  try {
    // Find membership
    const { data: memberships } = await client.models.LeagueMembership.list({
      filter: {
        leagueId: { eq: leagueId },
        userId: { eq: props.userProfile.id },
      },
    });

    if (memberships.length > 0) {
      await client.models.LeagueMembership.delete({ id: memberships[0].id });

      // Update league participant count
      const { data: league } = await client.models.League.get({ id: leagueId });
      if (league) {
        await client.models.League.update({
          id: leagueId,
          currentParticipants: Math.max(0, (league.currentParticipants || 1) - 1),
        });
      }

      await loadLeagues();
      alert('Left league successfully');
    }
  } catch (error) {
    console.error('Error leaving league:', error);
    alert('Failed to leave league');
  }
};

const getRankBadge = (rank: number) => {
  if (rank === 1) return { icon: '🥇', class: 'gold' };
  if (rank === 2) return { icon: '🥈', class: 'silver' };
  if (rank === 3) return { icon: '🥉', class: 'bronze' };
  return { icon: rank.toString(), class: 'default' };
};
</script>

<template>
  <div class="league-standings">
    <div class="standings-header">
      <h2>My Leagues</h2>
      <div class="action-buttons">
        <button class="action-btn create-btn" @click="showCreateForm = true">
          ➕ Create League
        </button>
        <button class="action-btn join-btn" @click="showJoinForm = true">🎯 Join League</button>
      </div>
    </div>

    <!-- Create League Form -->
    <div v-if="showCreateForm" class="modal-overlay">
      <div class="modal">
        <h3>Create New League</h3>
        <input
          v-model="newLeagueName"
          type="text"
          placeholder="League name..."
          class="form-input"
          @keyup.enter="createLeague"
        />
        <div class="modal-actions">
          <button class="btn primary" @click="createLeague">Create</button>
          <button class="btn secondary" @click="showCreateForm = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Join League Form -->
    <div v-if="showJoinForm" class="modal-overlay">
      <div class="modal">
        <h3>Join League</h3>
        <input
          v-model="joinCode"
          type="text"
          placeholder="Enter league code..."
          class="form-input"
          @keyup.enter="joinLeague"
        />
        <div class="modal-actions">
          <button class="btn primary" @click="joinLeague">Join</button>
          <button class="btn secondary" @click="showJoinForm = false">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner" />
      <p>Loading leagues...</p>
    </div>

    <div v-else class="leagues-content">
      <!-- User's Leagues -->
      <div v-if="userLeagues.length > 0" class="leagues-section">
        <div v-for="league in userLeagues" :key="league.id" class="league-card">
          <div class="league-header">
            <div class="league-info">
              <h3>{{ league.name }}</h3>
              <p class="league-code">Code: {{ league.code }}</p>
              <p class="league-stats">
                {{ league.currentParticipants }}/{{ league.maxParticipants }} members
              </p>
            </div>
            <button class="leave-btn" title="Leave League" @click="leaveLeague(league.id)">
              ❌
            </button>
          </div>

          <div class="standings-table">
            <div class="table-header">
              <span class="rank-col">Rank</span>
              <span class="name-col">Manager</span>
              <span class="team-col">Team</span>
              <span class="points-col">Points</span>
            </div>

            <div
              v-for="member in league.members"
              :key="member.id"
              class="table-row"
              :class="{ 'current-user': member.userId === userProfile.id }"
            >
              <span class="rank-col">
                <span :class="['rank-badge', getRankBadge(member.rank).class]">
                  {{ getRankBadge(member.rank).icon }}
                </span>
              </span>
              <span class="name-col">{{ member.user?.username }}</span>
              <span class="team-col">{{ member.team?.name }}</span>
              <span class="points-col">{{ member.totalPoints }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Leagues Message -->
      <div v-if="userLeagues.length === 0" class="no-leagues">
        <h3>You haven't joined any leagues yet</h3>
        <p>Create your own league or join existing ones to compete with friends!</p>
        <div class="cta-buttons">
          <button class="btn primary" @click="showCreateForm = true">Create League</button>
          <button class="btn secondary" @click="showJoinForm = true">Join League</button>
        </div>
      </div>

      <!-- Public Leagues -->
      <div v-if="publicLeagues.length > 0" class="public-leagues-section">
        <h3>Public Leagues</h3>
        <div class="public-leagues-grid">
          <div v-for="league in publicLeagues" :key="league.id" class="public-league-card">
            <h4>{{ league.name }}</h4>
            <p>{{ league.currentParticipants }}/{{ league.maxParticipants }} members</p>
            <button class="btn secondary small">Join</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.league-standings {
  max-width: 900px;
  margin: 0 auto;
}

.standings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.standings-header h2 {
  color: #2d5a27;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.create-btn {
  background: #2d5a27;
  color: white;
}

.create-btn:hover {
  background: #1f3e1a;
}

.join-btn {
  background: #3b82f6;
  color: white;
}

.join-btn:hover {
  background: #2563eb;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 400px;
  max-width: 90vw;
}

.modal h3 {
  margin: 0 0 1rem 0;
  color: #2d5a27;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn.primary {
  background: #2d5a27;
  color: white;
}

.btn.secondary {
  background: #6b7280;
  color: white;
}

.btn.small {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
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

.leagues-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.league-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.league-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.league-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2d5a27;
}

.league-code {
  font-family: monospace;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
}

.league-stats {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.leave-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.leave-btn:hover {
  opacity: 1;
  background: #fee2e2;
}

.standings-table {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 80px;
  background: #f9fafb;
  padding: 0.75rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 80px;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row.current-user {
  background: #ecfdf5;
  font-weight: 600;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.875rem;
}

.rank-badge.gold {
  background: #fef3c7;
  color: #92400e;
}

.rank-badge.silver {
  background: #f3f4f6;
  color: #374151;
}

.rank-badge.bronze {
  background: #fed7aa;
  color: #9a3412;
}

.rank-badge.default {
  background: #e5e7eb;
  color: #6b7280;
}

.points-col {
  text-align: right;
  font-weight: 600;
  color: #2d5a27;
}

.no-leagues {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.no-leagues h3 {
  color: #374151;
  margin-bottom: 0.5rem;
}

.cta-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.public-leagues-section {
  margin-top: 2rem;
}

.public-leagues-section h3 {
  color: #2d5a27;
  margin-bottom: 1rem;
}

.public-leagues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.public-league-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
}

.public-league-card h4 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.public-league-card p {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .standings-header {
    flex-direction: column;
    align-items: stretch;
  }

  .table-header,
  .table-row {
    grid-template-columns: 50px 1fr 60px;
  }

  .team-col {
    display: none;
  }

  .modal {
    min-width: auto;
    margin: 1rem;
  }
}
</style>
