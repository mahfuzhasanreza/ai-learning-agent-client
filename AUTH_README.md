# Authentication System Documentation

## Overview

This application uses a custom backend API for authentication instead of Supabase/Firebase. The authentication system includes signup, signin, and token-based authentication.

## API Endpoints

**Base URL:** `https://cosmos-its-production-v1.onrender.com/api/v1`

### Sign Up
- **Endpoint:** `POST /sign-up`
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string",
  "name": "John Doe",
  "phone": "string (optional)",
  "gender": "string (optional)"
}
```

### Sign In
- **Endpoint:** `POST /sign-in`
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

## File Structure

```
src/
├── services/
│   └── authService.js       # API service for authentication
├── context/
│   └── AuthContext.jsx      # Auth context provider
├── pages/
│   ├── Login/
│   │   └── Login.jsx        # Login page component
│   └── Register/
│       └── Register.jsx     # Registration page component
└── examples/
    └── AuthTokenExample.jsx # Example showing token usage
```

## How to Use

### 1. Sign Up a New User

The registration form collects:
- First Name & Last Name (combined as `name`)
- Email (required)
- Password (required)
- Phone (optional)
- Gender (optional)
- User Type (student/teacher)

```jsx
import { UserAuth } from '../context/AuthContext';

const { signUpNewUser } = UserAuth();

const userData = {
  email: 'user@example.com',
  password: 'SecurePassword123',
  name: 'John Doe',
  phone: '+1234567890',
  gender: 'male'
};

const result = await signUpNewUser(userData);

if (result.success) {
  // User registered successfully
  // Token is automatically stored in localStorage
  console.log('User data:', result.data);
} else {
  // Registration failed
  console.error('Error:', result.error);
}
```

### 2. Sign In an Existing User

```jsx
import { UserAuth } from '../context/AuthContext';

const { signInUser } = UserAuth();

const result = await signInUser('user@example.com', 'password123');

if (result.success) {
  // User signed in successfully
  // Token is automatically stored in localStorage
  console.log('User data:', result.data);
} else {
  // Sign in failed
  console.error('Error:', result.error);
}
```

### 3. Access Auth Token

There are multiple ways to access the auth token:

#### Option 1: Using AuthContext (Recommended)
```jsx
import { UserAuth } from '../context/AuthContext';

function MyComponent() {
  const { token, getToken, user, isAuthenticated } = UserAuth();

  // Direct access
  console.log('Token:', token);
  
  // Using getter function
  console.log('Token:', getToken());
  
  // Check if authenticated
  console.log('Is authenticated:', isAuthenticated());
  
  // Access user data
  console.log('User:', user);
}
```

#### Option 2: Using authService helpers
```jsx
import * as authService from '../services/authService';

// Get token
const token = authService.getAuthToken();

// Get user data
const user = authService.getCurrentUser();

// Check authentication status
const isAuth = authService.isAuthenticated();
```

#### Option 3: Direct localStorage access
```jsx
const token = localStorage.getItem('authToken');
const user = JSON.parse(localStorage.getItem('user'));
```

### 4. Make Authenticated API Requests

#### Using `authenticatedFetch` helper (Recommended)

```jsx
import { authenticatedFetch } from '../services/authService';

// GET request
const response = await authenticatedFetch('/user/profile', {
  method: 'GET'
});
const data = await response.json();

// POST request
const response = await authenticatedFetch('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' })
});
const data = await response.json();
```

#### Manual fetch with token

```jsx
import { UserAuth } from '../context/AuthContext';

const { getToken } = UserAuth();
const token = getToken();

const response = await fetch('https://api.example.com/endpoint', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
```

### 5. Sign Out

```jsx
import { UserAuth } from '../context/AuthContext';

const { signOut } = UserAuth();

await signOut(); // Clears token and user data from localStorage
```

## AuthContext API

The `AuthContext` provides the following:

| Property/Method | Type | Description |
|----------------|------|-------------|
| `user` | Object | Current user data |
| `token` | String | Current auth token |
| `isLoading` | Boolean | Loading state during initialization |
| `signUpNewUser(userData)` | Function | Register a new user |
| `signInUser(email, password)` | Function | Sign in existing user |
| `signOut()` | Function | Sign out current user |
| `getToken()` | Function | Get current auth token |
| `isAuthenticated()` | Function | Check if user is authenticated |

## authService API

The `authService` module provides the following functions:

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `signUp` | `userData` | `Promise<Object>` | Sign up a new user |
| `signIn` | `{ email, password }` | `Promise<Object>` | Sign in existing user |
| `getAuthToken` | - | `String \| null` | Get auth token from localStorage |
| `getCurrentUser` | - | `Object \| null` | Get user data from localStorage |
| `isAuthenticated` | - | `Boolean` | Check if user has valid token |
| `signOut` | - | `void` | Clear auth data from localStorage |
| `authenticatedFetch` | `endpoint, options` | `Promise<Response>` | Make authenticated API request |

## Token Storage

- **Location:** `localStorage`
- **Keys:**
  - `authToken` - The JWT/auth token
  - `user` - User data as JSON string

## Automatic Token Handling

The `authenticatedFetch` helper automatically:
1. Adds the `Authorization` header with the token
2. Handles 401 (Unauthorized) responses by:
   - Clearing stored auth data
   - Redirecting to `/login`

## Protected Routes Example

```jsx
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = UserAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Usage in router
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Error Handling

All authentication functions return a result object:

```javascript
{
  success: true,  // or false
  data: {...},    // response data (if successful)
  error: "...",   // error message (if failed)
  token: "..."    // auth token (if successful)
}
```

Example error handling:

```jsx
const result = await signInUser(email, password);

if (result.success) {
  // Handle success
  navigate('/dashboard');
} else {
  // Handle error
  setError(result.error);
}
```

## Example Component

See `/src/examples/AuthTokenExample.jsx` for a complete working example showing:
- How to access user data and tokens
- Making authenticated API requests
- Displaying auth information
- Code examples

## Notes

- Tokens are stored in localStorage and persist across browser sessions
- The AuthContext automatically checks for existing tokens on app initialization
- All API requests should use HTTPS in production
- Token expiration handling is automatic with the `authenticatedFetch` helper
