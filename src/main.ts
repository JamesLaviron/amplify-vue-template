import './assets/globals.css';
import { createApp } from 'vue';
import App from './App.vue';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// Development utilities removed - data population now handled server-side

Amplify.configure(outputs);

const app = createApp(App);
app.mount('#app');
