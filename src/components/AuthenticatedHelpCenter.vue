<template>
  <div class="py-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <div class="text-5xl mb-4">🏆</div>
      <h1 class="text-4xl font-bold text-foreground mb-4">Fantasy Football Help Center</h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Master your fantasy football skills with our comprehensive guide. Welcome,
        {{ user?.username }}!
      </p>
    </div>

    <!-- Quick Start Guide -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-foreground mb-8 text-center">🚀 Quick Start Guide</h2>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="text-center">
          <CardContent class="p-6">
            <div class="text-4xl mb-4">👥</div>
            <h3 class="text-lg font-semibold mb-2">1. Build Your Team</h3>
            <p class="text-sm text-muted-foreground">
              Select 15 players within budget. Choose your formation and starting XI.
            </p>
          </CardContent>
        </Card>

        <Card class="text-center">
          <CardContent class="p-6">
            <div class="text-4xl mb-4">⚽</div>
            <h3 class="text-lg font-semibold mb-2">2. Choose Players</h3>
            <p class="text-sm text-muted-foreground">
              Browse Premier League players, check stats, and build your squad.
            </p>
          </CardContent>
        </Card>

        <Card class="text-center">
          <CardContent class="p-6">
            <div class="text-4xl mb-4">🏆</div>
            <h3 class="text-lg font-semibold mb-2">3. Join Leagues</h3>
            <p class="text-sm text-muted-foreground">
              Create private leagues with friends or join public competitions.
            </p>
          </CardContent>
        </Card>

        <Card class="text-center">
          <CardContent class="p-6">
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="text-lg font-semibold mb-2">4. Track Live Scores</h3>
            <p class="text-sm text-muted-foreground">
              Monitor your team's performance with real-time match updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Detailed Guides -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-foreground mb-8 text-center">📚 Detailed Guides</h2>

      <div class="grid gap-6">
        <!-- Team Management -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span>👥</span>
              Team Management
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <h4 class="font-semibold mb-2">Building Your Squad</h4>
              <ul class="list-disc list-inside text-muted-foreground space-y-1">
                <li>You have £100m to spend on 15 players</li>
                <li>Required: 2 Goalkeepers, 5 Defenders, 5 Midfielders, 3 Forwards</li>
                <li>Maximum 3 players from any single team</li>
                <li>Choose your captain (2x points) and vice-captain</li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-2">Formations</h4>
              <p class="text-muted-foreground">
                Choose from popular formations like 4-4-2, 3-5-2, or 4-3-3. Your formation
                determines how many players from each position start in your team.
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- Scoring System -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span>📊</span>
              Scoring System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold mb-3">Positive Points</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Playing 1-60 minutes</span>
                    <span class="font-medium">+1</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Playing 60+ minutes</span>
                    <span class="font-medium">+2</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Goal (Forward)</span>
                    <span class="font-medium">+4</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Goal (Midfielder)</span>
                    <span class="font-medium">+5</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Goal (Defender/GK)</span>
                    <span class="font-medium">+6</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Assist</span>
                    <span class="font-medium">+3</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Clean Sheet (GK/DEF)</span>
                    <span class="font-medium">+4</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Clean Sheet (MID)</span>
                    <span class="font-medium">+1</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-semibold mb-3">Negative Points</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>Yellow Card</span>
                    <span class="font-medium text-red-600">-1</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Red Card</span>
                    <span class="font-medium text-red-600">-3</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Own Goal</span>
                    <span class="font-medium text-red-600">-2</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Penalty Miss</span>
                    <span class="font-medium text-red-600">-2</span>
                  </div>
                  <div class="flex justify-between">
                    <span>2 Goals Conceded (GK/DEF)</span>
                    <span class="font-medium text-red-600">-1</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Transfers & Strategy -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span>🔄</span>
              Transfers & Strategy
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <h4 class="font-semibold mb-2">Transfer Rules</h4>
              <ul class="list-disc list-inside text-muted-foreground space-y-1">
                <li>1 free transfer each gameweek</li>
                <li>Additional transfers cost 4 points each</li>
                <li>Use your free transfer or it's lost</li>
                <li>Plan transfers around fixtures and player form</li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-2">Strategy Tips</h4>
              <ul class="list-disc list-inside text-muted-foreground space-y-1">
                <li>Captain players with favorable fixtures</li>
                <li>Monitor player injuries and suspensions</li>
                <li>Consider player rotation in congested periods</li>
                <li>Balance premium players with budget options</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <!-- Leagues & Competition -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span>🏆</span>
              Leagues & Competition
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <h4 class="font-semibold mb-2">League Types</h4>
              <div class="space-y-3">
                <div>
                  <strong class="text-sm">Private Leagues:</strong>
                  <p class="text-sm text-muted-foreground">
                    Create or join leagues with friends using a unique code
                  </p>
                </div>
                <div>
                  <strong class="text-sm">Public Leagues:</strong>
                  <p class="text-sm text-muted-foreground">
                    Compete against fantasy managers worldwide
                  </p>
                </div>
                <div>
                  <strong class="text-sm">Overall Rankings:</strong>
                  <p class="text-sm text-muted-foreground">Your global ranking among all players</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-foreground mb-8 text-center">
        ❓ Frequently Asked Questions
      </h2>

      <div class="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">When do gameweeks start and end?</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Gameweeks typically run from Saturday to Sunday, covering all Premier League matches.
              The deadline for team changes is usually 90 minutes before the first match of the
              gameweek.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">What happens if a player doesn't play?</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              If a player in your starting XI doesn't play, they'll be automatically substituted by
              the first available player on your bench, in order of priority.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">
              Can I change my captain after the gameweek starts?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              No, all team changes including captain selection must be made before the gameweek
              deadline. If your captain doesn't play, your vice-captain automatically becomes
              captain.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">How are player prices determined?</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">
              Player prices are based on demand, performance, and real-world form. Prices can rise
              or fall by £0.1m based on how many managers buy or sell them.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="text-center">
      <Card>
        <CardContent class="p-8">
          <div class="text-4xl mb-4">📧</div>
          <h3 class="text-xl font-semibold mb-4">Still Need Help?</h3>
          <p class="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <Button>Contact Support</Button>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent, Button } from './ui';

interface Props {
  user: any;
}

defineProps<Props>();
</script>
