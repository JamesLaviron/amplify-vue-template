<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { signInWithRedirect } from 'aws-amplify/auth';
import { Button, Card, CardHeader, CardTitle, CardContent, Alert } from './ui';

const emit = defineEmits<{
  signedIn: [user: any];
}>();

const loading = ref(false);
const error = ref('');

const handleGoogleSignIn = async () => {
  try {
    loading.value = true;
    error.value = '';

    await signInWithRedirect({
      provider: 'Google',
    });
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in with Google';
    loading.value = false;
  }
};

// Check if we're returning from OAuth redirect
onMounted(async () => {
  try {
    const { getCurrentUser } = await import('aws-amplify/auth');
    const user = await getCurrentUser();
    if (user) {
      emit('signedIn', user);
    }
  } catch {
    // Not signed in, continue normally
  }
});
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <Card class="w-full">
      <CardHeader class="space-y-1 text-center">
        <div class="text-4xl mb-4">⚽</div>
        <CardTitle class="text-2xl font-bold">Welcome to Fantasy Football</CardTitle>
        <p class="text-sm text-muted-foreground">Sign in with your Google account to get started</p>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- Error Alert -->
        <Alert v-if="error" variant="destructive" class="mb-4">
          <div class="font-medium">{{ error }}</div>
        </Alert>

        <!-- Google Sign In Button -->
        <Button class="w-full" :disabled="loading" @click="handleGoogleSignIn">
          <div
            v-if="loading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
          />
          <svg v-else class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {{ loading ? 'Signing in...' : 'Continue with Google' }}
        </Button>

        <!-- Additional Info -->
        <div class="text-center pt-4 border-t">
          <p class="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
