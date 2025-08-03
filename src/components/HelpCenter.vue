<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FAF7F3] to-[#F0E4D3] py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="text-5xl mb-4">❓</div>
        <h1 class="text-4xl font-bold text-foreground mb-4">Help Center</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions and learn how to make the most of your fantasy football
          experience.
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
        <Card
          class="cursor-pointer hover:shadow-lg transition-shadow"
          @click="$emit('showContact')"
        >
          <CardContent class="p-6 text-center">
            <div class="text-4xl mb-4">📧</div>
            <h3 class="text-xl font-semibold mb-2">Contact Support</h3>
            <p class="text-muted-foreground">
              Can't find what you're looking for? Send us a message and we'll help you out.
            </p>
          </CardContent>
        </Card>

        <Card class="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent class="p-6 text-center">
            <div class="text-4xl mb-4">📚</div>
            <h3 class="text-xl font-semibold mb-2">User Guide</h3>
            <p class="text-muted-foreground">
              Learn the basics and advanced features of our fantasy football platform.
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- FAQ Section -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center text-foreground mb-8">
          Frequently Asked Questions
        </h2>

        <div class="grid gap-6 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">How do I create my fantasy team?</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">
                After signing up, navigate to "My Team" in the sidebar. You'll be able to select
                players from different positions, manage your formation, and track your team's
                performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-lg">How does the scoring system work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">
                Points are awarded based on real player performance: goals, assists, clean sheets,
                and more. Check the "Rules & Scoring" section for detailed point values.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Can I join multiple leagues?</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">
                Yes! You can create private leagues with friends or join public leagues to compete
                with other fantasy football enthusiasts worldwide.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-lg">When are player scores updated?</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">
                Player scores are updated in real-time during matches and finalized shortly after
                each game ends. You can track live updates in the "Live Scores" section.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from './ui';

defineEmits<{
  showContact: [];
}>();
</script>
