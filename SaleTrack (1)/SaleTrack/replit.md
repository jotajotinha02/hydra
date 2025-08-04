# Sales Management System

## Overview

This is a full-stack sales management application built with React, Express, and PostgreSQL. The system allows users to register sales transactions, view sales data through a modern interface, and perform basic CRUD operations. The application features a Portuguese-language interface optimized for sales tracking and includes filtering capabilities, data visualization, and real-time updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **UI Library**: Shadcn/UI components built on Radix UI primitives for accessible, customizable interface elements
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for consistent theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management, caching, and synchronization
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for type safety across the entire stack
- **API Design**: RESTful endpoints following conventional patterns (/api/sales for CRUD operations)
- **Storage Abstraction**: Interface-based storage system allowing for different implementations (currently in-memory, designed for database expansion)
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Logging**: Custom logging middleware for API request/response tracking

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM for type-safe database operations
- **ORM**: Drizzle with schema-first approach for database modeling and migrations
- **Schema**: Centralized schema definitions in shared directory for frontend/backend consistency
- **Validation**: Zod schemas for runtime validation matching database structure
- **Current Implementation**: In-memory storage with Map-based data structures for development/testing

### Database Schema Design
- **Users Table**: ID (UUID), username (unique), password for basic authentication structure
- **Sales Table**: ID (UUID), user reference, quantity (integer), value (decimal), timestamp
- **Relationships**: Sales linked to users through username field rather than foreign key constraints
- **Data Types**: Proper decimal handling for monetary values, timestamps with timezone support

### API Structure
- **GET /api/sales**: Retrieve all sales records with date-based sorting
- **POST /api/sales**: Create new sale with validation
- **DELETE /api/sales/:id**: Remove specific sale record
- **Error Responses**: Consistent JSON error format with appropriate HTTP status codes
- **Request Validation**: Zod schema validation for all incoming data

### Authentication Architecture
- **Current State**: Basic user schema prepared but not implemented
- **Designed For**: Session-based authentication with PostgreSQL session storage
- **Security**: Password hashing and secure session management ready for implementation

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL provider configured for production deployment
- **Connection**: Environment-based DATABASE_URL configuration for flexible deployment

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **Replit Integration**: Custom Vite plugins for Replit development environment support
- **Error Handling**: Replit-specific error overlay for enhanced development experience

### UI Component Library
- **Radix UI**: Complete set of accessible component primitives
- **Lucide React**: Icon library for consistent visual elements
- **Class Variance Authority**: Type-safe component variant management
- **Date-fns**: Date manipulation and formatting utilities

### Build and Development
- **TypeScript**: Full-stack type safety with shared type definitions
- **ESBuild**: Fast bundling for server-side code
- **PostCSS**: CSS processing with Tailwind CSS integration
- **Path Aliases**: Organized import structure with @ aliases for cleaner code organization

### Monitoring and Development
- **Custom Logging**: Request/response logging with performance metrics
- **Hot Reload**: Vite-powered development with instant updates
- **Error Boundaries**: React error handling for robust user experience