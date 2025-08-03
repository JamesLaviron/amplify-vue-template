<template>
  <footer class="bg-muted/30 border-t border-border mt-auto">
    <div class="container mx-auto px-4 py-6 sm:py-8">
      <!-- Mobile: Single column, Desktop: 3 columns -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <!-- Logo and Description -->
        <div class="sm:col-span-2 lg:col-span-1 text-center lg:text-left">
          <div class="flex items-center justify-center lg:justify-start space-x-2 mb-3">
            <span class="text-2xl">⚽</span>
            <h3 class="font-bold text-lg">Fantasy Football</h3>
          </div>
          <p class="text-sm text-muted-foreground max-w-xs mx-auto lg:mx-0">
            The ultimate fantasy football experience. Build your dream team, compete with friends,
            and track your progress in real-time.
          </p>
        </div>

        <!-- Support -->
        <div class="text-center lg:text-left">
          <h4 class="font-semibold mb-3 sm:mb-4">Support</h4>
          <ul class="space-y-1.5 sm:space-y-2 text-sm">
            <li>
              <a
                class="text-muted-foreground hover:text-foreground transition-colors block py-0.5 cursor-pointer"
                @click="$emit('showHelp')"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-muted-foreground hover:text-foreground transition-colors block py-0.5 cursor-pointer"
              >
                Rules & Scoring
              </a>
            </li>
            <li>
              <a
                class="text-muted-foreground hover:text-foreground transition-colors block py-0.5 cursor-pointer"
                @click="$emit('showContact')"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-muted-foreground hover:text-foreground transition-colors block py-0.5 cursor-pointer"
              >
                Bug Reports
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="text-center lg:text-left">
          <h4 class="font-semibold mb-3 sm:mb-4">Legal</h4>
          <ul class="space-y-1.5 sm:space-y-2 text-sm">
            <li>
              <a
                href="#"
                class="text-muted-foreground hover:text-foreground transition-colors block py-0.5 cursor-pointer"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-muted-foreground hover:text-foreground transition-colors block py-0.5 cursor-pointer"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-muted-foreground hover:text-foreground transition-colors block py-0.5 cursor-pointer"
              >
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-border mt-6 sm:mt-8 pt-4 sm:pt-6">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div class="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © {{ currentYear }} Fantasy Football. All rights reserved.
          </div>

          <!-- Social Links -->
          <div class="flex justify-center space-x-4">
            <a
              href="#"
              class="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
              aria-label="Twitter"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
              aria-label="Facebook"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
              aria-label="Instagram"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.342-1.297-.894-.808-1.297-1.781-1.297-2.918V9.245c0-1.137.403-2.11 1.297-2.918.894-.807 2.045-1.297 3.342-1.297h7.098c1.297 0 2.448.49 3.342 1.297.894.808 1.297 1.781 1.297 2.918v3.528c0 1.137-.403 2.11-1.297 2.918-.894.807-2.045 1.297-3.342 1.297H8.449z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineEmits<{
  showHelp: [];
  showContact: [];
}>();

const currentYear = computed(() => new Date().getFullYear());
</script>
