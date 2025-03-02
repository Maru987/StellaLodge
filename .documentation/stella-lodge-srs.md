# Stella Lodge Tahiti - Software Requirements Specification

## System Design
- **Application Type**: Single Page Application (SPA)
- **Target Platforms**: Web (desktop and mobile)
- **User Roles**:
  - Visitors/Guests (browsing and booking)
  - Authenticated Users (returning customers)
  - Admin (property owner for reservation management)
- **Key Functionality Groups**:
  - Property Showcase
  - Booking System
  - User Authentication
  - Location Services
  - Content Management

## Architecture Pattern
- **Frontend Pattern**: Component-based architecture using React
- **Application Framework**: Next.js (App Router)
- **Overall Pattern**: JAMstack architecture
  - Static generation for content-heavy sections
  - Client-side rendering for interactive elements
  - Server components for data-fetching operations
- **Deployment Model**: Edge-deployed static site with API routes

## State Management
- **Local Component State**: React useState for component-specific state
- **Global Application State**: React Context API for shared state like:
  - Authentication status
  - Booking information
  - UI preferences
- **Form State Management**: React Hook Form for all forms
- **Server State**: Use Next.js/React Query for server state management
- **Persistence**:
  - LocalStorage for non-sensitive user preferences
  - Supabase for all persistent data storage

## Data Flow
- **Client-Side Flow**:
  1. UI Components → Event Handlers → State Updates → Re-renders
  2. Form Submissions → Validation → API Calls → Response Handling
- **Server Interaction**:
  1. Data Fetching: Next.js Server Components → Supabase → Component Props
  2. Data Mutations: Client Components → Supabase API → State Updates
- **Authentication Flow**:
  1. Login/Signup → Supabase Auth → JWT Token → Protected Routes
- **Booking Process Flow**:
  1. Date Selection → Availability Check → User Details → Payment → Confirmation
  2. Reservation Data → Supabase → Email Notification

## Technical Stack
- **Frontend**:
  - Framework: Next.js 14+ (App Router)
  - UI Library: React 18+
  - Component Library: ShadCN UI
  - Styling: Tailwind CSS
  - State Management: React Context + useState/useReducer
  - Form Handling: React Hook Form
  - Date Management: date-fns
- **Backend**:
  - Platform: Supabase
  - API: Supabase REST and Realtime APIs
  - Functions: Edge Functions (via Supabase)
- **Database**:
  - Primary Database: PostgreSQL (via Supabase)
- **Authentication**:
  - Service: Supabase Auth
  - Methods: Email/Password, OAuth Providers (Google)
- **Deployment & Infrastructure**:
  - Hosting: Cloudflare Pages
  - CDN: Cloudflare CDN
  - Analytics: Simple Analytics or Cloudflare Analytics
- **External Services**:
  - Maps: Google Maps JavaScript API
  - Email: Resend or SendGrid
  - Media Storage: Supabase Storage

## Authentication Process
- **Registration Flow**:
  - Simple signup form with email verification
  - Optional social login (Google)
  - Redirect to profile completion on first login
- **Login Flow**:
  - Email/password authentication
  - "Remember me" functionality
  - Password reset process
- **Session Management**:
  - JWT-based authentication
  - Refresh token rotation
  - Secure, httpOnly cookies
- **Authorization**:
  - Role-based access control (Guest vs Admin)
  - Protected routes for admin functionality
  - Row-level security in Supabase for data access

## Route Design
- **Public Routes**:
  - `/` - Main landing page with all sections
  - `/book` - Direct access to booking form
  - `/confirmation/:id` - Booking confirmation page
  - `/login` - User authentication
  - `/signup` - New user registration
  - `/reset-password` - Password recovery
- **Protected Routes**:
  - `/account` - User profile and bookings
  - `/account/bookings` - Booking history
  - `/account/bookings/:id` - Specific booking details
- **Admin Routes**:
  - `/admin` - Admin dashboard
  - `/admin/bookings` - All bookings management
  - `/admin/calendar` - Calendar view of bookings
  - `/admin/content` - Content management

## API Design
- **Authentication Endpoints** (via Supabase Auth):
  - `POST /auth/signup` - Create new user
  - `POST /auth/login` - Authenticate user
  - `POST /auth/logout` - End session
  - `POST /auth/reset-password` - Password recovery
- **Booking Endpoints**:
  - `GET /api/availability` - Check date availability
  - `POST /api/bookings` - Create new booking
  - `GET /api/bookings/:id` - Get booking details
  - `PATCH /api/bookings/:id` - Update booking
  - `DELETE /api/bookings/:id` - Cancel booking
- **User Endpoints**:
  - `GET /api/user/profile` - Get user profile
  - `PATCH /api/user/profile` - Update user profile
  - `GET /api/user/bookings` - Get user's bookings
- **Content Endpoints**:
  - `GET /api/property` - Get property details
  - `GET /api/amenities` - Get amenities list
  - `GET /api/testimonials` - Get testimonials

## Database Design ERD
- **Tables**:
  - **users** (managed by Supabase Auth)
    - id (PK)
    - email
    - created_at
    - last_sign_in
    - role (guest, admin)
  
  - **profiles**
    - id (PK, references users.id)
    - full_name
    - phone
    - country
    - preferences
    - created_at
    - updated_at
  
  - **bookings**
    - id (PK)
    - user_id (FK to users.id, nullable for non-registered users)
    - check_in_date
    - check_out_date
    - guests_count
    - total_price
    - status (pending, confirmed, cancelled, completed)
    - guest_name (for non-registered users)
    - guest_email (for non-registered users)
    - guest_phone (for non-registered users)
    - special_requests
    - created_at
    - updated_at
  
  - **property_info**
    - id (PK)
    - name
    - description
    - max_guests
    - bedrooms
    - bathrooms
    - base_price
    - weekend_price
    - cleaning_fee
    - created_at
    - updated_at
  
  - **amenities**
    - id (PK)
    - name
    - description
    - icon
    - category (bedroom, kitchen, outdoor, etc.)
  
  - **images**
    - id (PK)
    - url
    - alt_text
    - category (exterior, interior, bedroom, etc.)
    - is_featured
    - display_order
  
  - **availability**
    - id (PK)
    - date
    - is_available
    - price_override
    - notes

- **Relationships**:
  - One user can have many bookings
  - One user has one profile
  - One property has many amenities, images, and availability dates
