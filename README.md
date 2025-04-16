# EVA Project - Event Management System

A full-stack event management system built with React, Node.js, and MongoDB.

## Project Structure

```
.
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── render.yaml        # Render deployment configuration
└── README.md         # This file
```

## Prerequisites

- Node.js >= 18.0.0
- MongoDB
- Git

## Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd eva-project
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Start development servers:
   ```bash
   npm run dev
   ```

## Deployment on Render

1. Push your code to a GitHub repository

2. Go to [render.com](https://render.com) and create a new account

3. Click "New +" and select "Blueprint"

4. Connect your GitHub repository

5. Render will automatically detect the `render.yaml` file and set up:
   - Backend service
   - Frontend service
   - MongoDB database

6. After deployment, update the frontend's `.env.production` with the actual backend URL

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend (.env.production)
```
VITE_API_URL=https://eva-project-backend.onrender.com
VITE_APP_NAME=EVA Project
```

## Features

- User authentication and authorization
- Event creation and management
- Workshop management
- Service booking
- Image uploads
- Responsive design

## Technologies Used

- Frontend:
  - React
  - Vite
  - Tailwind CSS
  - DaisyUI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT Authentication
  - Multer (file uploads)

## License

ISC 