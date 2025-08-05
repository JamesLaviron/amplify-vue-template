/**
 * Test setup file - runs before all tests
 * Configures mocks and global test utilities
 */

import { vi } from 'vitest';

// Mock API-Football service to always use mock implementation in tests
vi.mock('./services/apiFootball', async () => {
  const mockModule = await vi.importActual('./services/__mocks__/apiFootball');
  return mockModule;
});

// Mock AWS Amplify to prevent real API calls during tests
vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: vi.fn(),
  },
  generateClient: vi.fn(() => ({
    models: {},
    queries: {},
    mutations: {},
    subscriptions: {},
  })),
  getCurrentUser: vi.fn(() => Promise.resolve({ username: 'testuser' })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
}));

// Mock environment variables for tests
process.env.API_FOOTBALL_KEY = 'test-api-key';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
