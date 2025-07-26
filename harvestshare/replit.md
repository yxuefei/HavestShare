# HarvestShare - Fruit Sharing Platform

## Overview

HarvestShare is a full-stack web application that connects landowners with fruit trees to harvesters, enabling collaborative fruit harvesting arrangements. The platform allows landowners to list their properties and harvesters to browse and apply for harvesting opportunities, with built-in messaging and deal management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Development**: Hot reload with Vite middleware integration

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless driver for PostgreSQL connections

## Key Components

### Authentication System
- Simple email/password authentication
- User types: landowner and harvester
- Session management with localStorage (client-side)
- No advanced security features (basic implementation)

### Property Management
- Property listing with location data (latitude/longitude)
- Image upload support for property photos
- Harvest date range specification
- Fruit type categorization and yield estimation
- Owner/harvester profit sharing configuration

### Application System
- Harvesters can apply to harvest specific properties
- Application includes experience and equipment information
- Preferred harvest dates selection
- Status tracking (pending, accepted, rejected)

### Deal Management
- Conversion of accepted applications to deals
- Deal status tracking (active, completed, cancelled)
- Actual yield recording vs estimated yield
- Revenue sharing calculations

### Messaging System
- Built-in messaging between landowners and harvesters
- Deal-specific conversation threads
- Real-time communication support

### Rating System
- User rating system for both landowners and harvesters
- Star-based ratings with review comments
- Average rating calculation and display

## Data Flow

### User Registration/Authentication
1. User submits registration form with user type selection
2. Server validates and creates user record
3. Client stores user data in localStorage
4. Subsequent requests include user context

### Property Listing Flow
1. Landowner creates property with location, dates, and details
2. Images uploaded and stored as base64 strings
3. Property becomes searchable by harvesters
4. Location data enables geographic search functionality

### Application Process
1. Harvester browses available properties with filtering
2. Application submitted with personal message and preferences
3. Landowner reviews applications and makes decisions
4. Accepted applications convert to active deals

### Deal Execution
1. Active deals track harvest progress
2. Messaging enables coordination between parties
3. Completion triggers yield recording and revenue calculation
4. Both parties can rate each other post-completion

## External Dependencies

### UI Components
- Radix UI primitives for accessible component foundations
- Lucide React for consistent iconography
- React Hook Form with Zod validation for form handling
- Date-fns for date manipulation and formatting

### Development Tools
- Vite with React plugin for fast development
- ESBuild for production bundling
- TypeScript for type safety across the stack
- Tailwind CSS with PostCSS for styling

### Database & ORM
- Drizzle ORM with PostgreSQL dialect
- Neon serverless driver for database connections
- Drizzle Kit for schema management and migrations

### Map Integration
- Leaflet.js for interactive maps (loaded dynamically)
- OpenStreetMap tiles for map data
- Custom map component for location selection and display

## Deployment Strategy

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Shared schemas and types available to both frontend and backend

### Environment Configuration
- Database URL required via `DATABASE_URL` environment variable
- Development vs production modes with different configurations
- Replit-specific integration for development environment

### Development Workflow
- `npm run dev` starts development server with hot reload
- `npm run build` creates production build
- `npm run start` runs production server
- `npm run db:push` deploys database schema changes

### File Structure
- `/client` - React frontend application
- `/server` - Express.js backend server
- `/shared` - Shared TypeScript types and schemas
- `/migrations` - Database migration files
- Root configuration files for tooling and build setup

The application uses a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack while maintaining clear separation of concerns between frontend and backend code.