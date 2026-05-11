# Campus Notifications - Smart Priority Inbox

A full-stack solution for student notifications, featuring a weighted ranking algorithm and a responsive React dashboard.

## 🌟 Overview

Students are often overwhelmed by the sheer volume of campus notifications. This project addresses that by surfacing critical updates (Placements and Results) first, while still providing a complete feed for general events.

The project is split into two main parts:
1.  **Ranking Engine**: A logic-heavy backend/service layer that scores notifications based on category and recency.
2.  **Notification Dashboard**: A premium React application built with MUI, offering real-time filtering and a smart priority inbox.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Installation
Clone the repository and install dependencies for both sections:

```bash
# Install frontend dependencies
cd notification_app_fe
npm install
```

### 3. Environment Setup
Create a `.env` file in the `notification_app_fe` directory with the following keys:
```env
VITE_EMAIL=your_email
VITE_NAME=your_name
VITE_ROLLNO=your_roll_no
VITE_ACCESS_CODE=your_code
VITE_CLIENT_ID=your_id
VITE_CLIENT_SECRET=your_secret
```

### 4. Running the Dashboard
```bash
cd notification_app_fe
npm run dev
```
The app will be available at `http://localhost:3000`.

## 🧠 Core Algorithm

The "Smart Inbox" ranks notifications using a combined score:

**`Score = CategoryWeight + (1 / (1 + ageInSeconds))`**

- **Weights**: Placement (300), Result (200), Event (100).
- **Recency**: A time-decay factor ensures that brand-new notifications break ties within the same category.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Material UI (MUI) v6
- **Routing**: React Router DOM
- **HTTP Client**: Axios (with custom auth interceptors)
- **Styling**: Theme-based CSS (Catppuccin Palette)

## 📁 Project Structure

```text
.
├── notification_app_be/       # Stage 1: Logic & Ranking scripts
├── notification_app_fe/       # Stage 2: React Dashboard
│   ├── src/
│   │   ├── components/        # Reusable UI elements
│   │   ├── pages/             # App views (Feed, Priority Inbox)
│   │   ├── services/          # API & Auth logic
│   │   └── theme.js           # Custom MUI theme
│   └── screenshots/           # UI Previews
└── notification_system_design.md # Detailed technical documentation
```

## 📄 Documentation
For a deep dive into the architecture, algorithmic complexity, and design decisions, please refer to [notification_system_design.md](./notification_system_design.md).
