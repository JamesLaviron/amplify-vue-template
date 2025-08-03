# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs type-check and build-only in parallel)
- `npm run type-check` - Run TypeScript type checking with vue-tsc
- `npm run build-only` - Build without type checking
- `npm run preview` - Preview production build locally

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
- Sample data script available in `src/scripts/seedData.ts`
- Includes Premier League teams and players with realistic stats
- Run after backend deployment to populate the database

### Deployment
- Frontend builds to `dist/` directory
- Backend deployment uses `ampx pipeline-deploy`
- Build configuration in `amplify.yml` for AWS Amplify hosting