<template>
  <button
    @click="$emit('click')"
    :class="[
      'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 cursor-pointer',
      active 
        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
    ]"
  >
    <span class="text-lg">{{ icon }}</span>
    <span class="text-sm">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  active?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>