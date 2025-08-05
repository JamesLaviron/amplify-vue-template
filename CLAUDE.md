# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs type-check and build-only in parallel)
- `npm run type-check` - Run TypeScript type checking with vue-tsc
- `npm run build-only` - Build without type checking
- `npm run preview` - Preview production build locally

## Code Quality & Linting Commands

- `npm run lint` - Run ESLint and fix auto-fixable issues
- `npm run lint:check` - Run ESLint without fixing (check only)
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly
- Pre-commit hooks automatically run linting and formatting on staged files

## AWS Amplify Backend Commands

- `npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID` - Deploy backend resources
- Backend resources are defined in `amplify/` directory

## Fantasy Football Application

This is a comprehensive fantasy football (soccer) web application built with AWS Amplify, Vue.js, and TypeScript.

### Core Features

- **User Authentication**: Email-based authentication with user profiles
- **Fantasy Team Management**: Create and manage fantasy teams with formations
- **Player Database**: Browse and add real football players to your team
- **League System**: Create private leagues or join existing ones
- **Live Scores**: Real-time match updates and scores
- **Scoring System**: Points based on real player performance
- **Real-time Updates**: GraphQL subscriptions for live data

## Architecture Overview

This is an AWS Amplify Vue.js fantasy football application with the following architecture:

### Frontend (Vue 3 + TypeScript)

- **Framework**: Vue 3 with Composition API and TypeScript
- **Build tool**: Vite with `@vitejs/plugin-vue`
- **Entry point**: `src/main.ts` configures Amplify and mounts the app
- **Main component**: `src/App.vue` handles authentication and renders FantasyDashboard
- **Components**: FantasyDashboard, FantasyTeamManager, PlayerList, LeagueStandings, LiveScores
- **Styling**: CSS files in `src/assets/`

### Backend (AWS Amplify Gen 2)

- **Configuration**: `amplify/backend.ts` defines the backend using `defineBackend()`
- **Authentication**: Email-based auth with required username defined in `amplify/auth/resource.ts`
- **Data**: GraphQL API with DynamoDB, comprehensive schema in `amplify/data/resource.ts`
- **Data Models**: UserProfile, FootballTeam, Player, FantasyTeam, FantasySelection, GameweekScore, League, LeagueMembership, MatchUpdate
- **Authorization**: User pool authentication with owner-based access control
- **Real-time**: GraphQL subscriptions for live match updates

### Key Integration Points

- Amplify configuration loaded from `amplify_outputs.json` in `src/main.ts`
- Data client generation using `generateClient<Schema>()` pattern in components
- AWS services: Cognito (auth), AppSync (GraphQL), DynamoDB (database)
- Real-time subscriptions for live match updates using GraphQL subscriptions

### Data Seeding

- **Event-Driven Lambda Seeding** (Production approach):
  - Seeding is triggered automatically during league creation workflows
  - Uses secure server-side AWS Lambda function with API key stored in environment
  - No admin buttons or manual triggers exposed to users
  - Programmatically invoked via `seedingService.seedPremierLeagueData()`

- **Development Testing**:
  - Use `seedingService.seedTestData()` for limited scope testing (4 teams, minimal players)
  - Function checks if data already exists to avoid duplicate seeding

- **Security Features**:
  - API keys never exposed to client-side
  - Requires user authentication via Cognito
  - Lambda function has proper IAM permissions for DynamoDB access
  - Seeding operations are logged and monitored

### API-Football Integration

- **IMPORTANT**: Always use `v3.football.api-sports.io` as the base URL for API-Football requests
- **API Key**: Set in environment variables (see Environment Variables section below)
- Premier League ID: `39`
- Use 2023 season data (2024 is not accessible)
- Server-side function handles rate limiting and comprehensive data fetching

### Environment Variables

**Required for data seeding:**

1. Copy `.env.example` to `.env`
2. Get API key from [RapidAPI API-Football](https://rapidapi.com/api-sports/api/api-football)
3. Set environment variable:
   ```bash
   API_FOOTBALL_KEY=your_api_key_here
   ```

**Usage in different environments:**

- **AWS Lambda (Production)**: Uses `API_FOOTBALL_KEY` environment variable securely
- **Node.js scripts (Development)**: Uses `API_FOOTBALL_KEY` environment variable

### Deployment

- Frontend builds to `dist/` directory
- Backend deployment uses `ampx pipeline-deploy`
- Build configuration in `amplify.yml` for AWS Amplify hosting
