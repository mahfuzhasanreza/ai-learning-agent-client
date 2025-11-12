# Authentication Implementation Guide

## Overview
This document explains the authentication implementation for the COSMOS-ITS AI Learning Platform, including token management and secure API communication.

## Features Implemented

### 1. **Authentication Token Management**
- Auth token is automatically saved to `localStorage` after successful login
- Token is included in all API requests via `Authorization: Bearer {token}` header
- Automatic redirect to login page on 401 (Unauthorized) errors
- Token is cleared from localStorage on logout or auth errors

### 2. **Secure API Communication**
All API requests now include authentication headers to prevent 401 errors.

## Files Modified

### 1. `/src/config/chatResponse.js`
**Changes:**
- Added authentication header support
- Retrieves token from `localStorage`
- Includes `Authorization: Bearer {token}` header in all chat requests
- Handles 401 errors by redirecting to login page
- Properly throws errors for better error handling

**Key Code:**
```javascript
// Get auth token from localStorage
const token = localStorage.getItem('authToken');

const headers = {
    "Content-Type": "application/json",
};

// Add Authorization header if token exists
if (token) {
    headers["Authorization"] = `Bearer ${token}`;
}
```

### 2. `/src/services/apiService.js`
**Changes:**
- Added `getAuthHeaders()` helper method
- Added `handleAuthError()` helper method
- Updated all API methods to include authentication headers
- Centralized auth error handling

**Key Methods:**
```javascript
// Helper method to get auth headers
static getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper method to handle auth errors
static handleAuthError(response) {
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
```

### 3. `/src/context/Context.jsx`
**Changes:**
- Added try-catch error handling in `onSent` function
- Better error messages for users
- Graceful handling of API failures
- Shows user-friendly error messages in the chat

**Error Handling:**
```javascript
catch (error) {
  console.error("Error in onSent:", error);
  setLoading(false);
  // Set error message in result
  setResultData(
    <div className="text-red-500">
      <p>Error: {error.message || "Failed to send message. Please try again."}</p>
      {error.message?.includes('Unauthorized') && (
        <p className="mt-2">Please log in again to continue.</p>
      )}
    </div>
  );
}
```

## Authentication Flow

### Login Process
1. User enters email and password
2. `signInUser()` is called from `AuthContext`
3. API request is sent to `/api/v1/sign-in`
4. On success:
   - Token is stored in `localStorage` as `authToken`
   - User data is stored in `localStorage` as `user`
   - User is redirected to dashboard
5. On failure:
   - Error message is displayed
   - User remains on login page

### API Request Flow
1. User sends a chat message
2. `runChat()` function is called
3. Token is retrieved from `localStorage`
4. Token is included in `Authorization` header
5. Request is sent to API
6. On success: Response is displayed
7. On 401 error:
   - Token is cleared from `localStorage`
   - User is redirected to login page

### Logout Process
1. User clicks logout
2. `signOut()` is called from `AuthContext`
3. Token and user data are removed from `localStorage`
4. User is redirected to login page

## API Request Structure

### Chat API Request (with Authentication)
```json
POST /api/v1/chats/structured
Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Body:
{
  "query": "Tell me about DBMS",
  "thread_id": "ebc2dfc3-8cb7-4fd5-8372-afa8fe00d110",
  "agent_name": "dbms_agent"
}
```

### Response (Successful)
```json
{
  "response": "Database Management System (DBMS) is...",
  "thread_id": "ebc2dfc3-8cb7-4fd5-8372-afa8fe00d110",
  "course": "DBMS"
}
```

### Response (401 Unauthorized)
```json
{
  "detail": "Could not validate credentials"
}
```
→ Triggers automatic logout and redirect to login

## Security Features

### 1. **Token Storage**
- Token stored in `localStorage` (accessible only to this domain)
- Token is NOT exposed in URLs or query parameters
- Token is cleared on logout or auth errors

### 2. **Automatic Token Refresh**
- If token expires (401 response), user is prompted to login again
- No stale tokens are used

### 3. **Protected Routes**
- All API endpoints require valid authentication
- Invalid tokens result in immediate logout

### 4. **Error Handling**
- User-friendly error messages
- Automatic cleanup on auth failures
- Graceful degradation

## Testing the Implementation

### Test 1: Login and Chat
1. Navigate to `/login`
2. Enter valid credentials
3. Click "Sign In"
4. Verify token is saved in localStorage (check DevTools → Application → Local Storage)
5. Navigate to chat page
6. Send a message
7. Verify request includes `Authorization` header (check DevTools → Network)

### Test 2: Expired Token
1. Manually modify or delete `authToken` in localStorage
2. Try to send a chat message
3. Verify you're redirected to login page

### Test 3: Agent Selection
1. Login successfully
2. Navigate to chat
3. Select an agent from dropdown
4. Send a message
5. Verify `agent_name` is included in request body

## Common Issues & Solutions

### Issue 1: "401 Unauthorized" Error
**Cause:** No token or invalid token
**Solution:** 
- Clear localStorage
- Login again
- Check if backend token validation is correct

### Issue 2: Token Not Saving
**Cause:** API not returning token in response
**Solution:**
- Check API response structure
- Ensure `data.token` exists in login response
- Verify authService.js is storing token correctly

### Issue 3: Infinite Redirect Loop
**Cause:** Protected route redirecting to login, which redirects back
**Solution:**
- Check if login page is marked as public route
- Ensure token is properly set after login

## Environment Variables

Make sure these are set in your `.env` file:

```bash
VITE_API_URL=https://cosmos-its-production-v1.onrender.com/api/v1/chats
```

## Best Practices

1. **Never commit tokens** to version control
2. **Always use HTTPS** in production
3. **Implement token refresh** for long sessions
4. **Log out on tab close** (optional)
5. **Validate token expiry** on the backend

## Future Enhancements

1. **Token Refresh Mechanism**
   - Implement automatic token refresh before expiry
   - Add refresh token support

2. **Session Management**
   - Add "Remember Me" functionality
   - Implement session timeout warnings

3. **Multi-Factor Authentication**
   - Add 2FA support
   - SMS/Email verification

4. **OAuth Integration**
   - Google Sign-In
   - Microsoft Sign-In
   - GitHub Sign-In

## Support

For issues or questions:
- Check browser console for error messages
- Verify token exists in localStorage
- Check Network tab for API request/response details
- Ensure backend is running and accessible
