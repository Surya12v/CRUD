# Dynamic Form Builder & CRUD System

A dynamic form builder and CRUD system built with React, Node.js, and MongoDB.

## Features

### Form Builder
- Create custom forms with multiple field types
- Support for text, number, email, date, and select fields
- Validation rules configuration
- Dynamic collection creation

### Dynamic Forms
- Auto-generated forms based on schemas
- Real-time validation
- Responsive layout
- Support for different input types

### Data Management
- Dynamic table views for each collection
- CRUD operations for all collections
- Automatic schema validation
- Data persistence in MongoDB

### Navigation
- Sidebar menu for easy access
- Dynamic collection listing
- Clean and intuitive interface

## Tech Stack
- Frontend: React, Ant Design
- Backend: Node.js, Express
- Database: MongoDB
- State Management: React Hooks
- Routing: React Router

## Getting Started

1. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

2. Set up environment variables:
Create `.env` file in backend:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crud
```

3. Run the application:
```bash
# Backend
npm run dev

# Frontend
npm start
```

## Architecture
- Dynamic schema generation
- Component-based architecture
- RESTful API design
- MongoDB collections for forms and data