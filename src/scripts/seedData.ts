import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'

const client = generateClient<Schema>()

// Sample Premier League teams
const sampleTeams = [
  { name: 'Manchester United', shortName: 'MUN', code: 'MUN', league: 'Premier League' },
  { name: 'Manchester City', shortName: 'MCI', code: 'MCI', league: 'Premier League' },
  { name: 'Liverpool', shortName: 'LIV', code: 'LIV', league: 'Premier League' },
  { name: 'Arsenal', shortName: 'ARS', code: 'ARS', league: 'Premier League' },
  { name: 'Chelsea', shortName: 'CHE', code: 'CHE', league: 'Premier League' },
  { name: 'Tottenham Hotspur', shortName: 'TOT', code: 'TOT', league: 'Premier League' },
  { name: 'Newcastle United', shortName: 'NEW', code: 'NEW', league: 'Premier League' },
  { name: 'Brighton & Hove Albion', shortName: 'BRI', code: 'BRI', league: 'Premier League' },
]

// Sample players
const samplePlayers = [
  // Manchester United
  { name: 'André Onana', position: 'GK', team: 'MUN', price: 5.0, totalPoints: 45, form: 6.2 },
  { name: 'Harry Maguire', position: 'DEF', team: 'MUN', price: 5.5, totalPoints: 38, form: 5.8 },
  { name: 'Bruno Fernandes', position: 'MID', team: 'MUN', price: 8.5, totalPoints: 95, form: 8.1 },
  { name: 'Marcus Rashford', position: 'FWD', team: 'MUN', price: 9.0, totalPoints: 88, form: 7.9 },
  
  // Manchester City
  { name: 'Ederson', position: 'GK', team: 'MCI', price: 5.5, totalPoints: 52, form: 6.8 },
  { name: 'Rúben Dias', position: 'DEF', team: 'MCI', price: 6.0, totalPoints: 56, form: 7.2 },
  { name: 'Kevin De Bruyne', position: 'MID', team: 'MCI', price: 12.0, totalPoints: 142, form: 9.2 },
  { name: 'Erling Haaland', position: 'FWD', team: 'MCI', price: 14.0, totalPoints: 198, form: 9.8 },
  
  // Liverpool
  { name: 'Alisson', position: 'GK', team: 'LIV', price: 5.5, totalPoints: 48, form: 6.5 },
  { name: 'Virgil van Dijk', position: 'DEF', team: 'LIV', price: 6.5, totalPoints: 62, form: 7.5 },
  { name: 'Mohamed Salah', position: 'FWD', team: 'LIV', price: 13.0, totalPoints: 165, form: 9.4 },
  { name: 'Sadio Mané', position: 'FWD', team: 'LIV', price: 10.5, totalPoints: 124, form: 8.6 },
  
  // Arsenal
  { name: 'Aaron Ramsdale', position: 'GK', team: 'ARS', price: 5.0, totalPoints: 42, form: 6.0 },
  { name: 'William Saliba', position: 'DEF', team: 'ARS', price: 5.5, totalPoints: 58, form: 7.1 },
  { name: 'Martin Ødegaard', position: 'MID', team: 'ARS', price: 8.0, totalPoints: 86, form: 7.8 },
  { name: 'Bukayo Saka', position: 'FWD', team: 'ARS', price: 9.5, totalPoints: 112, form: 8.4 },
]

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Create teams first
    console.log('Creating teams...')
    const createdTeams = []
    
    for (const teamData of sampleTeams) {
      const { data: team } = await client.models.FootballTeam.create(teamData)
      if (team) {
        createdTeams.push(team)
        console.log(`✅ Created team: ${team.name}`)
      }
    }
    
    // Create a team lookup map
    const teamLookup: { [key: string]: string } = {}
    createdTeams.forEach(team => {
      if (team) {
        teamLookup[team.code] = team.id
      }
    })
    
    // Create players
    console.log('Creating players...')
    for (const playerData of samplePlayers) {
      const teamId = teamLookup[playerData.team]
      if (teamId) {
        const { data: player } = await client.models.Player.create({
          name: playerData.name,
          position: playerData.position as any,
          teamId,
          price: playerData.price,
          totalPoints: playerData.totalPoints,
          form: playerData.form,
          availability: 'AVAILABLE'
        })
        if (player) {
          console.log(`✅ Created player: ${player.name} (${playerData.team})`)
        }
      }
    }
    
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seeding if this script is executed directly
if (typeof window === 'undefined') {
  seedDatabase().catch(console.error)
}