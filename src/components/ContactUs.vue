<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FAF7F3] to-[#F0E4D3] py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="text-5xl mb-4">📧</div>
        <h1 class="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get in touch with us for any questions, feedback, or business inquiries. We'd love to hear
          from you!
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div>
          <Card>
            <CardHeader>
              <CardTitle class="text-2xl">Send us a Message</CardTitle>
              <p class="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </CardHeader>

            <CardContent>
              <form class="space-y-6" @submit.prevent="handleSubmit">
                <!-- Success/Error Messages -->
                <Alert
                  v-if="successMessage"
                  class="mb-4 border-green-200 bg-green-50 text-green-800"
                >
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ successMessage }}
                  </div>
                </Alert>

                <Alert v-if="errorMessage" variant="destructive" class="mb-4">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ errorMessage }}
                  </div>
                </Alert>

                <!-- Name Field -->
                <div class="space-y-2">
                  <Label for="name">Your Name</Label>
                  <Input
                    id="name"
                    v-model="form.name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Email Field -->
                <div class="space-y-2">
                  <Label for="email">Email Address</Label>
                  <Input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Subject Field -->
                <div class="space-y-2">
                  <Label for="subject">Subject</Label>
                  <Input
                    id="subject"
                    v-model="form.subject"
                    type="text"
                    placeholder="What's this about?"
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Message Field -->
                <div class="space-y-2">
                  <Label for="message">Message</Label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="6"
                    class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Tell us what's on your mind..."
                    required
                    :disabled="loading"
                  />
                </div>

                <!-- Submit Button -->
                <Button type="submit" class="w-full" :disabled="loading">
                  <div
                    v-if="loading"
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                  />
                  {{ loading ? 'Sending Message...' : 'Send Message' }}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <!-- Contact Information & Map -->
        <div class="space-y-8">
          <!-- Contact Information -->
          <Card>
            <CardHeader>
              <CardTitle class="text-2xl">Get in Touch</CardTitle>
              <p class="text-muted-foreground">Here's how you can reach us directly</p>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Email -->
              <div class="flex items-start space-x-4">
                <div
                  class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-foreground">Email</h3>
                  <p class="text-muted-foreground">Get in touch via email</p>
                  <a
                    href="mailto:victor@gerfaud.fr"
                    class="text-primary hover:underline cursor-pointer"
                  >
                    victor@gerfaud.fr
                  </a>
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start space-x-4">
                <div
                  class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-foreground">Address</h3>
                  <p class="text-muted-foreground">Visit us at our location</p>
                  <address class="text-primary not-italic">
                    60 Avenue de Fontainebleau
                    <br />
                    Le Kremlin-Bicêtre, France
                  </address>
                </div>
              </div>

              <!-- Response Time -->
              <div class="flex items-start space-x-4">
                <div
                  class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-foreground">Response Time</h3>
                  <p class="text-muted-foreground">We typically respond within</p>
                  <p class="text-primary font-medium">24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Google Maps -->
          <Card>
            <CardHeader>
              <CardTitle class="text-xl">Find Us</CardTitle>
              <p class="text-muted-foreground">Our location on the map</p>
            </CardHeader>
            <CardContent class="p-0">
              <div class="w-full h-64 rounded-b-lg overflow-hidden">
                <iframe
                  :src="mapsSrc"
                  width="100%"
                  height="100%"
                  style="border: 0"
                  allowfullscreen
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  class="rounded-b-lg"
                />
              </div>
              <div class="p-4 bg-muted/30">
                <p class="text-sm text-muted-foreground">
                  <strong>Note:</strong>
                  This is an approximate location for demonstration purposes. Please confirm the
                  exact address before visiting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label, Alert } from './ui';

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Google Maps configuration
const mapsSrc = computed(() => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=60+Avenue+de+Fontainebleau,+Le+Kremlin-Bicêtre,+France&zoom=15`;
});

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const handleSubmit = async () => {
  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    // Simulate form processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create mailto link with form data
    const subject = encodeURIComponent(`Fantasy Football Contact: ${form.value.subject}`);
    const body = encodeURIComponent(
      `Name: ${form.value.name}\n` +
        `Email: ${form.value.email}\n\n` +
        `Message:\n${form.value.message}\n\n` +
        `---\nSent from Fantasy Football Contact Form`
    );

    const mailtoLink = `mailto:victor@gerfaud.fr?subject=${subject}&body=${body}`;

    // Open email client
    window.open(mailtoLink, '_blank');

    successMessage.value =
      "Your email client should open with the message pre-filled. If it doesn't open automatically, please send your message to victor@gerfaud.fr";

    // Reset form after successful submission
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
  } catch (error) {
    console.error('Error processing form:', error);
    errorMessage.value =
      'There was an issue processing your message. Please contact us directly at victor@gerfaud.fr';
  } finally {
    loading.value = false;
  }
};
</script>
