# User Management API

This is a RESTful API for user management with authentication and authorization features.

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- User profile management
- Password change functionality
- Account deletion

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a .env file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/evaProject
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Public Routes

- POST /api/users/register - Register a new user
- POST /api/users/login - Login user

### Protected Routes

- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- PUT /api/users/change-password - Change password
- DELETE /api/users/delete-account - Delete user account

## Request/Response Examples

### Register User
```json
POST /api/users/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login User
```json
POST /api/users/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Update Profile
```json
PUT /api/users/profile
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Protected routes require valid JWT token
- CORS is enabled for API access
- Environment variables for sensitive data

## Testing

Run tests using:
```bash
npm test
``` 