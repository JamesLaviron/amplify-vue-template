<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FAF7F3] to-[#F0E4D3]">
    <!-- Hero Section -->
    <section class="relative py-12 px-4 text-center">
      <div class="container mx-auto max-w-4xl">
        <!-- Logo and Title -->
        <div class="mb-8">
          <div class="text-6xl sm:text-7xl mb-4">⚽</div>
          <h1 class="text-4xl sm:text-6xl font-bold text-foreground mb-4">Fantasy Football</h1>
          <p class="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Build your dream team, compete with friends, and experience the ultimate fantasy
            football adventure
          </p>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            class="w-full sm:w-auto px-8 py-3 text-lg"
            @click="$emit('showAuth', 'signUp')"
          >
            Get Started Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="w-full sm:w-auto px-8 py-3 text-lg"
            @click="$emit('showAuth', 'signIn')"
          >
            Sign In
          </Button>
        </div>

        <!-- Hero Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">
              <AnimatedNumber :target="500" suffix="+" />
            </div>
            <div class="text-sm text-muted-foreground">Active Players</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">24/7</div>
            <div class="text-sm text-muted-foreground">Live Updates</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">
              <AnimatedNumber :target="100" suffix="%" />
            </div>
            <div class="text-sm text-muted-foreground">Free to Play</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 bg-[#F0E4D3]/50">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
          Why Choose Fantasy Football?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <Card class="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent class="pt-6">
              <div class="text-4xl mb-4">👥</div>
              <CardTitle class="mb-3">Team Management</CardTitle>
              <p class="text-muted-foreground">
                Build and customize your ultimate football team with real players and strategic
                formations
              </p>
            </CardContent>
          </Card>

          <!-- Feature 2 -->
          <Card class="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent class="pt-6">
              <div class="text-4xl mb-4">🏆</div>
              <CardTitle class="mb-3">League Competition</CardTitle>
              <p class="text-muted-foreground">
                Join private leagues with friends or compete globally in public tournaments
              </p>
            </CardContent>
          </Card>

          <!-- Feature 3 -->
          <Card class="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent class="pt-6">
              <div class="text-4xl mb-4">📊</div>
              <CardTitle class="mb-3">Live Scoring</CardTitle>
              <p class="text-muted-foreground">
                Real-time match updates and scoring based on actual player performance
              </p>
            </CardContent>
          </Card>

          <!-- Feature 4 -->
          <Card class="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent class="pt-6">
              <div class="text-4xl mb-4">📈</div>
              <CardTitle class="mb-3">Player Analytics</CardTitle>
              <p class="text-muted-foreground">
                Detailed statistics and performance insights to help you make winning decisions
              </p>
            </CardContent>
          </Card>

          <!-- Feature 5 -->
          <Card class="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent class="pt-6">
              <div class="text-4xl mb-4">🎯</div>
              <CardTitle class="mb-3">Smart Transfers</CardTitle>
              <p class="text-muted-foreground">
                Strategic player transfers and budget management to optimize your team
              </p>
            </CardContent>
          </Card>

          <!-- Feature 6 -->
          <Card class="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent class="pt-6">
              <div class="text-4xl mb-4">📱</div>
              <CardTitle class="mb-3">Mobile Friendly</CardTitle>
              <p class="text-muted-foreground">
                Responsive design that works perfectly on all devices and screen sizes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 bg-[#D9A299] text-white">
      <div class="container mx-auto max-w-4xl text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-6">Ready to Start Your Fantasy Journey?</h2>
        <p class="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of football fans already competing in the most exciting fantasy football
          experience. Sign up now and start building your championship team!
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="secondary"
            size="lg"
            class="w-full sm:w-auto px-8 py-3 text-lg"
            @click="$emit('showAuth', 'signUp')"
          >
            Create Free Account
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="w-full sm:w-auto px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-primary bg-transparent"
            @click="$emit('showAuth', 'signIn')"
          >
            Sign In
          </Button>
        </div>

        <p class="text-sm mt-6 opacity-75">
          No credit card required • Free forever • Get started in 2 minutes
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Button, Card, CardContent, CardTitle } from './ui';
import AnimatedNumber from './AnimatedNumber.vue';

defineEmits<{
  showAuth: [mode: 'signIn' | 'signUp'];
}>();
</script>
