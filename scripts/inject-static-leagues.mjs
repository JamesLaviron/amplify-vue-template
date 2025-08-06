#!/usr/bin/env node

import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';

// Configuration DynamoDB
const client = new DynamoDBClient({
  region: 'eu-west-3', // Région correcte
  credentials: fromIni({ profile: 'default' }), // Ajustez selon votre profil AWS
});

const TABLE_NAME = 'static-leagues';

// Données des clubs Premier League (format DynamoDB natif)
const clubs = [
  {
    id: { S: '34' },
    name: { S: 'Newcastle' },
    code: { S: 'NEW' },
    country: { S: 'England' },
    founded: { N: '1892' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/34.png' },
    venue: {
      M: {
        id: { N: '562' },
        name: { S: "St. James' Park" },
        address: { S: "St. James' Street" },
        city: { S: 'Newcastle upon Tyne' },
        capacity: { N: '52758' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/562.png' },
      },
    },
  },
  {
    id: { S: '35' },
    name: { S: 'Bournemouth' },
    code: { S: 'BOU' },
    country: { S: 'England' },
    founded: { N: '1899' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/35.png' },
    venue: {
      M: {
        id: { N: '504' },
        name: { S: 'Vitality Stadium' },
        address: { S: 'Dean Court, Kings Park' },
        city: { S: 'Bournemouth, Dorset' },
        capacity: { N: '12000' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/504.png' },
      },
    },
  },
  {
    id: { S: '36' },
    name: { S: 'Fulham' },
    code: { S: 'FUL' },
    country: { S: 'England' },
    founded: { N: '1879' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/36.png' },
    venue: {
      M: {
        id: { N: '535' },
        name: { S: 'Craven Cottage' },
        address: { S: 'Stevenage Road' },
        city: { S: 'London' },
        capacity: { N: '29589' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/535.png' },
      },
    },
  },
  {
    id: { S: '39' },
    name: { S: 'Wolves' },
    code: { S: 'WOL' },
    country: { S: 'England' },
    founded: { N: '1877' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/39.png' },
    venue: {
      M: {
        id: { N: '600' },
        name: { S: 'Molineux Stadium' },
        address: { S: 'Waterloo Road' },
        city: { S: 'Wolverhampton, West Midlands' },
        capacity: { N: '34624' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/600.png' },
      },
    },
  },
  {
    id: { S: '40' },
    name: { S: 'Liverpool' },
    code: { S: 'LIV' },
    country: { S: 'England' },
    founded: { N: '1892' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/40.png' },
    venue: {
      M: {
        id: { N: '550' },
        name: { S: 'Anfield' },
        address: { S: 'Anfield Road' },
        city: { S: 'Liverpool' },
        capacity: { N: '61276' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/550.png' },
      },
    },
  },
  {
    id: { S: '42' },
    name: { S: 'Arsenal' },
    code: { S: 'ARS' },
    country: { S: 'England' },
    founded: { N: '1886' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/42.png' },
    venue: {
      M: {
        id: { N: '494' },
        name: { S: 'Emirates Stadium' },
        address: { S: 'Hornsey Road' },
        city: { S: 'London' },
        capacity: { N: '60383' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/494.png' },
      },
    },
  },
  {
    id: { S: '44' },
    name: { S: 'Burnley' },
    code: { S: 'BUR' },
    country: { S: 'England' },
    founded: { N: '1882' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/44.png' },
    venue: {
      M: {
        id: { N: '512' },
        name: { S: 'Turf Moor' },
        address: { S: 'Harry Potts Way' },
        city: { S: 'Burnley' },
        capacity: { N: '22546' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/512.png' },
      },
    },
  },
  {
    id: { S: '45' },
    name: { S: 'Everton' },
    code: { S: 'EVE' },
    country: { S: 'England' },
    founded: { N: '1878' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/45.png' },
    venue: {
      M: {
        id: { N: '22033' },
        name: { S: 'Hill Dickinson Stadium' },
        address: { S: '35 Regent Road, Bramley-Moore Dock, Vauxhall' },
        city: { S: 'Liverpool, Merseyside' },
        capacity: { N: '52888' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/22033.png' },
      },
    },
  },
  {
    id: { S: '47' },
    name: { S: 'Tottenham' },
    code: { S: 'TOT' },
    country: { S: 'England' },
    founded: { N: '1882' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/47.png' },
    venue: {
      M: {
        id: { N: '593' },
        name: { S: 'Tottenham Hotspur Stadium' },
        address: { S: 'Bill Nicholson Way, 748 High Road' },
        city: { S: 'London' },
        capacity: { N: '62850' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/593.png' },
      },
    },
  },
  {
    id: { S: '48' },
    name: { S: 'West Ham' },
    code: { S: 'WES' },
    country: { S: 'England' },
    founded: { N: '1895' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/48.png' },
    venue: {
      M: {
        id: { N: '598' },
        name: { S: 'London Stadium' },
        address: { S: 'Marshgate Lane, Stratford' },
        city: { S: 'London' },
        capacity: { N: '64472' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/598.png' },
      },
    },
  },
  {
    id: { S: '49' },
    name: { S: 'Chelsea' },
    code: { S: 'CHE' },
    country: { S: 'England' },
    founded: { N: '1905' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/49.png' },
    venue: {
      M: {
        id: { N: '519' },
        name: { S: 'Stamford Bridge' },
        address: { S: 'Fulham Road' },
        city: { S: 'London' },
        capacity: { N: '41841' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/519.png' },
      },
    },
  },
  {
    id: { S: '50' },
    name: { S: 'Manchester City' },
    code: { S: 'MAC' },
    country: { S: 'England' },
    founded: { N: '1880' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/50.png' },
    venue: {
      M: {
        id: { N: '555' },
        name: { S: 'Etihad Stadium' },
        address: { S: 'Rowsley Street' },
        city: { S: 'Manchester' },
        capacity: { N: '55097' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/555.png' },
      },
    },
  },
  {
    id: { S: '51' },
    name: { S: 'Brighton' },
    code: { S: 'BRI' },
    country: { S: 'England' },
    founded: { N: '1901' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/51.png' },
    venue: {
      M: {
        id: { N: '508' },
        name: { S: 'American Express Stadium' },
        address: { S: 'Village Way' },
        city: { S: 'Falmer, East Sussex' },
        capacity: { N: '31872' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/508.png' },
      },
    },
  },
  {
    id: { S: '52' },
    name: { S: 'Crystal Palace' },
    code: { S: 'CRY' },
    country: { S: 'England' },
    founded: { N: '1861' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/52.png' },
    venue: {
      M: {
        id: { N: '525' },
        name: { S: 'Selhurst Park' },
        address: { S: 'Holmesdale Road' },
        city: { S: 'London' },
        capacity: { N: '26309' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/525.png' },
      },
    },
  },
  {
    id: { S: '55' },
    name: { S: 'Brentford' },
    code: { S: 'BRE' },
    country: { S: 'England' },
    founded: { N: '1889' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/55.png' },
    venue: {
      M: {
        id: { N: '10503' },
        name: { S: 'Gtech Community Stadium' },
        address: { S: '166 Lionel Rd N, Brentford' },
        city: { S: 'Brentford, Middlesex' },
        capacity: { N: '17250' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/10503.png' },
      },
    },
  },
  {
    id: { S: '62' },
    name: { S: 'Sheffield Utd' },
    code: { S: 'SHE' },
    country: { S: 'England' },
    founded: { N: '1889' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/62.png' },
    venue: {
      M: {
        id: { N: '581' },
        name: { S: 'Bramall Lane' },
        address: { S: 'Bramall Lane' },
        city: { S: 'Sheffield' },
        capacity: { N: '32702' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/581.png' },
      },
    },
  },
  {
    id: { S: '65' },
    name: { S: 'Nottingham Forest' },
    code: { S: 'NOT' },
    country: { S: 'England' },
    founded: { N: '1865' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/65.png' },
    venue: {
      M: {
        id: { N: '566' },
        name: { S: 'The City Ground' },
        address: { S: 'Pavilion Road' },
        city: { S: 'Nottingham, Nottinghamshire' },
        capacity: { N: '30576' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/566.png' },
      },
    },
  },
  {
    id: { S: '66' },
    name: { S: 'Aston Villa' },
    code: { S: 'AST' },
    country: { S: 'England' },
    founded: { N: '1874' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/66.png' },
    venue: {
      M: {
        id: { N: '495' },
        name: { S: 'Villa Park' },
        address: { S: 'Trinity Road' },
        city: { S: 'Birmingham' },
        capacity: { N: '42824' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/495.png' },
      },
    },
  },
  {
    id: { S: '1359' },
    name: { S: 'Luton' },
    code: { S: 'LUT' },
    country: { S: 'England' },
    founded: { N: '1885' },
    national: { BOOL: false },
    logo: { S: 'https://media.api-sports.io/football/teams/1359.png' },
    venue: {
      M: {
        id: { N: '551' },
        name: { S: 'Kenilworth Road' },
        address: { S: '1 Maple Road' },
        city: { S: 'Luton, Bedfordshire' },
        capacity: { N: '11500' },
        surface: { S: 'grass' },
        image: { S: 'https://media.api-sports.io/football/venues/551.png' },
      },
    },
  },
];

async function injectClub(club) {
  try {
    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: club,
      // Évite d'écraser si l'item existe déjà
      ConditionExpression: 'attribute_not_exists(id)',
    });

    await client.send(command);
    console.log(`✅ Club injecté : ${club.name.S} (${club.code.S})`);
    return true;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      console.log(`⚠️  Club déjà existant : ${club.name.S} (${club.code.S})`);
      return false;
    } else {
      console.error(`❌ Erreur pour ${club.name.S}:`, error.message);
      throw error;
    }
  }
}

async function main() {
  console.log(`🚀 Injection des clubs Premier League dans la table ${TABLE_NAME}...`);
  console.log(`📊 Nombre de clubs à injecter : ${clubs.length}`);

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const club of clubs) {
    try {
      const injected = await injectClub(club);
      if (injected) {
        successCount++;
      } else {
        skippedCount++;
      }

      // Délai pour éviter le throttling DynamoDB
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      errorCount++;
      console.error(`❌ Erreur fatale pour ${club.name.S}:`, error);
    }
  }

  console.log('\n📈 Résultats :');
  console.log(`✅ Clubs injectés avec succès : ${successCount}`);
  console.log(`⚠️  Clubs déjà existants : ${skippedCount}`);
  console.log(`❌ Erreurs : ${errorCount}`);
  console.log(`📊 Total traité : ${successCount + skippedCount + errorCount}/${clubs.length}`);

  if (errorCount === 0) {
    console.log('\n🎉 Injection terminée avec succès !');
  } else {
    console.log('\n⚠️  Injection terminée avec des erreurs.');
    process.exit(1);
  }
}

// Exécution du script
main().catch(error => {
  console.error('💥 Erreur fatale :', error);
  process.exit(1);
});
