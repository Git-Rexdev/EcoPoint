# EcoPoint - Sustainable Waste Management Platform

![EcoPoint](https://img.shields.io/badge/EcoPoint-Waste%20Management-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

A comprehensive, secure, and modern waste management platform that connects users with recycling centers, enables efficient waste collection, and promotes sustainable practices through a reward-based ecosystem.

## Overview

EcoPoint is a full-stack application consisting of:
- **Frontend**: Modern React/TypeScript web application with beautiful UI
- **Backend**: Secure Node.js/Express API with MongoDB
- **Mobile Support**: Progressive Web App (PWA) capabilities

The platform serves multiple user types:
- **Regular Users**: Submit waste, earn points, redeem rewards
- **Businesses**: Manage ads, verify coupons, participate in the ecosystem  
- **Admins**: Oversee operations, manage users, review submissions

## Key Features

### Core Functionality
- **Waste Submission & Tracking**: Users can submit recyclable waste with photo verification
- **Point-Based Reward System**: Earn points for sustainable practices
- **Coupon Marketplace**: Redeem points for discounts at participating businesses
- **Recycling Center Locator**: Find nearby recycling facilities
- **Pickup Scheduling**: Schedule convenient waste collection times
- **Educational Resources**: Learn about proper waste management and recycling

### Security & Authentication
- **JWT-based Authentication** with refresh tokens
- **HMAC Request Signing** for mobile app security
- **Role-Based Access Control** (USER/BUSINESS/ADMIN)
- **Device-bound Security** to prevent API abuse
- **Rate Limiting & CORS Protection**
- **Input Validation** with Zod schemas

### User Experience
- **Responsive Design** works on all devices
- **Modern UI Components** built with Shadcn/ui and Radix UI
- **Real-time Updates** with TanStack Query
- **Accessible Interface** following WCAG guidelines
- **Progressive Web App** features for mobile-like experience

## Architecture

```
EcoPoint/
├── Backend/                 # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, security
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Application entry point
│   └── package.json
├── Frontend/                # React/TypeScript Web App
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and configurations
│   │   ├── pages/           # Application routes/pages
│   │   ├── types/           # TypeScript definitions
│   │   └── App.tsx          # Main application component
│   └── package.json
├── README.md               # This file
└── LICENSE                 # MIT License
```

## Quick Start

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** 4.4+
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/Git-Rexdev/EcoPoint.git
cd EcoPoint
```

### 2. Backend Setup
```bash
cd Backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secrets

# Start development server
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup
```bash
cd Frontend
npm install

# Start development server  
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Environment Configuration

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecopoint
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

#### Frontend
The frontend automatically connects to `http://localhost:3000` in development mode.

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Core Endpoints
- `GET /api/ads` - List advertisements (public)
- `POST /api/waste/submit` - Submit waste for review (authenticated)
- `GET /api/points/balance` - Get user's point balance
- `GET /api/coupons` - List available coupons
- `POST /api/coupons/redeem` - Redeem coupon with points
- `POST /api/coupons/verify` - Verify coupon usage (business)

### Admin Endpoints
- `POST /api/waste/:id/review` - Review waste submissions
- `GET /api/users` - Manage users
- `POST /api/ads` - Create advertisements
- `POST /api/coupons` - Create coupons

For detailed API documentation, see [Backend README](Backend/README.md).

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **Security**: Helmet, CORS, HPP, Rate Limiting
- **Validation**: Zod schemas
- **Password Hashing**: Argon2
- **Development**: Nodemon for hot reloading

### Frontend  
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Shadcn/ui with Radix UI primitives
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM 6.30
- **Icons**: Lucide React & FontAwesome
- **Charts**: Recharts for data visualization

## Security Features

### HMAC Request Signing
Mobile requests are secured with HMAC-SHA256 signatures:
```javascript
const signature = HMAC_SHA256(secret, deviceId + clientId + nonce + timestamp + body)
```

### Authentication Flow
1. User registers/logs in with credentials + deviceId
2. Server returns JWT access/refresh tokens + device credentials
3. Client signs subsequent requests with device secret
4. Server validates signatures and JWT tokens

### Additional Security
- **CORS Allowlist**: Restricts cross-origin requests
- **Rate Limiting**: Prevents abuse and DoS attacks  
- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection Protection**: MongoDB with parameterized queries
- **XSS Protection**: Helmet middleware with CSP headers

## UI/UX Design

### Design System
- **Color Palette**: Eco-friendly greens with modern accents
- **Typography**: Clean, readable fonts optimized for accessibility
- **Components**: Consistent design language across all interfaces
- **Responsive**: Mobile-first design that scales to desktop
- **Accessibility**: WCAG 2.1 AA compliant components

### Key Pages
- **Dashboard**: Overview of user activity and statistics
- **Centers**: Interactive map of recycling centers
- **Pickup**: Schedule waste collection appointments
- **Rewards**: Browse and redeem available coupons
- **Guide**: Educational content about recycling
- **Profile**: User account management

## Development

### Available Scripts

#### Backend
```bash
npm start          # Production server
npm run dev        # Development with nodemon
```

#### Frontend  
```bash
npm run dev        # Development server
npm run build      # Production build
npm run build:dev  # Development build
npm run lint       # ESLint code quality check
npm run preview    # Preview production build
```

### Code Quality
- **ESLint**: Configured for React and TypeScript
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (recommended)
- **Git Hooks**: Pre-commit linting (optional)

## Mobile Support

EcoPoint is designed as a Progressive Web App (PWA) with:
- **Responsive Design**: Works seamlessly on mobile devices
- **Touch-Friendly Interface**: Optimized for touch interactions
- **Offline Capabilities**: Basic functionality works offline
- **App-Like Experience**: Can be installed on mobile home screens

## Environmental Impact

EcoPoint promotes sustainability by:
- **Reducing Waste**: Streamlining recycling processes
- **Education**: Teaching proper waste management
- **Incentivization**: Rewarding eco-friendly behaviors
- **Efficiency**: Optimizing collection routes and schedules
- **Community**: Building a network of environmentally conscious users

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- **Code Style**: Follow existing patterns and conventions
- **TypeScript**: Use strict typing, avoid `any` types
- **Testing**: Add tests for new features (when test suite is available)
- **Documentation**: Update relevant documentation
- **Security**: Follow security best practices
- **Performance**: Consider performance implications

### Areas for Contribution
- Bug fixes and improvements
- New features and enhancements  
- Documentation improvements
- UI/UX enhancements
- Security improvements
- Performance optimizations
- Test coverage expansion

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2025 Manmohan & Piyush
```

## Team

**Created by Manmohan & Piyush**

**For Team Vigilantes, SGIS, Kolhapur**

## Support

For support, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Check existing documentation

Developer team contacts:
zanwarmanmohan@gmail.com
[LinkedIn](https://linkedin.com/in/developer-manmohan/)
---

**EcoPoint - Advertise in an Eco-Friendly Way**

*Together, we can build a more sustainable future through technology and community engagement.*
