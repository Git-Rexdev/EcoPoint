# EcoPoint Frontend

A modern, eco-friendly waste management web application built with React, TypeScript, and Tailwind CSS. EcoPoint helps users manage waste collection, track recycling centers, schedule pickups, and earn rewards for sustainable practices.

![EcoPoint](https://img.shields.io/badge/EcoPoint-Waste%20Management-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.17-teal)

## About

EcoPoint is a comprehensive waste management platform that connects users with recycling centers, enables efficient waste pickup scheduling, and promotes sustainable practices through a reward system. The application features a modern, responsive design with a focus on user experience and environmental impact.

## Features

- **Dashboard**: Overview of user's eco-activities and statistics
- **Centers**: Find and explore nearby recycling centers
- **Pickup Scheduling**: Schedule waste collection at your convenience  
- **Guide**: Educational resources on waste management and recycling
- **Rewards**: Earn points and rewards for sustainable practices
- **Achievements**: Complete challenges and unlock rewards for recycling milestones
- **Profile Management**: Manage user account and preferences
- **Schedule Management**: View and manage all pickup schedules
- **Authentication**: Secure login and registration system

## Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.8.3** - Type-safe JavaScript development
- **Vite 5.4.19** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Headless UI components for accessibility
- **Shadcn/ui** - Beautiful, customizable UI component library
- **Lucide React** - Modern icon library

### State Management & Data Fetching
- **TanStack Query 5.83.0** - Powerful data synchronization
- **React Hook Form 7.61** - Performant forms with easy validation
- **Zod 3.25** - TypeScript-first schema validation

### Routing & Navigation
- **React Router DOM 6.30** - Declarative routing for React

### Additional Libraries
- **Axios 1.12** - HTTP client for API requests
- **Date-fns 3.6** - Modern JavaScript date utility library
- **Crypto-js 4.2** - Cryptographic functions
- **Recharts 2.15** - Composable charting library

## Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ByteSmithTheDev/EcoPoint-Frontend.git
   cd EcoPoint-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run lint` | Run ESLint for code quality |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Navigation.tsx   # Main navigation component
│   ├── Sidebar.tsx     # Sidebar navigation
│   └── StatsCard.tsx   # Statistics display card
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
│   ├── api.ts          # API client configuration
│   ├── hmac.ts         # HMAC security functions
│   ├── mockData.ts     # Mock data for development
│   └── utils.ts        # General utility functions
├── pages/              # Application pages/routes
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Centers.tsx     # Recycling centers page
│   ├── Pickup.tsx      # Pickup scheduling
│   ├── Guide.tsx       # Educational guide
│   ├── Rewards.tsx     # Rewards system
│   ├── Achievements.tsx # Achievement system
│   ├── Profile.tsx     # User profile
│   ├── Login.tsx       # Authentication
│   ├── Register.tsx    # User registration
│   └── AllSchedules.tsx # Schedule management
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```

## Authentication

The application includes a robust authentication system with:
- User registration and login
- Protected routes requiring authentication
- Token-based session management
- Automatic redirect to login for unauthenticated users

## Design System

EcoPoint uses a consistent design system built with:
- **Shadcn/ui** components for consistent styling
- **Tailwind CSS** for responsive design
- **Radix UI** primitives for accessibility
- **Custom color palette** focused on eco-friendly themes

## Environmental Impact

EcoPoint is designed to promote sustainable practices by:
- Connecting users with local recycling centers
- Streamlining waste collection processes
- Educating users about proper waste management
- Rewarding eco-friendly behaviors
- Reducing environmental footprint through efficient logistics

## Contributing

We welcome contributions to improve EcoPoint! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use the existing component patterns
- Ensure responsive design across all devices
- Write meaningful commit messages
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 RexDev & ByteSmith

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Created By

**Manmohan & Piyush**

## Android App

An Android build of EcoPoint is included in this repository for convenient testing and demonstrations.

- APK path: `android/EcoPoint.apk`
- Supported features: Dashboard, Centers lookup, Pickup scheduling, Rewards, Profile, Authentication (the mobile package provides the core user flows available in the web frontend).

Installation (on device)

- Copy the APK to your device and open it from a file manager to install. Make sure "Install unknown apps" or "Allow from this source" is enabled for the installer app.

Install using ADB (PowerShell)

```powershell
# Install or replace the app on a connected device or emulator
adb install -r .\android\EcoPoint.apk
```

Run on an Android emulator

- Start an Android emulator (Android Studio) then run the `adb install -r` command above to install the APK onto the emulator.


Compatibility & notes

- The APK is intended for typical modern Android devices. Android 8.0 / API 26+ is recommended; older devices may encounter installation or runtime issues.
- If installation fails, check device Android version and view logs with `adb logcat` for troubleshooting.
- The web frontend remains the primary source of truth; the APK is provided mainly for convenience and testing.

If you want, I can add a checksum for the APK, an uninstall command example, or instructions for generating a signed release—tell me which you'd prefer.

- GitHub: [@ByteSmithTheDev](https://github.com/ByteSmithTheDev) [@RedDev](https://github.com/Git-Rexdev)  
- Project: [EcoPoint-Frontend](https://github.com/ByteSmithTheDev/EcoPoint-Frontend)

*EcoPoint - Making waste management efficient and rewarding*