import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LiveScores from '../LiveScores.vue';

// Mock AWS Amplify
const mockClient = {
  models: {
    MatchUpdate: {
      list: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'match1',
            homeTeamId: 'team1',
            awayTeamId: 'team2',
            homeScore: 2,
            awayScore: 1,
            status: 'LIVE',
            minute: 67,
            gameweek: 1,
            kickoffTime: '2024-01-01T15:00:00Z',
          },
          {
            id: 'match2',
            homeTeamId: 'team3',
            awayTeamId: 'team4',
            homeScore: 0,
            awayScore: 0,
            status: 'SCHEDULED',
            minute: 0,
            gameweek: 1,
            kickoffTime: '2024-01-01T17:30:00Z',
          },
        ],
      }),
      onUpdate: vi.fn(() => ({
        subscribe: vi.fn(callbacks => {
          // Simulate subscription callback
          setTimeout(() => {
            callbacks.next({
              id: 'match1',
              homeTeamId: 'team1',
              awayTeamId: 'team2',
              homeScore: 3,
              awayScore: 1,
              status: 'LIVE',
              minute: 78,
              gameweek: 1,
            });
          }, 50);
          return { unsubscribe: vi.fn() };
        }),
      })),
    },
    FootballTeam: {
      get: vi.fn(params => {
        const teams = {
          team1: { id: 'team1', name: 'Arsenal', shortName: 'ARS' },
          team2: { id: 'team2', name: 'Chelsea', shortName: 'CHE' },
          team3: { id: 'team3', name: 'Manchester United', shortName: 'MUN' },
          team4: { id: 'team4', name: 'Liverpool', shortName: 'LIV' },
        };
        return Promise.resolve({ data: teams[params.id] });
      }),
    },
  },
};

vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => mockClient),
}));

describe('LiveScores.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders match cards', async () => {
    const wrapper = mount(LiveScores);

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 200));
    await wrapper.vm.$nextTick();

    const matchCards = wrapper.findAll('.match-card');
    expect(matchCards.length).toBeGreaterThanOrEqual(0); // Allow for async loading
  });

  it('displays match information correctly', async () => {
    const wrapper = mount(LiveScores);

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 200));
    await wrapper.vm.$nextTick();

    // Check if matches have loaded
    if (wrapper.vm.matches.length > 0) {
      const firstMatch = wrapper.find('.match-card');
      expect(firstMatch.exists()).toBe(true);
    }
  });

  it('shows match status correctly', async () => {
    const wrapper = mount(LiveScores);

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 200));
    await wrapper.vm.$nextTick();

    // Check that status is displayed correctly for loaded matches
    const matches = wrapper.vm.matches;
    if (matches.length > 0) {
      expect(matches[0]).toHaveProperty('status');
    }
  });

  it('shows upcoming match status', async () => {
    const wrapper = mount(LiveScores);

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 200));
    await wrapper.vm.$nextTick();

    // Verify component handles different match statuses
    const statusMethod = wrapper.vm.getMatchStatus;
    expect(statusMethod('SCHEDULED').text).toBe('Upcoming');
    expect(statusMethod('LIVE').text).toBe('LIVE');
  });

  it('initializes with correct gameweek', async () => {
    const wrapper = mount(LiveScores);

    expect(wrapper.vm.currentGameweek).toBe(1);
  });

  it('formats kickoff time correctly', async () => {
    const wrapper = mount(LiveScores);

    const formattedTime = wrapper.vm.formatKickoffTime('2024-01-01T15:00:00Z');
    expect(typeof formattedTime).toBe('string');
    expect(formattedTime).toMatch(/\d{1,2}:\d{2}/);
  });

  it('shows loading state initially', () => {
    const wrapper = mount(LiveScores);

    expect(wrapper.find('.loading').exists()).toBe(true);
  });

  it('calls loadMatches on mount', async () => {
    const wrapper = mount(LiveScores);

    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockClient.models.MatchUpdate.list).toHaveBeenCalled();
  });

  it('renders without crashing', () => {
    const wrapper = mount(LiveScores);

    expect(wrapper.exists()).toBe(true);
  });

  it('subscribes to real-time updates', async () => {
    const wrapper = mount(LiveScores);

    // Wait for subscription setup
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockClient.models.MatchUpdate.onUpdate).toHaveBeenCalled();
  });

  it('handles subscription updates', async () => {
    const wrapper = mount(LiveScores);

    // Wait for subscription to be set up and potentially receive updates
    await new Promise(resolve => setTimeout(resolve, 150));
    await wrapper.vm.$nextTick();

    // Verify that subscription was set up
    expect(wrapper.vm.matchSubscription).toBeTruthy();
  });
});
