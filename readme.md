# RoadWay - Modern Ride-Sharing Platform

## Overview
RoadWay is a full-stack ride-sharing platform built with React, Node.js, and MongoDB. It offers real-time ride tracking, secure payments, and an intuitive user interface for both riders and drivers.

## Project Structure
```
roadWay/
├── Frontend/                # React frontend application
├── Backend/                 # Node.js backend API
└── docs/                   # Documentation files
```

## Key Features
- Real-time ride tracking
- Secure payment processing
- User and Captain authentication
- Interactive maps integration
- Ride history management
- Profile management
- Real-time notifications

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Socket.IO Client
- Tailwind CSS
- Google Maps API
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Stripe Payment
- Google Maps Services

## Quick Start

### Prerequisites
- Node.js v16 or higher
- MongoDB v4.4 or higher
- npm or yarn
- Google Maps API key
- Stripe API key

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd Backend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env)
```env
VITE_SERVER_URL=http://localhost:5000
VITE_SOCKET_URL=ws://localhost:5000
VITE_MAPS_API_KEY=your_google_maps_api_key
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roadway
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Development

### Running Tests
```bash
# Frontend tests
cd Frontend
npm test

# Backend tests
cd Backend
npm test
```

### Code Style
- ESLint configuration
- Prettier formatting
- React best practices
- Node.js best practices

## API Documentation

Detailed API documentation can be found in the `/Backend/README.md` file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

### Frontend
- Build the frontend: `cd Frontend && npm run build`
- Deploy to hosting service (Vercel, Netlify, etc.)

### Backend
- Set up production MongoDB instance
- Configure environment variables
- Deploy to cloud service (AWS, Heroku, etc.)
- Set up SSL certificates
- Configure nginx reverse proxy

## Authors
- Your Name
- Contributors

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Google Maps API
- Stripe Payment Gateway
- Socket.IO
- MongoDB Atlas