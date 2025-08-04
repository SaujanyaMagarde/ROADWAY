# RoadWay - Ride Sharing Platform Frontend

A modern ride-sharing platform built with React and Vite.

## Key Files and Directories

### Components (`/src/components/`)
- `GoToPickup.jsx` - Handles ride pickup navigation and status
- `UserProfile.jsx` - User profile management component
- `PaymentForm.jsx` - Payment processing interface
- `RideHistory.jsx` - Shows past rides history

### Pages (`/src/pages/`)
- `RideStart.jsx` - Main ride management page
- `Login.jsx` - Authentication page
- `Dashboard.jsx` - User dashboard
- `PaymentPage.jsx` - Payment processing page

### Store (`/src/Store/`)
- `Store.jsx` - Redux store configuration
- `SocketSlice.jsx` - Socket.io state management
- `AuthSlice.jsx` - Authentication state management
- `CaptainSlice.jsx` - Captain-specific state management

### Utils (`/src/utils/`)
- `api.js` - API integration functions
- `socketUtils.js` - Socket.io utility functions
- `validation.js` - Form validation helpers
- `mapHelpers.js` - Map-related utility functions

## Environment Variables

Create a `.env` file in the root directory with these variables:
```env
VITE_SERVER_URL=http://localhost:3000
VITE_SOCKET_URL=ws://localhost:3000
VITE_MAPS_API_KEY=your_google_maps_api_key
```

## Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development Guidelines

### Code Structure
- Components should be placed in appropriate folders
- Use proper naming conventions (PascalCase for components)
- Include PropTypes for component props
- Keep components modular and reusable

### State Management
- Use Redux for global state management
- Keep related state in appropriate slices
- Use local state for component-specific data

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first approach
- Maintain consistent spacing and colors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.