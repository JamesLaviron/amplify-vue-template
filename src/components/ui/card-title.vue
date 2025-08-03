<script setup lang="ts">
export interface CardTitleProps {
  class?: string;
}

const props = withDefaults(defineProps<CardTitleProps>(), {});
</script>

<template>
  <h3 :class="cn('text-2xl font-semibold leading-none tracking-tight', props.class)">
    <slot />
  </h3>
</template>

<script lang="ts">
import { cn } from '@/lib/utils';

export default {
  name: 'CardTitle',
};
</script>
