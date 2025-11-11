const API_BASE_URL = 'https://cosmos-its-production-v1.onrender.com/api/v1';

/**
 * Check if the API server is reachable
 * @returns {Promise<Object>} Status object with reachable boolean and message
 */
export const checkAPIHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      reachable: response.ok,
      status: response.status,
      message: response.ok ? 'API server is reachable' : 'API server returned an error',
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        reachable: false,
        message: 'Connection timeout. The server is taking too long to respond.',
      };
    }

    return {
      reachable: false,
      message: 'Cannot reach API server. Please check your internet connection.',
      error: error.message,
    };
  }
};

/**
 * Check if user has internet connection
 * @returns {boolean} True if online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Test API endpoint with a simple request
 * @param {string} endpoint - Endpoint to test (e.g., '/sign-in')
 * @returns {Promise<Object>} Test result
 */
export const testEndpoint = async (endpoint) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'OPTIONS', // Use OPTIONS to test without sending data
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      reachable: true,
      status: response.status,
      message: `Endpoint ${endpoint} is reachable`,
    };
  } catch (error) {
    return {
      reachable: false,
      message: `Cannot reach endpoint ${endpoint}`,
      error: error.message,
    };
  }
};

/**
 * Get network diagnostics information
 * @returns {Promise<Object>} Diagnostic information
 */
export const getNetworkDiagnostics = async () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    browserOnline: isOnline(),
    apiReachable: false,
    apiMessage: '',
  };

  try {
    const healthCheck = await checkAPIHealth();
    diagnostics.apiReachable = healthCheck.reachable;
    diagnostics.apiMessage = healthCheck.message;
    diagnostics.apiStatus = healthCheck.status;
  } catch (error) {
    diagnostics.apiMessage = 'Health check failed: ' + error.message;
  }

  return diagnostics;
};

/**
 * Listen for online/offline events
 * @param {Function} callback - Callback function receiving online status
 */
export const listenToNetworkChanges = (callback) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
