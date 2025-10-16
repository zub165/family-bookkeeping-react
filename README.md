# Family Bookkeeping React App

A modern React application for family financial management with multiple tabs and advanced features.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/zub165/family-bookkeeping-react.git
cd family-bookkeeping-react

# Install dependencies
npm install

# Start development server
npm start
```

## 📋 Features

### 🏠 Dashboard
- Family member management
- Quick overview of expenses, hours, and miles
- Recent transactions

### 💰 Expenses Tab
- Add/edit/delete expenses
- Categorize expenses
- Filter by date, category, family member
- Export to Excel/PDF

### ⏰ Hours Tab
- Track work hours
- Calculate earnings
- Time-based reporting

### 🚗 Miles Tab
- Log business miles
- Calculate deductions
- Mileage reports

### 📊 Reports Tab
- Financial summaries
- Tax reports
- Charts and graphs
- Export functionality

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Charts**: Chart.js or Recharts
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form
- **Routing**: React Router v6

## 🌐 API Integration

The app connects to the Django backend at:
- **Base URL**: `https://api.mywaitime.com/family-api/`
- **Authentication**: JWT tokens
- **CORS**: Configured for GitHub Pages

## 📱 Deployment

### GitHub Pages
```bash
# Deploy to GitHub Pages
npm run deploy
```

## 🎨 UI Components

### Main Layout
- Header with navigation
- Sidebar with menu items
- Main content area with tabs
- Footer with links

### Tab Structure
```
Dashboard
├── Family Members
├── Quick Stats
└── Recent Activity

Expenses
├── Add Expense
├── Expense List
├── Categories
└── Reports

Hours
├── Add Hours
├── Hours List
├── Earnings
└── Time Reports

Miles
├── Add Miles
├── Miles List
├── Deductions
└── Mileage Reports

Reports
├── Financial Summary
├── Tax Reports
├── Charts
└── Export
```

## 🔐 Authentication

- Login/Register forms
- JWT token management
- Protected routes
- Auto-logout on token expiry

## 📊 State Management

```typescript
// Redux store structure
interface RootState {
  auth: AuthState;
  family: FamilyState;
  expenses: ExpenseState;
  hours: HoursState;
  miles: MilesState;
  ui: UIState;
}
```

## 🚀 Getting Started

1. **Create GitHub Repository**
   ```bash
   # Create new repository on GitHub
   # Clone locally
   git clone https://github.com/zub165/family-bookkeeping-react.git
   ```

2. **Initialize React App**
   ```bash
   npx create-react-app . --template typescript
   ```

3. **Install Dependencies**
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   npm install @reduxjs/toolkit react-redux
   npm install axios react-router-dom
   npm install chart.js react-chartjs-2
   npm install date-fns
   npm install react-hook-form
   ```

4. **Configure API**
   ```typescript
   // src/config/api.ts
   export const API_BASE_URL = 'https://api.mywaitime.com/family-api';
   ```

5. **Start Development**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout/
│   ├── Forms/
│   ├── Charts/
│   └── Common/
├── pages/              # Page components
│   ├── Dashboard/
│   ├── Expenses/
│   ├── Hours/
│   ├── Miles/
│   └── Reports/
├── store/               # Redux store
│   ├── slices/
│   └── index.ts
├── services/            # API services
│   ├── api.ts
│   ├── auth.ts
│   └── family.ts
├── types/               # TypeScript types
├── utils/               # Utility functions
├── hooks/               # Custom hooks
└── App.tsx
```

## 🎯 Next Steps

1. Create GitHub repository
2. Initialize React project
3. Set up basic routing
4. Create main layout
5. Implement authentication
6. Add tab navigation
7. Connect to Django API
8. Deploy to GitHub Pages

## 🔗 Links

- **Backend API**: https://api.mywaitime.com/family-api/
- **Current Frontend**: https://zub165.github.io/book-keeping/
- **New React App**: https://zub165.github.io/family-bookkeeping-react/