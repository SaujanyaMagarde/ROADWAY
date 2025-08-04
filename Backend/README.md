# RoadWay Backend API Documentation

## Overview
Backend API service for the RoadWay ride-sharing platform built with Node.js, Express, and MongoDB.

## Project Structure

### Core Files
```
Backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── tests/             # Test files
└── server.js          # Entry point
```

### Key Files Description

#### Controllers (`/src/controllers/`)
- `authController.js` - Handles user authentication and registration
- `rideController.js` - Manages ride creation and updates
- `paymentController.js` - Processes payments
- `userController.js` - User profile management
- `captainController.js` - Captain-specific operations

#### Models (`/src/models/`)
- `User.js` - User data schema
- `Ride.js` - Ride information schema
- `Payment.js` - Payment records schema
- `Captain.js` - Captain profile schema
- `Vehicle.js` - Vehicle information schema

#### Routes (`/src/routes/`)
- `authRoutes.js` - Authentication endpoints
- `rideRoutes.js` - Ride management endpoints
- `paymentRoutes.js` - Payment processing routes
- `userRoutes.js` - User profile routes
- `captainRoutes.js` - Captain-specific routes

## API Routes

### Authentication Routes
Base path: `/api/auth`

#### Register User
- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

[Previous API documentation content remains the same...]

## Setup and Installation

1. **Prerequisites**
```bash
Node.js v16 or higher
MongoDB v4.4 or higher
npm or yarn
```

2. **Environment Variables**
Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roadway
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

3. **Installation Steps**
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
cd roadWay/Backend
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use async/await for asynchronous operations
- Implement proper error handling
- Write comprehensive API documentation
- Include JSDoc comments for functions

### Database
- Use Mongoose for MongoDB interactions
- Implement proper indexing
- Follow schema validation rules
- Handle database transactions properly

### Security
- Implement rate limiting
- Use helmet for HTTP headers
- Validate and sanitize inputs
- Implement proper authentication
- Use CORS protection

### Testing
- Write unit tests for controllers
- Test API endpoints
- Mock external services
- Use Jest for testing framework

## Deployment

### Production Setup
```bash
# Build application
npm run build

# Start production server
npm start
```

### Deployment Checklist
- Set up production MongoDB instance
- Configure environment variables
- Set up SSL certificates
- Configure nginx reverse proxy
- Set up PM2 process manager

## Monitoring and Logging

### Tools Used
- Winston for logging
- Morgan for HTTP logging
- PM2 for process management
- MongoDB Atlas monitoring

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.