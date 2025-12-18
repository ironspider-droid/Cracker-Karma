# Cracker Karma

Cracker Karma is a modern web application designed to gamify environmental responsibility, specifically around the use of firecrackers during celebrations. It allows users to manage a "cracker budget" in "Pollution Points," which they can earn by performing eco-friendly actions and spend by "bursting" virtual firecrackers.

The app provides a personalized experience with user accounts, real-time data integrations, and AI-powered analysis.

## Core Features

- **User Authentication**: Secure sign-up and login system using Firebase Authentication (email & password). Each user has a persistent, personal profile.
- **Cracker Budget**: Every user gets a "Pollution Point" budget. This budget is reduced when they burst virtual crackers and increased when they complete green activities.
- **Cracker Guide**: A visual guide to different types of firecrackers, showing their point "cost" and how many a user can afford with their current budget.
- **AI Cracker Scanner**: Upload an image of a firecracker, and a GenAI model will analyze it, identify the type, and report its impact on your budget.
- **Air Quality Analysis**: Before celebrating, users can check the real-time Air Quality Index (AQI) for any city to make informed decisions.
-**Real-time Activity Tracking**: Connect a Bluetooth Low Energy (BLE) fitness band to track live heart rate, demonstrating the app's capability for real-time data integration.
- **Eco-Friendly Actions**: A list of positive environmental actions (like planting a tree) that users can "complete" to earn back points for their budget.
- **Persistent Data**: All user data, including budget and theme preferences, is securely stored in Firestore.
- **Dark Mode**: A sleek, themeable interface with a user-configurable dark mode toggle.

## Tech Stack

This project is built with a modern, robust technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (for the AI Cracker Scanner)
- **Real-time Device Connection**: [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or another package manager
- A Firebase project with Firestore and Authentication enabled.

### Environment Setup

1.  **Clone the repository**:
    ```bash
    git clone <your-repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root of the project and add the API token for the World's Air Quality Index (WAQI) service.
    ```
    WAQI_TOKEN=your_waqi_api_token_here
    ```
    You can obtain a free token from the [WAQI API website](https://aqicn.org/data-platform/token/#/).

### Running the Development Server

Once the dependencies are installed and the environment variables are set, you can start the development server:

```bash
npm run dev
```

This will start the application on `http://localhost:9002`.

### How to Use

1.  Navigate to `http://localhost:9002` in your browser.
2.  You will be redirected to the `/login` page. Create an account to get started.
3.  Once logged in, you can explore all the features of the app.
4.  To test the fitness band integration, use a browser that supports the Web Bluetooth API (like Chrome or Edge) and a BLE device that broadcasts the standard Heart Rate service.
