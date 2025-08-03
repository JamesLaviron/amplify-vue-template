import fs from 'fs';
import path from 'path';

export interface TeamRecord {
  id: string;
  apiId: string;
  code: string;
  country: string;
  founded: string;
  logo: string;
  name: string;
  national: string;
  venueAddress: string;
  venueCapacity: string;
  venueCity: string;
  venueId: string;
  venueImage: string;
  venueName: string;
  venueSurface: string;
}

export interface PlayerRecord {
  id: string;
  age: string;
  apiId: string;
  appearances: string;
  assists: string;
  birthCountry: string;
  birthDate: string;
  birthPlace: string;
  fantasyPoints: string;
  fantasyPrice: string;
  firstname: string;
  goals: string;
  height: string;
  injuryDetails: string;
  isInjured: string;
  lastname: string;
  minutes: string;
  name: string;
  nationality: string;
  number: string;
  photo: string;
  position: string;
  rating: string;
  redCards: string;
  teamApiId: string;
  teamName: string;
  weight: string;
  yellowCards: string;
}

export function parseCsvFile<T>(filePath: string): T[] {
  const fullPath = path.resolve(filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  const lines = fileContent.trim().split('\n');

  if (lines.length < 2) {
    throw new Error(`CSV file ${filePath} must have at least a header and one data row`);
  }

  // Parse header
  const header = parseCsvLine(lines[0]);

  // Parse data rows
  const records: T[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length !== header.length) {
      console.warn(
        `Skipping malformed line ${i + 1} in ${filePath}: expected ${header.length} columns, got ${values.length}`
      );
      continue;
    }

    const record: any = {};
    for (let j = 0; j < header.length; j++) {
      record[header[j]] = values[j];
    }
    records.push(record);
  }

  return records;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Add the last field
  result.push(current);

  return result;
}

export function convertToStaticLeague(team: TeamRecord) {
  return {
    apiId: team.apiId,
    name: team.name,
    code: team.code,
    country: team.country,
    founded: parseInt(team.founded) || 0,
    national: team.national.toLowerCase() === 'true',
    logo: team.logo,
    venueId: team.venueId,
    venueName: team.venueName,
    venueAddress: team.venueAddress,
    venueCity: team.venueCity,
    venueCapacity: parseInt(team.venueCapacity) || 0,
    venueSurface: team.venueSurface,
    venueImage: team.venueImage,
  };
}

export function convertToStaticPlayer(player: PlayerRecord) {
  return {
    apiId: player.apiId,
    name: player.name,
    firstname: player.firstname,
    lastname: player.lastname,
    age: parseInt(player.age) || 0,
    birthDate: player.birthDate,
    birthPlace: player.birthPlace,
    birthCountry: player.birthCountry,
    nationality: player.nationality,
    height: player.height,
    weight: player.weight,
    photo: player.photo,
    teamApiId: player.teamApiId,
    teamName: player.teamName,
    position: player.position,
    number: parseInt(player.number) || 0,
    appearances: parseInt(player.appearances) || 0,
    goals: parseInt(player.goals) || 0,
    assists: parseInt(player.assists) || 0,
    yellowCards: parseInt(player.yellowCards) || 0,
    redCards: parseInt(player.redCards) || 0,
    minutes: parseInt(player.minutes) || 0,
    rating: player.rating,
    fantasyPrice: parseFloat(player.fantasyPrice) || 4.0,
    fantasyPoints: parseInt(player.fantasyPoints) || 0,
    isInjured: player.isInjured.toLowerCase() === 'true',
    injuryDetails: player.injuryDetails,
  };
}

export function convertToFootballTeam(team: TeamRecord) {
  return {
    name: team.name,
    shortName: team.code,
    code: team.code,
    league: 'Premier League',
    logoUrl: team.logo,
  };
}

export function convertToPlayer(player: PlayerRecord, teamId: string) {
  // Map position to the enum values used in the schema
  const positionMap: { [key: string]: 'GK' | 'DEF' | 'MID' | 'FWD' } = {
    Goalkeeper: 'GK',
    Defender: 'DEF',
    Midfielder: 'MID',
    Attacker: 'FWD',
  };

  const availability: 'AVAILABLE' | 'INJURED' | 'SUSPENDED' | 'DOUBTFUL' =
    player.isInjured.toLowerCase() === 'true' ? 'INJURED' : 'AVAILABLE';
  const position = positionMap[player.position] || 'MID';

  return {
    name: player.name,
    position,
    teamId,
    price: parseFloat(player.fantasyPrice) || 4.0,
    totalPoints: parseInt(player.fantasyPoints) || 0,
    form: parseFloat(player.rating) || 6.0,
    availability,
    photoUrl: player.photo,
  };
}
