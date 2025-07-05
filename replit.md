# BizShop - E-commerce Platform

## Overview

BizShop is a comprehensive e-commerce platform built for the Indian market that enables businesses to create professional online stores with minimal technical knowledge. The platform provides a complete solution including store management, product catalog, order processing, payment integration, and subscription billing.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Modern React application with TypeScript for type safety
- **Tailwind CSS + shadcn/ui**: Utility-first CSS framework with pre-built component library
- **Wouter**: Lightweight client-side routing
- **React Query**: Server state management and caching
- **React Hook Form + Zod**: Form handling with schema validation

### Backend Architecture
- **Node.js + Express**: RESTful API server with TypeScript
- **Drizzle ORM**: Type-safe database ORM for PostgreSQL
- **Passport.js**: Authentication middleware with local strategy
- **Session-based Authentication**: Server-side session management with PostgreSQL store

### Database Design
- **PostgreSQL**: Primary database with comprehensive schema
- **Multi-tenant Architecture**: Users can create multiple stores
- **Normalized Schema**: Separate tables for users, stores, products, orders, categories, etc.
- **Subscription Management**: Built-in billing and plan management

## Key Components

### Authentication System
- User registration with email verification
- Password reset functionality
- Role-based access control (customer, store_owner, admin)
- Session-based authentication with secure cookie management

### Store Management
- Multi-store support per user
- Template-based store creation (Boutique, Electronics, Fashion, etc.)
- Customizable branding (colors, fonts, logos)
- Store publishing and public link sharing

### Product Management
- Full CRUD operations for products
- Category and collection organization
- Image upload with file validation
- AI-powered content generation (optional)

### Order Processing
- Shopping cart functionality
- Customer checkout flow
- Order status management
- Email notifications for customers and store owners

### Payment Integration
- **Razorpay**: Primary payment processor for Indian market
- Live payment credentials configured
- Subscription billing with autopay
- Order verification and webhook handling

### Subscription System
- Multiple pricing tiers (Free, Pro, Premium)
- 14-day free trial for new users
- Monthly recurring billing
- Feature access control based on subscription level

## Data Flow

### Store Creation Flow
1. User selects template and customization options
2. Store data saved to database
3. Public store URL generated
4. Store can be published for customer access

### Order Processing Flow
1. Customer browses public store and adds items to cart
2. Customer provides shipping information at checkout
3. Payment processed through Razorpay
4. Order confirmation emails sent to customer and store owner
5. Store owner can track and update order status

### Subscription Flow
1. User signs up with 14-day free trial
2. Payment method collected for subscription
3. Monthly autopay billing through Razorpay
4. Feature access controlled by subscription status

## External Dependencies

### Payment Processing
- **Razorpay**: Indian payment gateway with live credentials
- Supports UPI, cards, wallets, and net banking
- Subscription billing and autopay functionality

### Email Services
- **SendGrid**: Transactional email delivery
- Order confirmations and notifications
- Email verification and password reset

### AI Features (Optional)
- **OpenAI GPT-4o**: AI-powered product description generation
- Requires OPENAI_API_KEY environment variable

### File Storage
- Local file upload handling
- Image validation and size limits
- Support for PNG, JPG, GIF formats

## Deployment Strategy

### Environment Configuration
- PostgreSQL database with connection pooling
- Environment variables for all sensitive data
- Separate development and production configurations

### Build Process
- Vite build for optimized frontend bundle
- ESBuild for server-side TypeScript compilation
- Static asset serving in production

### Security Measures
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- File upload validation

## Changelog

- June 24, 2025. Initial setup
- June 25, 2025. Implemented comprehensive micro-animations system with fade-in effects, hover animations, staggered animations, loading skeletons, and interactive feedback throughout the application
- June 28, 2025. Fixed critical functionality issues: product management now fully operational, image uploads working, Razorpay subscription billing resolved, and authentication flow optimized for mobile and web

## Recent Changes

✓ Added micro-animations CSS framework with keyframes for various effects
✓ Created animated UI components (AnimatedButton, AnimatedCard, LoadingSkeleton)
✓ Enhanced dashboard with smooth transitions and staggered animations
✓ Improved hero section with animated elements and interactive feedback
✓ Added hover effects and micro-interactions to sidebar navigation
✓ Implemented loading skeletons for better perceived performance
✓ Enhanced pricing section with animated cards and buttons
✓ Fixed product management functionality - Connected ProductList component to backend APIs
✓ Resolved image upload issues - FileUpload component working with proper backend routes
✓ Fixed Razorpay subscription errors - Added razorpayPlanId to all subscription plans
✓ Resolved authentication issues - Fixed mobile sign-up and double-click sign-in problems
✓ Enhanced mobile experience - Added touch-action CSS and improved form responsiveness

## User Preferences

Preferred communication style: Simple, everyday language.