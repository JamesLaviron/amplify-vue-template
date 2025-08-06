#!/usr/bin/env node

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { readFileSync } from 'fs';

// Configuration Amplify
const amplifyconfig = JSON.parse(readFileSync('./amplify_outputs.json', 'utf8'));
Amplify.configure(amplifyconfig);
const client = generateClient();

// Données transformées pour le modèle Amplify
const clubs = [
  {
    id: '34',
    name: 'Newcastle',
    code: 'NEW',
    country: 'England',
    founded: 1892,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/34.png',
    venueId: '562',
    venueName: "St. James' Park",
    venueAddress: "St. James' Street",
    venueCity: 'Newcastle upon Tyne',
    venueCapacity: 52758,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/562.png',
  },
  {
    id: '35',
    name: 'Bournemouth',
    code: 'BOU',
    country: 'England',
    founded: 1899,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/35.png',
    venueId: '504',
    venueName: 'Vitality Stadium',
    venueAddress: 'Dean Court, Kings Park',
    venueCity: 'Bournemouth, Dorset',
    venueCapacity: 12000,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/504.png',
  },
  {
    id: '36',
    name: 'Fulham',
    code: 'FUL',
    country: 'England',
    founded: 1879,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/36.png',
    venueId: '535',
    venueName: 'Craven Cottage',
    venueAddress: 'Stevenage Road',
    venueCity: 'London',
    venueCapacity: 29589,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/535.png',
  },
  {
    id: '39',
    name: 'Wolves',
    code: 'WOL',
    country: 'England',
    founded: 1877,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/39.png',
    venueId: '600',
    venueName: 'Molineux Stadium',
    venueAddress: 'Waterloo Road',
    venueCity: 'Wolverhampton, West Midlands',
    venueCapacity: 34624,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/600.png',
  },
  {
    id: '40',
    name: 'Liverpool',
    code: 'LIV',
    country: 'England',
    founded: 1892,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/40.png',
    venueId: '550',
    venueName: 'Anfield',
    venueAddress: 'Anfield Road',
    venueCity: 'Liverpool',
    venueCapacity: 61276,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/550.png',
  },
  {
    id: '42',
    name: 'Arsenal',
    code: 'ARS',
    country: 'England',
    founded: 1886,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/42.png',
    venueId: '494',
    venueName: 'Emirates Stadium',
    venueAddress: 'Hornsey Road',
    venueCity: 'London',
    venueCapacity: 60383,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/494.png',
  },
  {
    id: '44',
    name: 'Burnley',
    code: 'BUR',
    country: 'England',
    founded: 1882,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/44.png',
    venueId: '512',
    venueName: 'Turf Moor',
    venueAddress: 'Harry Potts Way',
    venueCity: 'Burnley',
    venueCapacity: 22546,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/512.png',
  },
  {
    id: '45',
    name: 'Everton',
    code: 'EVE',
    country: 'England',
    founded: 1878,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/45.png',
    venueId: '22033',
    venueName: 'Hill Dickinson Stadium',
    venueAddress: '35 Regent Road, Bramley-Moore Dock, Vauxhall',
    venueCity: 'Liverpool, Merseyside',
    venueCapacity: 52888,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/22033.png',
  },
  {
    id: '47',
    name: 'Tottenham',
    code: 'TOT',
    country: 'England',
    founded: 1882,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/47.png',
    venueId: '593',
    venueName: 'Tottenham Hotspur Stadium',
    venueAddress: 'Bill Nicholson Way, 748 High Road',
    venueCity: 'London',
    venueCapacity: 62850,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/593.png',
  },
  {
    id: '48',
    name: 'West Ham',
    code: 'WES',
    country: 'England',
    founded: 1895,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/48.png',
    venueId: '598',
    venueName: 'London Stadium',
    venueAddress: 'Marshgate Lane, Stratford',
    venueCity: 'London',
    venueCapacity: 64472,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/598.png',
  },
  {
    id: '49',
    name: 'Chelsea',
    code: 'CHE',
    country: 'England',
    founded: 1905,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/49.png',
    venueId: '519',
    venueName: 'Stamford Bridge',
    venueAddress: 'Fulham Road',
    venueCity: 'London',
    venueCapacity: 41841,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/519.png',
  },
  {
    id: '33',
    name: 'Manchester United',
    code: 'MUN',
    country: 'England',
    founded: 1878,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/33.png',
    venueId: '556',
    venueName: 'Old Trafford',
    venueAddress: 'Sir Matt Busby Way',
    venueCity: 'Manchester',
    venueCapacity: 76212,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/556.png',
  },
  {
    id: '50',
    name: 'Manchester City',
    code: 'MAC',
    country: 'England',
    founded: 1880,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/50.png',
    venueId: '555',
    venueName: 'Etihad Stadium',
    venueAddress: 'Rowsley Street',
    venueCity: 'Manchester',
    venueCapacity: 55097,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/555.png',
  },
  {
    id: '51',
    name: 'Brighton',
    code: 'BRI',
    country: 'England',
    founded: 1901,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/51.png',
    venueId: '508',
    venueName: 'American Express Stadium',
    venueAddress: 'Village Way',
    venueCity: 'Falmer, East Sussex',
    venueCapacity: 31872,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/508.png',
  },
  {
    id: '52',
    name: 'Crystal Palace',
    code: 'CRY',
    country: 'England',
    founded: 1861,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/52.png',
    venueId: '525',
    venueName: 'Selhurst Park',
    venueAddress: 'Holmesdale Road',
    venueCity: 'London',
    venueCapacity: 26309,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/525.png',
  },
  {
    id: '55',
    name: 'Brentford',
    code: 'BRE',
    country: 'England',
    founded: 1889,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/55.png',
    venueId: '10503',
    venueName: 'Gtech Community Stadium',
    venueAddress: '166 Lionel Rd N, Brentford',
    venueCity: 'Brentford, Middlesex',
    venueCapacity: 17250,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/10503.png',
  },
  {
    id: '62',
    name: 'Sheffield Utd',
    code: 'SHE',
    country: 'England',
    founded: 1889,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/62.png',
    venueId: '581',
    venueName: 'Bramall Lane',
    venueAddress: 'Bramall Lane',
    venueCity: 'Sheffield',
    venueCapacity: 32702,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/581.png',
  },
  {
    id: '65',
    name: 'Nottingham Forest',
    code: 'NOT',
    country: 'England',
    founded: 1865,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/65.png',
    venueId: '566',
    venueName: 'The City Ground',
    venueAddress: 'Pavilion Road',
    venueCity: 'Nottingham, Nottinghamshire',
    venueCapacity: 30576,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/566.png',
  },
  {
    id: '66',
    name: 'Aston Villa',
    code: 'AST',
    country: 'England',
    founded: 1874,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/66.png',
    venueId: '495',
    venueName: 'Villa Park',
    venueAddress: 'Trinity Road',
    venueCity: 'Birmingham',
    venueCapacity: 42824,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/495.png',
  },
  {
    id: '1359',
    name: 'Luton',
    code: 'LUT',
    country: 'England',
    founded: 1885,
    national: false,
    logo: 'https://media.api-sports.io/football/teams/1359.png',
    venueId: '551',
    venueName: 'Kenilworth Road',
    venueAddress: '1 Maple Road',
    venueCity: 'Luton, Bedfordshire',
    venueCapacity: 11500,
    venueSurface: 'grass',
    venueImage: 'https://media.api-sports.io/football/venues/551.png',
  },
];

async function injectClub(club) {
  try {
    const result = await client.models.StaticLeagues.create(club);
    console.log(`✅ Club injecté : ${club.name} (${club.code})`);
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Erreur pour ${club.name}:`, error.message || error);
    return { success: false, error };
  }
}

async function main() {
  console.log('🚀 Injection des clubs Premier League via Amplify...');
  console.log(`📊 Nombre de clubs à injecter : ${clubs.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (const club of clubs) {
    const result = await injectClub(club);
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }

    // Petit délai entre les insertions
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n📈 Résultats :');
  console.log(`✅ Clubs injectés avec succès : ${successCount}`);
  console.log(`❌ Erreurs : ${errorCount}`);
  console.log(`📊 Total traité : ${successCount + errorCount}/${clubs.length}`);

  if (errorCount === 0) {
    console.log('\n🎉 Injection terminée avec succès !');
  } else {
    console.log('\n⚠️  Injection terminée avec des erreurs.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Erreur fatale :', error);
  process.exit(1);
});
