# 🔧 Network Connection Troubleshooting Guide

## Error: `ERR_INTERNET_DISCONNECTED` or `Failed to fetch`

This error occurs when the application cannot connect to the backend API server.

## 🔍 Common Causes & Solutions

### 1. **No Internet Connection**
   
**Check:**
- ✅ Are you connected to WiFi or Ethernet?
- ✅ Can you access other websites?
- ✅ Try opening `https://google.com` in another tab

**Solution:**
- Reconnect to your internet
- Try switching networks (WiFi to mobile hotspot)
- Restart your router

### 2. **Backend Server is Down**

**Check:**
- ✅ Visit the backend URL directly in your browser:
  ```
  https://cosmos-its-production-v1.onrender.com/api/v1/
  ```
- ✅ If you see "Cannot GET /api/v1/", the server is running but has no root endpoint (this is normal)
- ✅ If you see connection timeout or error, the server might be down

**Solution:**
- Wait a few minutes and try again
- Contact the backend team
- Check if the server is hosted on a free tier that might sleep (Render free tier)

### 3. **CORS Issues**

**Check:**
- ✅ Open browser DevTools (F12) → Console tab
- ✅ Look for CORS-related error messages

**Solution:**
- Backend needs to allow your frontend origin
- Contact backend team to add CORS headers

### 4. **Firewall or VPN Blocking**

**Check:**
- ✅ Disable VPN temporarily
- ✅ Try from a different network
- ✅ Check if company/school firewall blocks the domain

**Solution:**
- Whitelist the backend domain in your firewall
- Use a different network
- Contact IT support

### 5. **Browser Issues**

**Check:**
- ✅ Try in incognito/private mode
- ✅ Try a different browser
- ✅ Clear browser cache and cookies

**Solution:**
```bash
# Clear all site data for your app
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Click "Clear site data"
```

## 🛠️ Quick Diagnostic Steps

### Step 1: Check Internet Connection
```bash
# Open terminal/command prompt and run:
ping google.com
```

### Step 2: Test Backend Server
```bash
# Try to reach the backend (if you have curl):
curl https://cosmos-its-production-v1.onrender.com/api/v1/

# Or visit in browser:
https://cosmos-its-production-v1.onrender.com
```

### Step 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Go to Network tab
5. Try login/signup again
6. Look at the failed request details

### Step 4: Use Network Status Component

Add the NetworkStatus component to your app:

```jsx
// In your App.jsx or main layout
import NetworkStatus from './components/NetworkStatus';

function App() {
  return (
    <>
      <NetworkStatus />
      {/* Your other components */}
    </>
  );
}
```

This will show a notification when there are connection issues.

## 📝 What to Report if Issue Persists

If you need to report this issue, collect this information:

1. **Error Details:**
   - Full error message from console
   - Network tab screenshot (DevTools → Network)
   
2. **Environment:**
   - Browser name and version
   - Operating system
   - Internet connection type (WiFi/Ethernet)
   
3. **Test Results:**
   - Can you access https://cosmos-its-production-v1.onrender.com directly?
   - Can you access other websites?
   - Does it work in incognito mode?
   - Does it work in a different browser?

4. **Network Diagnostics:**
   ```jsx
   // Add this to your console to get diagnostics
   import { getNetworkDiagnostics } from './utils/networkCheck';
   const diagnostics = await getNetworkDiagnostics();
   console.log(diagnostics);
   ```

## 🚀 Workarounds While Debugging

### 1. Use Mock Data (Development Only)

Create a mock auth service for testing:

```jsx
// src/services/mockAuthService.js
export const mockSignIn = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    data: {
      user: { email, name: 'Test User' },
      token: 'mock-jwt-token-' + Date.now()
    },
    token: 'mock-jwt-token-' + Date.now()
  };
};
```

### 2. Check Backend Logs

If you have access to the backend:
- Check server logs for incoming requests
- Verify the API endpoints are deployed
- Check if the server is running

### 3. Test with Alternative Tools

Use tools like:
- **Postman** - Test API endpoints directly
- **Thunder Client** (VS Code extension) - API testing in editor
- **curl** - Command line testing

Example curl test:
```bash
curl -X POST https://cosmos-its-production-v1.onrender.com/api/v1/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## ✅ Prevention Tips

1. **Add Network Status Monitoring**
   - Use the `NetworkStatus` component
   - Shows real-time connection status

2. **Better Error Messages**
   - Already implemented in `authService.js`
   - Shows user-friendly messages

3. **Retry Logic**
   - Consider adding automatic retry for failed requests
   - Add exponential backoff

4. **Offline Mode**
   - Cache data when online
   - Show cached data when offline

## 📞 Need More Help?

- Check backend server status
- Review backend documentation
- Contact backend team
- Check if using free tier hosting (might have cold starts)

---

**Remember:** The `ERR_INTERNET_DISCONNECTED` error usually means:
1. Your computer has no internet (most common)
2. The backend server is unreachable
3. Network firewall is blocking the request

Start with checking your internet connection first! 🌐
