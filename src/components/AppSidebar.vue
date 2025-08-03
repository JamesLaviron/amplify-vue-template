<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 bg-gray-950 border-r border-gray-800 transition-all duration-300 ease-in-out lg:static lg:inset-0',
        isCollapsed ? 'w-16' : 'w-64',
        isOpen || !isCollapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-primary-foreground text-lg font-bold">⚽</span>
            </div>
            <div v-if="!isCollapsed" class="transition-opacity duration-300">
              <h2 class="font-semibold text-sm text-sidebar-foreground">Fantasy Football</h2>
              <p class="text-xs text-sidebar-foreground/60">Enterprise</p>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <!-- Mobile Close Button -->
            <button
              class="lg:hidden w-6 h-6 flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded transition-colors"
              @click="closeSidebar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 px-3 py-4 space-y-1">
          <div class="space-y-1">
            <SidebarMenuItem
              icon="🏠"
              label="Dashboard"
              :active="activeMenu === 'dashboard'"
              :collapsed="isCollapsed"
              @click="setActiveMenu('dashboard')"
            />
            <SidebarMenuItem
              icon="👥"
              label="My Team"
              :active="activeMenu === 'team'"
              :collapsed="isCollapsed"
              @click="setActiveMenu('team')"
            />
            <SidebarMenuItem
              icon="🏆"
              label="Leagues"
              :active="activeMenu === 'leagues'"
              :collapsed="isCollapsed"
              @click="setActiveMenu('leagues')"
            />
            <SidebarMenuItem
              icon="⚽"
              label="Players"
              :active="activeMenu === 'players'"
              :collapsed="isCollapsed"
              @click="setActiveMenu('players')"
            />
            <SidebarMenuItem
              icon="📊"
              label="Live Scores"
              :active="activeMenu === 'scores'"
              :collapsed="isCollapsed"
              @click="setActiveMenu('scores')"
            />
          </div>

          <div class="pt-4 mt-4 border-t border-gray-800">
            <p
              v-if="!isCollapsed"
              class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3 transition-opacity duration-300"
            >
              Account
            </p>
            <SidebarMenuItem
              icon="⚙️"
              label="Settings"
              :active="activeMenu === 'settings'"
              :collapsed="isCollapsed"
              @click="setActiveMenu('settings')"
            />
            <SidebarMenuItem
              icon="📈"
              label="Statistics"
              :active="activeMenu === 'stats'"
              :collapsed="isCollapsed"
              @click="setActiveMenu('stats')"
            />
            <SidebarMenuItem
              icon="💬"
              label="Help Center"
              :active="activeMenu === 'help'"
              :collapsed="isCollapsed"
              @click="setActiveMenu('help')"
            />

            <!-- Dark Mode Toggle -->
            <div v-if="!isCollapsed" class="px-3 py-1 transition-opacity duration-300">
              <DarkModeToggle
                show-label
                variant="ghost"
                size="sm"
                button-class="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
              />
            </div>
            <div v-else class="px-3 py-1 flex justify-center">
              <DarkModeToggle
                variant="ghost"
                size="sm"
                button-class="text-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
              />
            </div>
          </div>
        </nav>

        <!-- User Profile Section -->
        <div class="p-3 border-t border-sidebar-border">
          <div v-if="!isCollapsed" class="transition-opacity duration-300">
            <div class="flex items-center space-x-3 mb-3 px-3 py-2">
              <div class="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <span class="text-primary-foreground text-xs font-medium">
                  {{
                    user?.username?.[0]?.toUpperCase() ||
                    user?.signInDetails?.loginId?.[0]?.toUpperCase() ||
                    'U'
                  }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-sidebar-foreground truncate">
                  {{ user?.username || user?.signInDetails?.loginId?.split('@')[0] || 'User' }}
                </p>
                <p class="text-xs text-sidebar-foreground/60 truncate">
                  {{ user?.signInDetails?.loginId || '' }}
                </p>
              </div>
            </div>
            <button
              class="w-full px-3 py-2 text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-md transition-colors text-left flex items-center space-x-2"
              @click="$emit('signOut')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
          <div v-else class="flex flex-col items-center space-y-3">
            <div
              class="w-7 h-7 bg-primary rounded-full flex items-center justify-center"
              :title="user?.username || user?.signInDetails?.loginId?.split('@')[0] || 'User'"
            >
              <span class="text-primary-foreground text-xs font-medium">
                {{
                  user?.username?.[0]?.toUpperCase() ||
                  user?.signInDetails?.loginId?.[0]?.toUpperCase() ||
                  'U'
                }}
              </span>
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-md transition-colors"
              title="Sign Out"
              @click="$emit('signOut')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Desktop Panel Toggle Button -->
    <button
      class="hidden lg:flex fixed top-4 z-50 w-8 h-8 items-center justify-center bg-sidebar border border-sidebar-border rounded-md shadow-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-300"
      :style="{ left: isCollapsed ? '68px' : '272px' }"
      :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="toggleCollapse"
    >
      <!-- Expanded state: Show collapse icon (sidebar with left arrow) -->
      <svg
        v-if="!isCollapsed"
        class="w-4 h-4 transition-opacity duration-300"
        fill="currentColor"
        viewBox="0 0 64 64"
      >
        <path
          d="M49.984,56l-35.989,0c-3.309,0 -5.995,-2.686 -5.995,-5.995l0,-36.011c0,-3.308 2.686,-5.995 5.995,-5.995l35.989,0c3.309,0 5.995,2.687 5.995,5.995l0,36.011c0,3.309 -2.686,5.995 -5.995,5.995Zm-25.984,-4.001l0,-39.999l-9.012,0c-1.65,0 -2.989,1.339 -2.989,2.989l0,34.021c0,1.65 1.339,2.989 2.989,2.989l9.012,0Zm24.991,-39.999l-20.991,0l0,39.999l20.991,0c1.65,0 2.989,-1.339 2.989,-2.989l0,-34.021c0,-1.65 -1.339,-2.989 -2.989,-2.989Z"
        />
        <path d="M19.999,38.774l-6.828,-6.828l6.828,-6.829l2.829,2.829l-4,4l4,4l-2.829,2.828Z" />
      </svg>
      <!-- Collapsed state: Show expand icon (sidebar with menu lines) -->
      <svg
        v-else
        class="w-4 h-4 transition-opacity duration-300"
        fill="currentColor"
        viewBox="0 0 64 64"
      >
        <path
          d="M50.008,56.043l-35.989,0c-3.309,0 -5.995,-2.686 -5.995,-5.995l0,-36.011c0,-3.308 2.686,-5.994 5.995,-5.995l35.989,0c3.309,0.001 5.995,2.687 5.995,5.995l0,36.011c0,3.309 -2.686,5.995 -5.995,5.995Zm-25.984,-4.001l0,-39.999l-9.012,0c-1.65,0 -2.989,1.339 -2.989,2.989l0,34.021c0,1.65 1.339,2.989 2.989,2.989l9.012,0Zm24.991,-39.999l-20.991,0l0,39.999l20.991,0c1.65,0 2.989,-1.339 2.989,-2.989l0,-34.021c0,-1.65 -1.339,-2.989 -2.989,-2.989Z"
        />
        <rect x="14.611" y="16.042" width="6.569" height="2" />
        <rect x="14.611" y="20.042" width="6.569" height="2" />
        <rect x="14.611" y="24.042" width="6.569" height="2" />
      </svg>
    </button>

    <!-- Overlay for mobile -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="closeSidebar" />

    <!-- Main Content -->
    <div class="flex-1 lg:ml-0">
      <!-- Mobile Header -->
      <header
        class="lg:hidden bg-sidebar border-b border-sidebar-border p-4 flex items-center justify-between"
      >
        <button
          class="w-10 h-10 flex items-center justify-center text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent rounded-md transition-colors"
          @click="toggleSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 class="font-semibold text-sidebar-foreground">Fantasy Football</h1>
        <div class="w-10" />
        <!-- Spacer for centering -->
      </header>

      <!-- Page Content -->
      <main class="h-full overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SidebarMenuItem from './SidebarMenuItem.vue';
import DarkModeToggle from './DarkModeToggle.vue';

// Define props
defineProps<{
  user: any;
}>();

// Define emits
const emit = defineEmits<{
  signOut: [];
  menuChange: [menu: string];
}>();

// Sidebar state
const isOpen = ref(false);
const isCollapsed = ref(false);
const activeMenu = ref('dashboard');

// Sidebar methods
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const closeSidebar = () => {
  isOpen.value = false;
};

const setActiveMenu = (menu: string) => {
  activeMenu.value = menu;
  emit('menuChange', menu);
  closeSidebar(); // Close on mobile after selection
};
</script>
