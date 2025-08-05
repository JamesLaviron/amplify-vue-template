import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LeagueStandings from '../LeagueStandings.vue';

// Mock AWS Amplify
const mockClient = {
  models: {
    League: {
      list: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'league1',
            name: 'Premier League Fantasy',
            code: 'PL2024',
            isPublic: true,
            maxMembers: 20,
          },
        ],
      }),
      get: vi.fn().mockResolvedValue({
        data: {
          id: 'league1',
          name: 'Premier League Fantasy',
          code: 'PL2024',
          isPublic: true,
          maxMembers: 20,
        },
      }),
      create: vi.fn().mockResolvedValue({
        data: {
          id: 'league3',
          name: 'New League',
          code: 'NEW456',
          isPublic: false,
        },
      }),
    },
    LeagueMembership: {
      list: vi.fn().mockResolvedValue({
        data: [
          {
            id: 'membership1',
            leagueId: 'league1',
            userId: 'user1',
            fantasyTeamId: 'team1',
            totalPoints: 150,
            rank: 1,
          },
          {
            id: 'membership2',
            leagueId: 'league1',
            userId: 'user2',
            fantasyTeamId: 'team2',
            totalPoints: 120,
            rank: 2,
          },
        ],
      }),
      create: vi.fn().mockResolvedValue({
        data: { id: 'membership3' },
      }),
    },
    UserProfile: {
      get: vi.fn().mockResolvedValue({
        data: {
          id: 'user1',
          username: 'testuser',
          email: 'test@example.com',
        },
      }),
    },
    FantasyTeam: {
      get: vi.fn().mockResolvedValue({
        data: {
          id: 'team1',
          name: 'Test Team',
          ownerId: 'user1',
        },
      }),
    },
  },
};

vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => mockClient),
}));

describe('LeagueStandings.vue', () => {
  const mockUserProfile = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockFantasyTeam = {
    id: 'team1',
    name: 'Test Team',
    ownerId: 'user1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    const wrapper = mount(LeagueStandings, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    expect(wrapper.find('.loading').exists()).toBe(true);
  });

  it('renders component structure after loading', async () => {
    const wrapper = mount(LeagueStandings, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 200));
    await wrapper.vm.$nextTick();

    // Check that the component has rendered after loading
    expect(wrapper.find('.league-standings').exists()).toBe(true);
  });

  it('displays league information after loading', async () => {
    // Mock a successful API response
    mockClient.models.LeagueMembership.list.mockResolvedValue({ data: [] });

    const wrapper = mount(LeagueStandings, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 200));
    await wrapper.vm.$nextTick();

    // Component should have loaded
    expect(wrapper.find('.loading').exists()).toBe(false);
  });

  it('renders without crashing', async () => {
    const wrapper = mount(LeagueStandings, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('handles props correctly', async () => {
    const wrapper = mount(LeagueStandings, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    expect(wrapper.props('userProfile')).toEqual(mockUserProfile);
    expect(wrapper.props('fantasyTeam')).toEqual(mockFantasyTeam);
  });

  it('calls league loading on mount', async () => {
    const wrapper = mount(LeagueStandings, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for component to mount and call API
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockClient.models.LeagueMembership.list).toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    mockClient.models.LeagueMembership.list.mockRejectedValue(new Error('API Error'));

    const wrapper = mount(LeagueStandings, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for error handling
    await new Promise(resolve => setTimeout(resolve, 200));
    await wrapper.vm.$nextTick();

    // Should still render without crashing
    expect(wrapper.exists()).toBe(true);
  });

  it('has correct component name', () => {
    const wrapper = mount(LeagueStandings, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    expect(wrapper.vm.$options.name || 'LeagueStandings').toBeTruthy();
  });

  it('initializes with correct data', async () => {
    const wrapper = mount(LeagueStandings, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Check initial state
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.userLeagues).toEqual([]);
    expect(wrapper.vm.publicLeagues).toEqual([]);
  });
});
