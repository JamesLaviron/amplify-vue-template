import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PlayerList from '../PlayerList.vue';

// Mock AWS Amplify
const mockClient = {
  models: {
    FootballTeam: {
      list: vi.fn().mockResolvedValue({
        data: [
          { id: '1', name: 'Arsenal', shortName: 'ARS' },
          { id: '2', name: 'Chelsea', shortName: 'CHE' },
        ],
      }),
    },
    Player: {
      list: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            name: 'Player One',
            position: 'FWD',
            teamId: '1',
            price: 10.0,
            totalPoints: 150,
            form: 8.5,
            availability: 'AVAILABLE',
          },
          {
            id: '2',
            name: 'Player Two',
            position: 'MID',
            teamId: '2',
            price: 8.0,
            totalPoints: 120,
            form: 7.0,
            availability: 'AVAILABLE',
          },
        ],
      }),
    },
    FantasySelection: {
      list: vi.fn().mockResolvedValue({ data: [] }),
      create: vi.fn().mockResolvedValue({ data: { id: 'selection1' } }),
    },
    FantasyTeam: {
      update: vi.fn().mockResolvedValue({ data: { id: 'team1' } }),
    },
  },
};

vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => mockClient),
}));

describe('PlayerList.vue', () => {
  const mockFantasyTeam = {
    id: 'team1',
    selections: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders position filter dropdown', async () => {
    const wrapper = mount(PlayerList, {
      props: { fantasyTeam: mockFantasyTeam },
    });

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const positionSelect = wrapper.findAll('.filter-select')[0];
    const options = positionSelect.findAll('option');

    expect(options[0].text()).toContain('All Positions');
    expect(options[1].text()).toContain('Goalkeepers');
    expect(options[2].text()).toContain('Defenders');
    expect(options[3].text()).toContain('Midfielders');
    expect(options[4].text()).toContain('Forwards');
  });

  it('renders search input', () => {
    const wrapper = mount(PlayerList, {
      props: { fantasyTeam: mockFantasyTeam },
    });

    expect(wrapper.find('.search-input').exists()).toBe(true);
    expect(wrapper.find('.search-input').attributes('placeholder')).toBe(
      'Search players or teams...'
    );
  });

  it('filters players by search query', async () => {
    const wrapper = mount(PlayerList, {
      props: { fantasyTeam: mockFantasyTeam },
    });

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find('.search-input');
    await searchInput.setValue('Player One');

    await wrapper.vm.$nextTick();

    const playerCards = wrapper.findAll('.player-card');
    expect(playerCards).toHaveLength(1);
    expect(playerCards[0].text()).toContain('Player One');
  });

  it('filters players by position', async () => {
    const wrapper = mount(PlayerList, {
      props: { fantasyTeam: mockFantasyTeam },
    });

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const positionSelect = wrapper.findAll('.filter-select')[0];
    await positionSelect.setValue('FWD');
    await wrapper.vm.$nextTick();

    const playerCards = wrapper.findAll('.player-card');
    expect(playerCards).toHaveLength(1);
    expect(playerCards[0].text()).toContain('Player One');
  });

  it('sorts players correctly', async () => {
    const wrapper = mount(PlayerList, {
      props: { fantasyTeam: mockFantasyTeam },
    });

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const sortSelect = wrapper.findAll('.filter-select')[2]; // Sort by select is the 3rd filter
    await sortSelect.setValue('price');
    await wrapper.vm.$nextTick();

    const playerCards = wrapper.findAll('.player-card');
    // Player One (price: 10.0) should come before Player Two (price: 8.0) when sorted by price desc
    expect(playerCards[0].text()).toContain('Player One');
    expect(playerCards[1].text()).toContain('Player Two');
  });

  it('emits player-selected event when add button is clicked', async () => {
    // Mock alert to avoid test issues
    vi.stubGlobal('alert', vi.fn());

    const wrapper = mount(PlayerList, {
      props: { fantasyTeam: mockFantasyTeam },
    });

    // Wait for data to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const addButton = wrapper.find('.add-player-btn');
    await addButton.trigger('click');

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.emitted('player-selected')).toBeTruthy();
  });

  it('shows loading state initially', () => {
    const wrapper = mount(PlayerList, {
      props: { fantasyTeam: mockFantasyTeam },
    });

    expect(wrapper.find('.loading').exists()).toBe(true);
  });
});
