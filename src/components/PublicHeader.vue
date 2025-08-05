<template>
  <header class="bg-background/80 backdrop-blur-md border-b border-border/20 sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo and Title -->
      <div class="flex items-center space-x-2">
        <button
          v-if="showBackButton"
          class="text-foreground hover:bg-background/20 p-2 rounded-md mr-2 cursor-pointer"
          @click="$emit('back')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <span class="text-2xl">⚽</span>
        <h1 class="font-bold text-xl text-foreground">Fantasy Football</h1>
      </div>

      <!-- Navigation Actions -->
      <div class="flex items-center space-x-2">
        <!-- Dark Mode Toggle -->
        <DarkModeToggle class="text-foreground hover:bg-background/20" />

        <!-- Auth Buttons (show when not on auth page) -->
        <div v-if="!hideAuthButtons" class="flex space-x-2">
          <Button
            variant="ghost"
            class="text-foreground hover:bg-background/20"
            @click="$emit('showAuth', 'signIn')"
          >
            Sign In
          </Button>
          <Button
            class="bg-primary text-primary-foreground hover:bg-primary/90"
            @click="$emit('showAuth', 'signUp')"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Button } from './ui';
import DarkModeToggle from './DarkModeToggle.vue';

defineProps<{
  showBackButton?: boolean;
  hideAuthButtons?: boolean;
}>();

defineEmits<{
  showAuth: [mode: 'signIn' | 'signUp'];
  back: [];
}>();
</script>
