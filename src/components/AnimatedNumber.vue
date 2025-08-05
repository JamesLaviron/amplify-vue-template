<template>
  <span>{{ displayValue }}{{ suffix }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    target: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
  }>(),
  {
    duration: 2000,
    suffix: '',
    prefix: '',
  }
);

const displayValue = ref(0);

const animateNumber = () => {
  const startTime = Date.now();
  const startValue = 0;
  const endValue = props.target;

  const animate = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / props.duration, 1);

    // Easing function for smooth animation
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOutCubic(progress);

    displayValue.value = Math.floor(startValue + (endValue - startValue) * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      displayValue.value = endValue;
    }
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  // Add a small delay before starting animation
  setTimeout(animateNumber, 500);
});

// Re-animate if target changes
watch(
  () => props.target,
  () => {
    displayValue.value = 0;
    animateNumber();
  }
);
</script>
