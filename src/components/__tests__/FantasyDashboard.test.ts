import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FantasyDashboard from '../FantasyDashboard.vue';

// Mock AWS Amplify
const mockClient = {
  models: {
    UserProfile: {
      list: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'user1',
            username: 'testuser',
            email: 'test@example.com',
            totalPoints: 150,
            currentGameweek: 1,
          },
        ],
      }),
      create: vi.fn().mockResolvedValue({
        data: {
          id: 'user1',
          username: 'testuser',
          email: 'test@example.com',
        },
      }),
    },
    FantasyTeam: {
      list: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'team1',
            name: 'Test Team',
            formation: '4-4-2',
            budget: 85.5,
            ownerId: 'user1',
          },
        ],
      }),
      create: vi.fn().mockResolvedValue({
        data: {
          id: 'team1',
          name: "testuser's Team",
          formation: '4-4-2',
          budget: 100.0,
          ownerId: 'user1',
        },
      }),
    },
  },
};

vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => mockClient),
}));

// Mock child components
vi.mock('../FantasyTeamManager.vue', () => ({
  default: {
    name: 'FantasyTeamManager',
    template: '<div data-testid="fantasy-team-manager">Fantasy Team Manager</div>',
    props: ['fantasyTeam', 'userProfile'],
    emits: ['team-updated'],
  },
}));

vi.mock('../PlayerList.vue', () => ({
  default: {
    name: 'PlayerList',
    template: '<div data-testid="player-list">Player List</div>',
    props: ['fantasyTeam'],
    emits: ['player-selected'],
  },
}));

vi.mock('../LeagueStandings.vue', () => ({
  default: {
    name: 'LeagueStandings',
    template: '<div data-testid="league-standings">League Standings</div>',
    props: ['userProfile', 'fantasyTeam'],
  },
}));

vi.mock('../LiveScores.vue', () => ({
  default: {
    name: 'LiveScores',
    template: '<div data-testid="live-scores">Live Scores</div>',
  },
}));

describe('FantasyDashboard.vue', () => {
  const mockUser = {
    username: 'testuser',
    signInDetails: { loginId: 'test@example.com' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tab navigation', async () => {
    const wrapper = mount(FantasyDashboard, {
      props: { user: mockUser },
    });

    // Wait for loading to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const tabButtons = wrapper.findAll('button');
    expect(tabButtons[0].text()).toContain('My Team');
    expect(tabButtons[1].text()).toContain('Players');
    expect(tabButtons[2].text()).toContain('Leagues');
    expect(tabButtons[3].text()).toContain('Live Scores');
  });

  it('switches active tab when clicked', async () => {
    const wrapper = mount(FantasyDashboard, {
      props: { user: mockUser },
    });

    // Wait for loading to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const tabButtons = wrapper.findAll('button');
    // First button should have default variant (active state)

    await tabButtons[1].trigger('click');
    await wrapper.vm.$nextTick();
  });

  it('renders correct component based on active tab', async () => {
    const wrapper = mount(FantasyDashboard, {
      props: { user: mockUser },
    });

    // Wait for loading to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    // Default tab should show FantasyTeamManager
    expect(wrapper.find('[data-testid="fantasy-team-manager"]').exists()).toBe(true);

    // Switch to players tab
    const tabButtons = wrapper.findAll('button');
    await tabButtons[1].trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="player-list"]').exists()).toBe(true);

    // Switch to leagues tab
    await tabButtons[2].trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="league-standings"]').exists()).toBe(true);

    // Switch to scores tab
    await tabButtons[3].trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="live-scores"]').exists()).toBe(true);
  });

  it('shows loading state initially', () => {
    const wrapper = mount(FantasyDashboard, {
      props: { user: mockUser },
    });

    expect(wrapper.text()).toContain('Loading your fantasy team...');
  });
});
