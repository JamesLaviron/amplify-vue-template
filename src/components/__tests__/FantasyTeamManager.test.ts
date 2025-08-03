import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FantasyTeamManager from '../FantasyTeamManager.vue';

// Mock AWS Amplify
const mockClient = {
  models: {
    FantasyTeam: {
      create: vi.fn().mockResolvedValue({ data: { id: 'team1' } }),
      update: vi.fn().mockResolvedValue({ data: { id: 'team1' } }),
      delete: vi.fn().mockResolvedValue({ data: { id: 'team1' } }),
    },
    FantasySelection: {
      list: vi.fn().mockResolvedValue({ data: [] }),
      create: vi.fn().mockResolvedValue({ data: { id: 'selection1' } }),
      delete: vi.fn().mockResolvedValue({ data: { id: 'selection1' } }),
      update: vi.fn().mockResolvedValue({ data: { id: 'selection1' } }),
    },
    Player: {
      get: vi.fn().mockResolvedValue({
        data: {
          id: 'player1',
          name: 'Test Player',
          position: 'FWD',
          teamId: 'team1',
          price: 10.0,
          totalPoints: 150,
          form: 8.5,
          availability: 'AVAILABLE',
        },
      }),
    },
    FootballTeam: {
      get: vi.fn().mockResolvedValue({
        data: {
          id: 'team1',
          name: 'Arsenal',
          shortName: 'ARS',
        },
      }),
    },
  },
};

vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => mockClient),
}));

describe('FantasyTeamManager.vue', () => {
  const mockUserProfile = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockFantasyTeam = {
    id: 'team1',
    name: 'Test Team',
    formation: '4-4-2',
    budget: 1000,
    userProfileId: 'user1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders team header and formation selector when team exists', async () => {
    const wrapper = mount(FantasyTeamManager, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for component to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.team-header').exists()).toBe(true);
    expect(wrapper.find('.formation-selector').exists()).toBe(true);
  });

  it('renders team management when team exists', async () => {
    const wrapper = mount(FantasyTeamManager, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for component to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.team-header').exists()).toBe(true);
    expect(wrapper.find('.pitch').exists()).toBe(true);
    expect(wrapper.find('.formation-display').exists()).toBe(true);
  });

  it('shows team name and formation', async () => {
    const wrapper = mount(FantasyTeamManager, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for component to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.team-header h2').text()).toContain('Test Team');
    expect(wrapper.find('.formation-selector select').element.value).toBe('4-4-2');
  });

  it('displays formation selector with options', async () => {
    const wrapper = mount(FantasyTeamManager, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for component to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const formationSelect = wrapper.find('.formation-selector select');
    const options = formationSelect.findAll('option');

    expect(options.length).toBeGreaterThan(0);
    expect(options[0].text()).toBe('4-4-2');
  });

  it('updates formation when changed', async () => {
    const wrapper = mount(FantasyTeamManager, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for component to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const formationSelect = wrapper.find('.formation-selector select');
    await formationSelect.setValue('4-3-3');
    await formationSelect.trigger('change');

    expect(mockClient.models.FantasyTeam.update).toHaveBeenCalledWith({
      id: 'team1',
      formation: '4-3-3',
    });
  });

  it('shows formation positions correctly', async () => {
    const wrapper = mount(FantasyTeamManager, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    // Wait for component to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    // Should show position lines for different positions
    expect(wrapper.find('.position-line.goalkeepers').exists()).toBe(true);
    expect(wrapper.find('.position-line.defenders').exists()).toBe(true);
    expect(wrapper.find('.position-line.midfielders').exists()).toBe(true);
    expect(wrapper.find('.position-line.forwards').exists()).toBe(true);
  });

  it('shows loading state initially', () => {
    const wrapper = mount(FantasyTeamManager, {
      props: {
        userProfile: mockUserProfile,
        fantasyTeam: mockFantasyTeam,
      },
    });

    expect(wrapper.find('.loading').exists()).toBe(true);
  });
});
