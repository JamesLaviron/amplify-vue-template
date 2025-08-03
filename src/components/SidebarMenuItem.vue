<template>
  <button
    :class="[
      'w-full flex items-center rounded-md text-left transition-colors duration-200 cursor-pointer text-sm font-medium',
      collapsed ? 'justify-center px-3 py-2' : 'space-x-3 px-3 py-2',
      active
        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    ]"
    :title="collapsed ? label : undefined"
    @click="$emit('click')"
  >
    <span class="text-base">{{ icon }}</span>
    <span v-if="!collapsed" class="text-sm transition-opacity duration-300">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>
