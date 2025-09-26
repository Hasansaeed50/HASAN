# Daily Tasks App (مهامي اليومية)

## Overview

A full-stack task management application built with React and Express, featuring Arabic language support and right-to-left (RTL) text direction. The application allows users to create, view, and delete daily tasks with a clean, modern interface using shadcn/ui components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Arabic font support (Noto Sans Arabic)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration for development and production
- **Internationalization**: Built-in RTL support with Arabic language interface

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Data Storage**: Currently using in-memory storage (MemStorage) with interface for easy database migration
- **API Design**: RESTful API endpoints with JSON responses
- **Validation**: Zod schemas for request validation and type safety
- **Error Handling**: Centralized error handling middleware with localized error messages

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Type-safe database schema with task entity containing id, text, and createdAt fields
- **Migrations**: Drizzle Kit for database schema migrations
- **Current Implementation**: In-memory storage with interface abstraction for easy database integration

### Authentication and Authorization
- **Current State**: No authentication implemented
- **Session Management**: Basic session handling setup with connect-pg-simple for future PostgreSQL session storage

### Development Tools and Configuration
- **TypeScript**: Strict configuration with path mapping for clean imports
- **ESLint**: Code quality and consistency enforcement
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **Development Server**: Vite dev server with HMR and custom middleware integration
- **Build Process**: Separate client and server builds with esbuild for server bundling

## External Dependencies

### Database
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database schema management and migrations

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Conditional CSS class name utility

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Form validation resolvers
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: React support for Vite
- **esbuild**: Fast JavaScript bundler for server builds
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-***: Replit-specific development tools and debugging

### Validation and Type Safety
- **zod**: Runtime type validation and schema definition
- **drizzle-zod**: Integration between Drizzle ORM and Zod for schema validation