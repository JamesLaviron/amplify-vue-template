<script setup lang="ts">
export interface CardProps {
  class?: string;
}

const props = withDefaults(defineProps<CardProps>(), {});
</script>

<template>
  <div :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', props.class)">
    <slot />
  </div>
</template>

<script lang="ts">
import { cn } from '@/lib/utils';

export default {
  name: 'Card',
};
</script>
