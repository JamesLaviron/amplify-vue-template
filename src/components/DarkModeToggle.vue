<template>
  <Button
    :variant="variant"
    :size="size"
    :class="`transition-all duration-200 ${buttonClass}`"
    :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleDarkMode"
  >
    <!-- Sun Icon (Light Mode) -->
    <svg
      v-if="!isDarkMode"
      class="w-4 h-4 sm:w-5 sm:h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="5" />
      <path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      />
    </svg>

    <!-- Moon Icon (Dark Mode) -->
    <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>

    <span v-if="showLabel" class="ml-2 text-sm">
      {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
    </span>
  </Button>
</template>

<script setup lang="ts">
import { Button } from './ui';
import { useDarkMode } from '../composables/useDarkMode';

withDefaults(
  defineProps<{
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    showLabel?: boolean;
    buttonClass?: string;
  }>(),
  {
    variant: 'ghost',
    size: 'icon',
    showLabel: false,
    buttonClass: '',
  }
);

const { isDarkMode, toggleDarkMode } = useDarkMode();
</script>
