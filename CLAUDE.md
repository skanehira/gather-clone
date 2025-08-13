# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Gather.town clone featuring customizable spaces and proximity-based video chat, built as a full-stack TypeScript web application.

## Architecture

### Frontend (Next.js)
- **Framework**: Next.js with TypeScript, React 18.2.0
- **UI**: TailwindCSS for styling, Headless UI for components
- **Game Engine**: Pixi.js v8 for 2D rendering and game mechanics
- **Video Chat**: Agora RTC for proximity-based video/audio
- **Real-time Communication**: Socket.io-client for multiplayer networking
- **Authentication**: Supabase Auth with SSR support
- **Path**: `@/` alias maps to frontend root directory

### Backend (Express/Node.js)
- **Server**: Express with Socket.io for WebSocket connections
- **Database**: Supabase (PostgreSQL) for persistence
- **Authentication**: Supabase Auth verification
- **Session Management**: Custom session manager for realm sessions
- **Real-time Updates**: Supabase Realtime subscriptions for realm changes

### Key Architectural Components

1. **Realm System**: Virtual spaces users can create, customize, and join
2. **Room-based Navigation**: Realms contain multiple rooms with teleportation
3. **Tile-based Movement**: Grid-based movement system with pathfinding
4. **Proximity System**: Audio/video chat based on player distance
5. **Editor Mode**: Tileset-based map editor for realm customization
6. **Player Management**: User presence, movement sync, and skin customization

## Common Development Commands

### Frontend (in `frontend/` directory)
```bash
npm run dev        # Start development server (default: localhost:3000)
npm run build      # Build production bundle
npm run start      # Start production server
```

### Backend (in `backend/` directory)
```bash
npm run dev        # Start development server with ts-node (default: port 3001)
npm run build      # Compile TypeScript to JavaScript
npm run start      # Start production server from compiled code
```

## Environment Configuration

### Backend `.env`
- `FRONTEND_URL`: Frontend URL for CORS
- `SUPABASE_URL`: Supabase project URL
- `SERVICE_ROLE`: Supabase service role key

### Frontend `.env.local`
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_BASE_URL`: Frontend base URL
- `NEXT_PUBLIC_BACKEND_URL`: Backend server URL
- `SERVICE_ROLE`: Supabase service role key
- `NEXT_PUBLIC_AGORA_APP_ID`: Agora application ID
- `APP_CERTIFICATE`: Agora app certificate

## Core Systems

### Socket Events Flow
1. Client connects with auth token → Backend validates via Supabase
2. Client joins realm → Backend creates/joins session, broadcasts to room
3. Movement/actions → Backend validates and broadcasts to relevant players
4. Realm updates → Supabase real-time triggers session termination if needed

### Pixi.js Game Architecture
- `PlayApp`: Main game application for playing realms
- `EditorApp`: Map editor application for realm customization
- `Player`: Character sprite management with animation states
- Pathfinding system for click-to-move navigation

### State Management
- Server maintains authoritative state for all players in sessions
- Client-side prediction with server reconciliation
- Supabase for persistent realm/user data
- Socket.io for ephemeral game state

## Testing Approach

Currently, no automated tests are configured. When implementing tests:
- Frontend: Consider Jest + React Testing Library for components
- Backend: Consider Jest for unit/integration tests
- E2E: Consider Playwright or Cypress for full flow testing

## TypeScript Configuration
- Frontend: Strict mode enabled, Next.js plugin, JSX preserve
- Backend: Target ES2020, CommonJS modules, strict mode
- Both use `esModuleInterop` for better module compatibility