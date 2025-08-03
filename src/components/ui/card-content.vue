<script setup lang="ts">
export interface CardContentProps {
  class?: string;
}

const props = withDefaults(defineProps<CardContentProps>(), {});
</script>

<template>
  <div :class="cn('p-6 pt-0', props.class)">
    <slot />
  </div>
</template>

<script lang="ts">
import { cn } from '@/lib/utils';

export default {
  name: 'CardContent',
};
</script>
