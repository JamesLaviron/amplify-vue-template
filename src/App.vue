<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import FantasyDashboard from './components/FantasyDashboard.vue';
import AuthForm from './components/AuthForm.vue';
import AppFooter from './components/AppFooter.vue';
import AppSidebar from './components/AppSidebar.vue';
import LandingContent from './components/LandingContent.vue';
import PublicHeader from './components/PublicHeader.vue';
import HelpCenter from './components/HelpCenter.vue';
import AuthenticatedHelpCenter from './components/AuthenticatedHelpCenter.vue';
import ContactUs from './components/ContactUs.vue';
const user = ref<any>(null);
const showAuth = ref(false);
const authMode = ref<'signIn' | 'signUp'>('signIn');
const currentPage = ref<'landing' | 'auth' | 'help' | 'contact'>('landing');

onMounted(async () => {
  try {
    const currentUser = await getCurrentUser();
    user.value = currentUser;
  } catch {
    console.log('No authenticated user');
  }
});

const handleSignOut = async () => {
  await signOut();
  user.value = null;
};

const handleSignedIn = (authUser: any) => {
  user.value = authUser;
};

const currentMenu = ref('dashboard');

const handleMenuChange = (menu: string) => {
  console.log('Menu changed to:', menu);
  currentMenu.value = menu;
};

const handleShowAuth = (mode: 'signIn' | 'signUp') => {
  authMode.value = mode;
  showAuth.value = true;
  currentPage.value = 'auth';
  window.scrollTo(0, 0);
};

const handleBackToLanding = () => {
  showAuth.value = false;
  currentPage.value = 'landing';
  window.scrollTo(0, 0);
};

const handleShowHelp = () => {
  currentPage.value = 'help';
  showAuth.value = false;
  window.scrollTo(0, 0);
};

const handleShowContact = () => {
  currentPage.value = 'contact';
  showAuth.value = false;
  window.scrollTo(0, 0);
};
</script>

<template>
  <div id="app">
    <!-- Show public pages when not logged in -->
    <div v-if="!user" class="flex flex-col min-h-screen">
      <!-- Consistent Public Header -->
      <PublicHeader
        :show-back-button="currentPage !== 'landing'"
        :hide-auth-buttons="currentPage !== 'landing'"
        @show-auth="handleShowAuth"
        @back="handleBackToLanding"
      />

      <!-- Main Content -->
      <main class="flex-1">
        <!-- Show auth form -->
        <div
          v-if="currentPage === 'auth'"
          class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF7F3] to-[#F0E4D3] p-4"
        >
          <AuthForm :initial-mode="authMode" @signed-in="handleSignedIn" />
        </div>

        <!-- Show help center -->
        <HelpCenter v-else-if="currentPage === 'help'" @show-contact="handleShowContact" />

        <!-- Show contact us -->
        <ContactUs v-else-if="currentPage === 'contact'" />

        <!-- Show landing page content (without its own header) -->
        <LandingContent v-else @show-auth="handleShowAuth" />
      </main>

      <!-- Consistent Footer -->
      <AppFooter @show-help="handleShowHelp" @show-contact="handleShowContact" />
    </div>

    <!-- Show sidebar layout when logged in -->
    <div v-else class="h-screen">
      <AppSidebar :user="user" @sign-out="handleSignOut" @menu-change="handleMenuChange">
        <div class="flex flex-col h-full">
          <main class="flex-1 p-6 overflow-auto">
            <!-- Dashboard View -->
            <FantasyDashboard v-if="currentMenu === 'dashboard'" :user="user" />

            <!-- Help Center View -->
            <div v-else-if="currentMenu === 'help'" class="max-w-4xl mx-auto">
              <AuthenticatedHelpCenter :user="user" />
            </div>

            <!-- Default to Dashboard -->
            <FantasyDashboard v-else :user="user" />
          </main>
        </div>
      </AppSidebar>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #d9a299 0%, #dcc5b2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  font-size: 0.9rem;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
