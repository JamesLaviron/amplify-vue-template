import './assets/globals.css';
import { createApp } from 'vue';
import App from './App.vue';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// Import seeding utility for development
import './utils/seedPlayers';
import './utils/testApiFootball';
import './utils/testAmplifyModels';
import './utils/debugSeeder';

Amplify.configure(outputs);

const app = createApp(App);
app.mount('#app');
