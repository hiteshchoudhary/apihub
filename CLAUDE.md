# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development:**
```bash
yarn start                    # Start development server with nodemon
yarn start:test-server       # Start test server for e2e testing
```

**Testing:**
```bash
yarn test:playwright         # Run Playwright e2e tests
yarn playwright show-report  # View Playwright test report
```

**Code Quality:**
```bash
yarn pre-commit             # Run lint-staged pre-commit hooks (Prettier formatting)
```

**Docker:**
```bash
docker-compose up --build --attach backend  # Run with Docker, show only backend logs
```

**Database Management:**
```bash
# Via API endpoint (development only)
DELETE /api/v1/reset-db     # Reset entire database and remove uploaded files
```

## Project Architecture

**FreeAPI Hub** is a comprehensive API collection platform that provides free APIs for learning and development. The project follows a modular Express.js architecture with the following key components:

### Core Structure
- **Entry Point:** `src/index.js` - Server startup and database connection
- **App Configuration:** `src/app.js` - Express app setup, middleware, and route mounting
- **Database:** MongoDB with Mongoose ODM, connection at `src/db/index.js`
- **Constants:** All enums and constants defined in `src/constants.js`

### API Categories
The API endpoints are organized into distinct categories:

1. **Apps APIs** (`src/controllers/apps/`):
   - **Authentication:** User registration, login, JWT tokens, OAuth (Google/GitHub)
   - **Chat App:** Real-time messaging with Socket.IO
   - **E-commerce:** Products, cart, orders, payments (Razorpay/PayPal)
   - **Social Media:** Posts, likes, comments, follows, bookmarks
   - **Todo App:** Task management

2. **Public APIs** (`src/controllers/public/`):
   - Static data APIs (books, cats, dogs, meals, quotes, jokes, users, stocks, YouTube data)
   - No authentication required

3. **Kitchen Sink APIs** (`src/controllers/kitchen-sink/`):
   - HTTP testing utilities (status codes, redirects, request inspection)
   - Image generation, cookie handling

### Architecture Patterns
- **Controllers:** Handle HTTP requests and responses
- **Models:** Mongoose schemas in `src/models/apps/`
- **Routes:** Express route definitions in `src/routes/`
- **Middlewares:** Authentication, error handling, file uploads at `src/middlewares/`
- **Utils:** Common utilities (`ApiError`, `ApiResponse`, `asyncHandler`) at `src/utils/`

### Key Features
- **Socket.IO Integration:** Real-time chat functionality
- **Authentication:** JWT with refresh tokens, OAuth providers
- **File Uploads:** Multer middleware for image handling
- **Payment Integration:** Razorpay and PayPal support
- **Rate Limiting:** Express rate limiting middleware
- **API Documentation:** Swagger/OpenAPI spec at `src/swagger.yaml`
- **Logging:** Winston logger with Morgan HTTP logging

### Environment Configuration
Copy `.env.sample` to `.env` and configure:
- Database: `MONGODB_URI`
- JWT secrets: `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`
- OAuth credentials for Google/GitHub
- Payment provider credentials (optional)
- CORS and host URL settings

### Testing Setup
- **Framework:** Playwright for e2e testing
- **Test Location:** `e2e/` directory
- **Test Server:** Separate test server with in-memory MongoDB (`e2e/test-server.js`)
- **Configuration:** Uses `MONGO_MEMORY_SERVER_PORT=10000` for testing
- **Test Database:** Dedicated test database setup in `e2e/db.js`
- **Workers:** Single worker mode to prevent database conflicts

### Socket.IO Events
Chat functionality uses predefined events from `ChatEventEnum` including:
- Connection/disconnection events
- Message sending/receiving
- Typing indicators
- Chat room management

The project serves as both a learning resource and production-ready API hub, with comprehensive documentation available via Swagger UI at the root URL when running locally.

## Code Quality and Development Tools

### Formatting and Linting
- **Prettier:** Automated code formatting via lint-staged
- **Lint-staged:** Pre-commit hooks for consistent code style
- **Commitlint:** Enforces conventional commit message format

### Commit Message Standards
Uses conventional commits with types: `ci`, `chore`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `assets`, `test`

### Data Seeding
Development endpoints for seeding test data:
- `/api/v1/seed/generated-credentials` - Get seeded user credentials
- `/api/v1/seed/todos` - Seed todo data
- `/api/v1/seed/ecommerce` - Seed ecommerce data (creates users first)
- `/api/v1/seed/social-media` - Seed social media data (creates users first)
- `/api/v1/seed/chat-app` - Seed chat application data (creates users first)

### Examples Directory
Includes frontend examples in `examples/` directory:
- React implementations for various API categories
- Pre-configured with Tailwind CSS, Vite, and state management
- Organized by feature: ecommerce, chat-app, todo, kitchen-sink