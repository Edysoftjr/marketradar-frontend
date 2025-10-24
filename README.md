# MarketRadar - Comprehensive Stall Management System

## Overview

MarketRadar is a robust platform designed to connect vendors, customers, and enthusiasts. It offers advanced features for managing stalls, products, social interactions, and subscriptions, with real-time notifications and analytics.

## Features

### 🏪 **Stall Management**

- **Completed**:
  - Create and manage stalls with detailed information.
  - Support for multiple stall types (Food, Clothing, Electronics, etc.).
  - Location-based stall discovery with filtering by area, city, and state.
- **Pending**:
  - Advanced stall analytics and revenue tracking.

### 🛍️ **Product Management**

- **Completed**:
  - Add, edit, and delete products from stalls.
  - Product categorization and inventory management.
- **Pending**:
  - Price and quantity tracking.
  - Advanced product search and filtering capabilities.

### 💬 **Social Features**

- **Completed**:
  - User posts with 24-hour expiration.
  - Comment system for stalls and posts.
- **Pending**:
  - Enhanced rating system (1-5 stars) for stalls.
  - User following and subscription system.

### 🔔 **Subscription & Notification System**

- **Completed**:
  - Subscribe to stalls for product updates.
  - Follow vendors for new product notifications.
- **Pending**:
  - Real-time notifications for:
    - New products in subscribed stalls.
    - New posts from followed users.
    - New products from followed vendors.

### 👤 **User Management**

- **Completed**:
  - User authentication with JWT tokens (access and refresh).
  - Role-based access control (User, Vendor, Admin).
- **Pending**:
  - Enhanced profile management with preferences.
  - Account security features, including login attempt limiting and account locking.

### 📊 **Dashboard & Analytics**

- **Pending**:
  - User dashboard with statistics.
  - Order tracking and history.
  - Revenue analytics for vendors.
  - Subscription management.

## Development Roadmap

### Completed Features

- Basic stall and product management.
- User authentication and role-based access control.
- Initial implementation of social features (posts and comments).
- Basic subscription system for stalls and vendors.

### In Progress

- Advanced product search and filtering.
- Enhanced notification system for real-time updates.
- User dashboard and analytics.
- Profile management improvements.

### Planned Features

- Mobile app development.
- Payment integration.
- Advanced analytics dashboard.
- Multi-language support.
- Push notifications.
- Real-time chat system.
- Advanced search and filtering.
- Integration with food delivery services.

## Tech Stack

### Backend

- **Node.js** with **Express.js**.
- **TypeScript** for type safety.
- **Prisma ORM** with **PostgreSQL**.
- **JWT Authentication** with refresh tokens.
- **Rate Limiting** and security middleware.
- **Email Service** integration for notifications and password resets.

### Frontend

- **Next.js 14** with **App Router**.
- **TypeScript** for type safety.
- **Tailwind CSS** for styling.
- **React Context** for state management.
- **Server-side Rendering (SSR)** for performance.

## Database Schema

The system uses a comprehensive database schema with the following main entities:

- **Users**: User accounts with roles and preferences.
- **Stalls**: Food stalls with location and type information.
- **Products**: Items sold by stalls.
- **Posts**: Social posts with expiration.
- **Comments**: User feedback and ratings.
- **Subscriptions**: User relationships and following.
- **Notifications**: Real-time updates and alerts.

## API Endpoints

### Authentication

- User registration and login.
- JWT token management.
- Password reset functionality.
- Email verification.

### Stalls

- CRUD operations for stalls.
- Stall discovery and filtering.
- Stall analytics and ratings.

### Products

- Product management.
- Inventory tracking.
- Product search.

### Social Features

- Post creation and management.
- Comment system.
- User following.

### Subscriptions

- Stall subscriptions.
- Vendor following.
- Notification management.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. Clone the repository.
2. Navigate to the backend directory: `cd backend`.
3. Install dependencies: `npm install`.
4. Copy `.env.example` to `.env` and configure your environment variables.
5. Run database migrations: `npm run db:migrate`.
6. Start the development server: `npm run dev`.

### Frontend Setup

1. Navigate to the frontend directory: `cd frontend`.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env.local` and configure your environment variables.
4. Start the development server: `npm run dev`.

### Environment Variables

#### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/foodradar"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
COOKIE_SECRET="your-cookie-secret"
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-email-password"
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

## System Architecture

### Backend Architecture

- **Controllers**: Handle HTTP requests and responses.
- **Services**: Business logic and data processing.
- **Routes**: API endpoint definitions.
- **Middleware**: Authentication, validation, and security.
- **Models**: Data models and database interactions.

### Frontend Architecture

- **Pages**: Next.js app router pages.
- **Components**: Reusable UI components.
- **Hooks**: Custom React hooks.
- **Context**: Global state management.
- **Server Functions**: Server-side data fetching.

### Data Flow

1. **Authentication**: JWT-based user authentication.
2. **Authorization**: Role-based access control.
3. **Data Fetching**: Server-side data retrieval.
4. **State Management**: React Context for global state.
5. **Real-time Updates**: Subscription-based notifications.

## Security Features

- **JWT Authentication** with refresh tokens.
- **Rate Limiting** to prevent abuse.
- **Input Validation** and sanitization.
- **CORS Protection** for cross-origin requests.
- **Secure Cookies** with HTTP-only flags.
- **Password Hashing** with Argon2.
- **Account Lockout** for failed login attempts.

## Performance Features

- **Server-side Rendering** for better SEO.
- **Database Indexing** for fast queries.
- **Pagination** for large datasets.
- **Caching** strategies for frequently accessed data.
- **Optimized Queries** with Prisma ORM.

## Testing

The system includes comprehensive testing capabilities:

- **API Testing**: Test all endpoints with provided curl commands.
- **Database Testing**: Prisma migrations and seeding.
- **Frontend Testing**: Component testing with React Testing Library.

## Deployment

### Backend Deployment

- Use PM2 or similar process manager.
- Configure environment variables.
- Set up reverse proxy (Nginx).
- Enable HTTPS with SSL certificates.

### Frontend Deployment

- Build the application: `npm run build`.
- Deploy to Vercel, Netlify, or similar platforms.
- Configure environment variables.
- Set up custom domain and SSL.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Add tests if applicable.
5. Submit a pull request.

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue in the GitHub repository.
- Check the documentation in the `/docs` folder.
- Review the test routes in `backend/test-routes.md`.

## Roadmap

- [ ] Mobile app development.
- [ ] Payment integration.
- [ ] Advanced analytics dashboard.
- [ ] Multi-language support.
- [ ] Push notifications.
- [ ] Real-time chat system.
- [ ] Advanced search and filtering.
- [ ] Integration with food delivery services.
