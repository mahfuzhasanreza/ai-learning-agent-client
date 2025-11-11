# 🚀 Quick Start Guide - Authentication

## ✅ What's Been Set Up

Your authentication system is now fully configured to work with your backend API at:
`https://cosmos-its-production-v1.onrender.com/api/v1`

## 📁 Files Created/Modified

### ✨ New Files:
1. **`src/services/authService.js`** - API service for authentication
2. **`src/components/ProtectedRoute.jsx`** - Component for protected routes
3. **`src/examples/AuthTokenExample.jsx`** - Example component
4. **`AUTH_README.md`** - Detailed documentation

### 🔧 Modified Files:
1. **`src/context/AuthContext.jsx`** - Updated to use custom API
2. **`src/pages/Login/Login.jsx`** - Updated login flow
3. **`src/pages/Register/Register.jsx`** - Updated registration flow with phone & gender fields

## 🎯 Quick Usage

### 1. Register a New User

The registration form now includes:
- ✅ First Name & Last Name
- ✅ Email
- ✅ Password & Confirm Password
- ✅ Phone (optional)
- ✅ Gender (optional)
- ✅ User Type (student/teacher)

Users will be automatically logged in and redirected to `/dashboard` after successful registration.

### 2. Login

Users can log in with:
- Email
- Password

After successful login, they'll be redirected to `/dashboard`.

### 3. Access Auth Token in Your Components

```jsx
import { UserAuth } from './context/AuthContext';

function MyComponent() {
  const { user, token, getToken, isAuthenticated } = UserAuth();
  
  console.log('Token:', token);
  console.log('User:', user);
  console.log('Authenticated:', isAuthenticated());
}
```

### 4. Make Authenticated API Requests

```jsx
import { authenticatedFetch } from './services/authService';

// The token is automatically included in the Authorization header
const response = await authenticatedFetch('/your-endpoint', {
  method: 'POST',
  body: JSON.stringify({ data: 'example' })
});

const data = await response.json();
```

### 5. Protect Routes

```jsx
// In your router file
import ProtectedRoute from './components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## 🔑 Token Storage

Tokens are automatically stored in `localStorage`:
- **Key:** `authToken`
- **User Data:** `user`

You can access them directly:
```javascript
const token = localStorage.getItem('authToken');
const user = JSON.parse(localStorage.getItem('user'));
```

## 🛡️ Security Features

✅ **Automatic Token Management** - Tokens are automatically saved on login/register
✅ **Auto-Redirect on 401** - Expired tokens trigger automatic logout and redirect to login
✅ **Password Strength Indicator** - Visual feedback on registration
✅ **Error Handling** - User-friendly error messages
✅ **Loading States** - Smooth UX during API calls

## 📖 Examples

See the example component for complete working code:
```
src/examples/AuthTokenExample.jsx
```

## 🔧 Testing

1. **Register a new account** at `/register`
2. Check browser's **Developer Tools → Application → Local Storage** to see the token
3. Check browser's **Console** to see the token and user data logged
4. Try accessing a protected route
5. Make an authenticated API request

## 📚 Full Documentation

For detailed documentation, see: **`AUTH_README.md`**

## 🐛 Common Issues

### Issue: "Failed to fetch" error
**Solution:** Check that your backend API is running and accessible

### Issue: Token not found
**Solution:** Make sure you're logged in. Check localStorage for `authToken`

### Issue: 401 Unauthorized
**Solution:** Token might be expired. Try logging in again

## 💡 Next Steps

1. Update your router to use `ProtectedRoute` for authenticated pages
2. Test the registration and login flows
3. Implement your protected components (Dashboard, etc.)
4. Add logout functionality to your UI components using `signOut()` from AuthContext

## 🎨 UI Features

Both Login and Register pages include:
- ✨ Beautiful gradient designs
- 🎭 Animated backgrounds
- 📱 Fully responsive (mobile to desktop)
- ⚡ Real-time form validation
- 🔒 Password strength indicator (Register)
- 👁️ Password visibility toggle
- ⚠️ Error message display with auto-dismiss
- 🎯 Loading states during API calls

Enjoy your new authentication system! 🎉
