const API_BASE_URL = 'https://cosmos-its-production-v1.onrender.com/api/v1';

/**
 * Sign up a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.name - User's full name
 * @param {string} userData.phone - User's phone number (optional)
 * @param {string} userData.gender - User's gender (optional)
 * @returns {Promise<Object>} Response with success status and data/error
 */
export const signUp = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to sign up',
        status: response.status,
      };
    }

    // Store the auth token if provided
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data));
    }

    return {
      success: true,
      data: data,
      token: data.token,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Network error occurred';
    
    if (error.message === 'Failed to fetch') {
      errorMessage = 'Unable to connect to server. Please check your internet connection or try again later.';
    } else if (error.name === 'TypeError') {
      errorMessage = 'Connection failed. The server might be unavailable.';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Sign in an existing user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Response with success status and data/error
 */
export const signIn = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to sign in',
        status: response.status,
      };
    }

    // Store the auth token and user data
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data));
    }

    return {
      success: true,
      data: data,
      token: data.token,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Network error occurred';
    
    if (error.message === 'Failed to fetch') {
      errorMessage = 'Unable to connect to server. Please check your internet connection or try again later.';
    } else if (error.name === 'TypeError') {
      errorMessage = 'Connection failed. The server might be unavailable.';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Get the current auth token
 * @returns {string|null} The auth token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Get the current user data
 * @returns {Object|null} The user object or null if not found
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Sign out the current user
 */
export const signOut = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

/**
 * Make authenticated API requests
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid, sign out
    signOut();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
};
