#!/usr/bin/env node

/**
 * One-time Premier League data seeding script
 * This script calls the AWS Lambda function to populate the database with Premier League teams and players
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Read the amplify outputs to get the function URL
const outputsPath = path.join(__dirname, '..', 'amplify_outputs.json');

if (!fs.existsSync(outputsPath)) {
  console.error('❌ amplify_outputs.json not found. Make sure the backend is deployed.');
  process.exit(1);
}

const outputs = JSON.parse(fs.readFileSync(outputsPath, 'utf8'));

// Extract the seed function URL from outputs
const seedFunctionUrl = outputs.custom?.seedData?.url;

if (!seedFunctionUrl) {
  console.error('❌ Seed function URL not found in amplify outputs.');
  console.error('Make sure the backend with seed function is deployed.');
  console.log('Available custom functions:', Object.keys(outputs.custom || {}));
  process.exit(1);
}

console.log('🌱 Starting Premier League data seeding...');
console.log(`📡 Calling seed function: ${seedFunctionUrl}`);

// Make the HTTP request to trigger seeding
const url = new URL(seedFunctionUrl);
const options = {
  hostname: url.hostname,
  port: url.port || (url.protocol === 'https:' ? 443 : 80),
  path: url.pathname + url.search,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = https.request(options, res => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);

      if (result.success) {
        console.log('✅ Premier League data seeded successfully!');
        console.log(`📊 Teams created: ${result.data.teamsCreated}`);
        console.log(`⚽ Players created: ${result.data.playersCreated}`);
        console.log('🎉 Database is now populated with Premier League data');
      } else {
        console.error('❌ Seeding failed:', result.error);
        if (result.details) {
          console.error('Details:', result.details);
        }
        process.exit(1);
      }
    } catch (parseError) {
      console.error('❌ Error parsing response:', parseError);
      console.error('Response data:', data);
      process.exit(1);
    }
  });
});

req.on('error', error => {
  console.error('❌ Request failed:', error);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
  process.exit(1);
});

// Set timeout to 15 minutes (same as function timeout)
req.setTimeout(15 * 60 * 1000);

// Send the request
req.write(JSON.stringify({ action: 'seed' }));
req.end();

console.log('⏳ Seeding in progress... This may take several minutes to complete.');
console.log('📝 The function will fetch all Premier League teams and players from API-Football');
console.log('💾 Data will be stored in DynamoDB for public access by all users');
