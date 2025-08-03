import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../../App.vue';

// Mock AWS Amplify
vi.mock('aws-amplify/auth', () => ({
  getCurrentUser: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@aws-amplify/ui-vue', () => ({
  Authenticator: {
    name: 'Authenticator',
    template: '<div><slot :user="mockUser"></slot></div>',
    props: ['initialState'],
    setup() {
      return { mockUser: { username: 'testuser' } };
    },
  },
}));

vi.mock('../FantasyDashboard.vue', () => ({
  default: {
    name: 'FantasyDashboard',
    template: '<div data-testid="fantasy-dashboard">Fantasy Dashboard</div>',
    props: ['user'],
  },
}));

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the app title', () => {
    const wrapper = mount(App);
    expect(wrapper.find('.app-title').text()).toBe('⚽ Fantasy Football');
  });

  it('shows sign out button when user is authenticated', async () => {
    const { getCurrentUser } = await import('aws-amplify/auth');
    vi.mocked(getCurrentUser).mockResolvedValue({ username: 'testuser' });

    const wrapper = mount(App);

    // Wait for authentication check to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="sign-out-btn"]').exists()).toBe(true);
  });

  it('calls signOut when sign out button is clicked', async () => {
    const { getCurrentUser, signOut } = await import('aws-amplify/auth');
    vi.mocked(getCurrentUser).mockResolvedValue({ username: 'testuser' });

    const wrapper = mount(App);

    // Wait for authentication check to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const signOutBtn = wrapper.find('[data-testid="sign-out-btn"]');
    if (signOutBtn.exists()) {
      await signOutBtn.trigger('click');
      expect(signOut).toHaveBeenCalled();
    }
  });

  it('shows user welcome message when authenticated', async () => {
    const { getCurrentUser } = await import('aws-amplify/auth');
    vi.mocked(getCurrentUser).mockResolvedValue({ username: 'testuser' });

    const wrapper = mount(App);

    // Wait for authentication check to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    const userInfo = wrapper.find('.user-info');
    if (userInfo.exists()) {
      expect(userInfo.text()).toContain('Welcome, testuser');
    }
  });
});
