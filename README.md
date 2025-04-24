# FinancIA - AI-Driven Financial Management App

## Overview

FinancIA is an AI-driven mobile application designed to help Mexican adults better manage their personal finances. The app provides personalized budgeting and saving strategies based on user profile and behavior.

> **Development Status**: This application is currently under development. Some features may not be fully implemented or optimized.

## Problem Statement

In Mexico, 68% of banked adults aged 18–55 struggle to manage their personal finances, leading to over-indebtedness, low savings rates, and limited investment capacity (ENIF 2021). Such challenges undermine individual economic stability and impede progress toward broader financial inclusion and sustainable growth.

## Current Features

### Implemented

- **Personalized Onboarding Experience**
  - User profile creation (name, gender)
  - Financial habits assessment quiz
  - Immediate AI-generated pre-proposal with financial recommendations
- **Dashboard & Visualization**

  - Financial overview
  - Card management (add, view)
  - Spending breakdown by category
  - Financial statistics and trends

- **User Experience**
  - Light/dark mode support
  - Responsive design
  - Intuitive navigation flow

### Pending Implementation

- Account linking with banking institutions
- Transaction tracking and categorization
- Budget setting and monitoring
- Savings goals tracking
- AI-powered financial recommendations
- Push notifications for financial alerts

## Technical Stack

### Frontend

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context API
- **UI Components**: Native components with custom styling
- **Theming**: Custom light/dark mode implementation

### Backend (Planned Architecture)

- **Authentication**: Amazon Cognito
- **API Layer**: Amazon API Gateway with AWS WAF
- **Business Logic**: AWS Lambda functions
- **Data Storage**: Amazon DynamoDB
- **Machine Learning**: Amazon SageMaker
- **Monitoring**: Amazon CloudWatch

### Key Components

#### Authentication & API Layer

- **Amazon Cognito**: Manages user sign-up, sign-in, and issues JWT tokens
- **Amazon API Gateway**: Exposes REST endpoints and routes requests
- **AWS WAF**: Provides web-application firewall protection

#### Business Logic (AWS Lambda)

- User management
- Transaction processing
- Budget management
- Onboarding session handling
- Pre-proposal generation

#### Data Persistence (Amazon DynamoDB)

- Users data
- Transactions records
- Budgets information
- Onboarding sessions
- AI recommendations

#### Machine Learning (Amazon SageMaker)

- Hosts ML models for personalized financial insights

## Technical Details

### Project Structure

```
mobileApp/
├── app/                   # Main application folder
│   ├── (tabs)/            # Tab system screens
│   ├── dashboard/         # Main dashboard module
│   ├── onboarding/        # Onboarding flow
│   ├── context/           # React contexts for state management
│   └── _layout.tsx        # Main layout with context providers
├── assets/                # Images and static resources
├── constants/             # Application constants (colors, etc.)
└── store/                 # Global state management with Zustand
```

### Architecture and Design Patterns

- **Architecture**: Component-based with file-system routing
- **State Patterns**: Combination of Context API and Zustand for different use cases
- **Navigation Pattern**: Stack and Tab Navigation using Expo Router
- **Separation of Concerns**: Visual components separated from business logic

### Theme System

The application implements a light/dark theme system:

- Automatic system theme detection using `useColorScheme()`
- Color palette defined in `constants/Colors.ts`
- Visual consistency through conditional styling based on current theme

### State Management

- **Local State**: React Hooks (`useState`, `useEffect`)
- **Global State**:
  - User information through React Context (`UserInfoContext`)
  - Persistent state with Zustand (`userStore`)
- **Persistence**: In development, currently data resets when restarting the app

### Navigation System

- **Expo Router**: File system-based navigation
- **Nested Layouts**: Different layouts for onboarding and dashboard
- **Route Parameters**: Data transfer between screens via parameters

### Current Development Status

#### Completed Components

- Onboarding screen system
- Basic registration flow
- Main dashboard with visualizations
- Card management (add, view)
- Basic statistics and charts
- Light/dark theme switching

#### In Development

- Data persistence
- External API connections
- AWS services integration
- Performance optimization
- Automated testing

### Next Technical Steps

- Amazon Cognito authentication implementation
- DynamoDB connection for data persistence
- API Gateway integration for backend communication
- ML models implementation with SageMaker
- Performance and asset loading optimization

### Developer Guidelines

- Follow existing folder structure
- Use the theme system for new components
- Document new features
- Run tests before submitting changes

## Installation and Setup

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Getting Started

1. Clone the repository:

```bash
git clone https://github.com/alondracarrillocelis/financIA.git
cd mobile/mobileApp
```

2. Cambiar a la rama 'Mobile':

```bash
git checkout Mobile
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npx expo start
```

5. Run on a device or emulator:
   - Press `a` to run on Android emulator
   - Press `i` to run on iOS simulator
   - Scan QR code with Expo Go app on physical device

## Projections and Expected Impact

### Market Size and User Acquisition

- **Target Market**: 22 million banked adults in Mexico (ENIF 2021)
- **Year 1 Goal**: 50,000 active users (0.23% of market)
- **Year 3 Projection**: 2 million users across Latin America

### User Impact Goals

- 30% decrease in monthly overspending among active users
- 80% adherence rate to personalized budgets (vs. ~35% without support)
- 3 out of 5 users meeting medium-term saving or investment targets

### Financial Improvement Projections

- Reduce risky spending behaviors by up to 40%
- Increase savings capacity by approximately 80% within six months

## Limitations

- The MVP depends on reliable internet connectivity and AWS infrastructure
- Adoption among less tech-savvy users may require additional UX adjustments
- Ongoing model validation and updates are essential to maintain recommendation accuracy
- Current implementation is a proof-of-concept with projected figures based on published statistics

## Contact

For inquiries about this project, please contact: hugoperez510@hotmail.com
