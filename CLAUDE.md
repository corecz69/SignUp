# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This is a **Sign Language Learning Application** - a free educational tool being developed for a Czech high school that teaches sign language interpreters. The application aims to replace current YouTube-based learning materials with a searchable, organized platform.

### Current Problem
- School currently uses YouTube videos where teachers demonstrate signs
- No search functionality or organized structure
- Difficult to find specific signs or categories

### Solution Goals
- Upload and organize sign language videos with Czech translations
- Implement advanced search functionality
- Future feature: Search signs by hand movement patterns (finger direction, hand position, etc.)
- Create a comprehensive, accessible learning platform

This is a passion project - developed pro bono by a developer for his former school.

## Project Architecture

This is a full-stack application with separate frontend and backend:

- **Frontend (`fe/`)**: React application using TanStack Router, Material-UI, Vite, TypeScript
- **Backend (`be/`)**: Spring Boot application with Java 21, JPA, PostgreSQL

### Frontend Structure
- Built with React 19, TanStack Router for routing, Material-UI for components
- Uses file-based routing in `src/routes/` directory
- Components are organized in `src/components/` with card components for different entities
- Vite for bundling and dev server, TypeScript for type safety
- Testing with Vitest and Testing Library

### Backend Structure
- Spring Boot 3.5.4 with Java 21
- Layered architecture: Controllers → Services → Repositories → Entities
- Domain entities: User, Sign, SignComponent, Category, Subject, Classroom, PrivateCollection
- Uses DTOs for API communication and Mappers for conversion
- PostgreSQL database with JPA/Hibernate

## Development Commands

### Frontend (in `fe/` directory)
```bash
# Development server
npm run dev
npm run start  # alternative

# Build for production
npm run build

# Run tests
npm run test

# Preview production build
npm run serve
```

### Backend (in `be/` directory)
```bash
# Run application
./gradlew bootRun

# Build
./gradlew build

# Run tests
./gradlew test

# Start database
docker compose up db
```

## Database Setup
The backend requires PostgreSQL. Use Docker Compose to start the database:
```bash
cd be/
docker compose up db
```

Database configuration:
- Database: `appdb`
- User: `user`
- Password: `plsdonthackme`
- Port: `5432`

## Key Patterns

### Frontend
- File-based routing with TanStack Router (routes auto-generated in `routeTree.gen.ts`)
- Component cards for entity display in `src/components/cards/`
- Material-UI theming and components
- Path alias `@/*` maps to `./src/*`

### Backend
- Service layer with validation, mapping, and business logic
- Universal base classes: `EntityService`, `NamedEntityService`, `EntityController`
- DTOs for Create, Update, GetList, GetDetail operations
- Exception handling with `GlobalExceptionHandler`
- File storage service for video uploads

## Domain Context

### Key Entities
- **Sign**: Individual sign language gestures with video and description
- **SignComponent**: Components that make up signs (hand shapes, movements, positions)
- **Category**: Thematic grouping of signs (e.g., colors, numbers, emotions)
- **Subject**: School subjects or topics
- **User**: Students and teachers with different roles
- **Classroom**: Groups of students
- **PrivateCollection**: User-created sign collections

### Business Logic Focus
- Video storage and retrieval system for sign demonstrations
- Multi-dimensional search capabilities (text, categories, future: movement patterns)
- Educational workflow: organize, learn, practice sign language
- User management for school environment (students, teachers, administrators)

## Development Guidance

### For React Development
The developer is learning React and may benefit from guidance on:
- Component composition and reusability
- State management patterns (consider TanStack Query for server state)
- TypeScript best practices
- Testing strategies with Vitest
- Performance optimization for video content

### Recommended Next Steps
1. **Search Implementation**: Focus on robust search across signs and categories
2. **Video Optimization**: Implement efficient video streaming and storage
3. **User Experience**: Ensure accessibility for educational environment
4. **Data Organization**: Develop clear categorization and tagging system
5. **Future Advanced Search**: Plan database structure for movement pattern search

## Quick Setup Checklist

1. **Database**: `cd be && docker compose up db`
2. **Backend**: `cd be && ./gradlew bootRun`
3. **Frontend**: `cd fe && npm install && npm run dev`
4. **Access**: Frontend at http://localhost:3000

## Custom Commands

Store custom Claude Code commands in the `.claude/commands/` directory.

## Important Notes
- Frontend runs on port 3000
- `routeTree.gen.ts` is auto-generated by TanStack Router - do not edit manually
- Backend uses Lombok for reducing boilerplate
- No linting/formatting tools configured (ESLint, Prettier not present)
- This is an educational project - prioritize learning and best practices
- Consider accessibility features for sign language learning context