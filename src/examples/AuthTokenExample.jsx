import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { authenticatedFetch } from '../services/authService';

/**
 * Example component showing how to access and use the auth token
 * This component demonstrates:
 * 1. Getting the auth token from the AuthContext
 * 2. Displaying user information
 * 3. Making authenticated API requests
 */
const AuthTokenExample = () => {
  const { user, token, getToken, isAuthenticated } = UserAuth();
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Current User:', user);
    console.log('Auth Token:', token);
    console.log('Is Authenticated:', isAuthenticated());
  }, [user, token, isAuthenticated]);

  // Example: Make an authenticated API request
  const makeAuthenticatedRequest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Example endpoint - replace with your actual API endpoint
      const response = await authenticatedFetch('/user/profile', {
        method: 'GET',
      });

      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      console.error('API request error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example: Make a POST request with auth token
  const makeAuthenticatedPostRequest = async (dataToSend) => {
    try {
      const response = await authenticatedFetch('/api/endpoint', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('POST request error:', err);
      throw err;
    }
  };

  // Example: Manually use the token in a custom fetch
  const customFetchWithToken = async () => {
    const authToken = getToken();
    
    try {
      const response = await fetch('https://cosmos-its-production-v1.onrender.com/api/v1/some-endpoint', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      console.log('Custom fetch response:', data);
      return data;
    } catch (err) {
      console.error('Custom fetch error:', err);
      throw err;
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Not Authenticated</h2>
        <p className="text-yellow-700">Please log in to access this content.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Auth Token Example</h1>

      {/* User Information */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">User Information</h2>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {user?.email || 'N/A'}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {user?.name || 'N/A'}
          </p>
        </div>
      </div>

      {/* Auth Token Display */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-semibold text-green-900 mb-3">Auth Token</h2>
        <div className="bg-white p-3 rounded border border-green-300 overflow-x-auto">
          <code className="text-sm text-gray-800 break-all">
            {token || 'No token available'}
          </code>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          You can use this token in the Authorization header as: <code className="bg-gray-100 px-2 py-1 rounded">Bearer {'{token}'}</code>
        </p>
      </div>

      {/* API Request Example */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h2 className="text-xl font-semibold text-purple-900 mb-3">Make Authenticated Request</h2>
        <button
          onClick={makeAuthenticatedRequest}
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Loading...' : 'Test API Request'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {apiResponse && (
          <div className="mt-4 p-3 bg-white border border-purple-300 rounded">
            <h3 className="font-semibold text-purple-900 mb-2">API Response:</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Code Examples */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Use Auth Token in Your Code</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">1. Using authenticatedFetch helper:</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { authenticatedFetch } from '../services/authService';

const response = await authenticatedFetch('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify({ data: 'example' })
});`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">2. Using getToken() from context:</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { UserAuth } from '../context/AuthContext';

const { getToken } = UserAuth();
const token = getToken();

fetch('https://api.example.com/endpoint', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">3. Accessing from localStorage directly:</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`const token = localStorage.getItem('authToken');
const user = JSON.parse(localStorage.getItem('user'));`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTokenExample;
