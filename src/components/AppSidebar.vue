<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">⚽</span>
            <h2 class="font-bold text-lg text-sidebar-foreground">Fantasy Football</h2>
          </div>
          <Button
            @click="toggleSidebar"
            variant="ghost"
            size="icon"
            class="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 space-y-2">
          <div class="space-y-1">
            <SidebarMenuItem 
              icon="🏠" 
              label="Dashboard" 
              :active="activeMenu === 'dashboard'"
              @click="setActiveMenu('dashboard')"
            />
            <SidebarMenuItem 
              icon="👥" 
              label="My Team" 
              :active="activeMenu === 'team'"
              @click="setActiveMenu('team')"
            />
            <SidebarMenuItem 
              icon="🏆" 
              label="Leagues" 
              :active="activeMenu === 'leagues'"
              @click="setActiveMenu('leagues')"
            />
            <SidebarMenuItem 
              icon="⚽" 
              label="Players" 
              :active="activeMenu === 'players'"
              @click="setActiveMenu('players')"
            />
            <SidebarMenuItem 
              icon="📊" 
              label="Live Scores" 
              :active="activeMenu === 'scores'"
              @click="setActiveMenu('scores')"
            />
          </div>

          <div class="pt-4 border-t border-sidebar-border">
            <p class="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">Account</p>
            <SidebarMenuItem 
              icon="⚙️" 
              label="Settings" 
              :active="activeMenu === 'settings'"
              @click="setActiveMenu('settings')"
            />
            <SidebarMenuItem 
              icon="📈" 
              label="Statistics" 
              :active="activeMenu === 'stats'"
              @click="setActiveMenu('stats')"
            />
            <SidebarMenuItem 
              icon="💬" 
              label="Help Center" 
              :active="activeMenu === 'help'"
              @click="setActiveMenu('help')"
            />
            
            <!-- Dark Mode Toggle -->
            <div class="px-3 py-2.5">
              <DarkModeToggle 
                show-label 
                variant="ghost"
                size="sm"
                button-class="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
              />
            </div>
          </div>
        </nav>

        <!-- User Profile Section -->
        <div class="p-4 border-t border-sidebar-border">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span class="text-primary-foreground text-sm font-medium">
                {{ user?.username?.[0]?.toUpperCase() || user?.signInDetails?.loginId?.[0]?.toUpperCase() || 'U' }}
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
          <Button 
            @click="$emit('signOut')"
            variant="outline" 
            size="sm" 
            class="w-full text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div 
      v-if="isOpen" 
      @click="closeSidebar"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-0">
      <!-- Mobile Header -->
      <header class="lg:hidden bg-background border-b border-border p-4 flex items-center justify-between">
        <Button
          @click="toggleSidebar"
          variant="ghost"
          size="icon"
          class="text-foreground"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
        <h1 class="font-semibold text-foreground">Fantasy Football</h1>
        <div class="w-10"></div> <!-- Spacer for centering -->
      </header>

      <!-- Page Content -->
      <main class="h-full overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from './ui'
import SidebarMenuItem from './SidebarMenuItem.vue'
import DarkModeToggle from './DarkModeToggle.vue'

// Define props
const props = defineProps<{
  user: any
}>()

// Define emits
const emit = defineEmits<{
  signOut: []
  menuChange: [menu: string]
}>()

// Sidebar state
const isOpen = ref(false)
const activeMenu = ref('dashboard')

// Sidebar methods
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}

const setActiveMenu = (menu: string) => {
  activeMenu.value = menu
  emit('menuChange', menu)
  closeSidebar() // Close on mobile after selection
}
</script>

