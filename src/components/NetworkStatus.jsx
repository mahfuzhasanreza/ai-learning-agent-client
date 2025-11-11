import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { isOnline, checkAPIHealth } from '../utils/networkCheck';

/**
 * NetworkStatus component - Shows connection status and helps debug network issues
 * Add this to your app to monitor connectivity
 */
const NetworkStatus = () => {
  const [online, setOnline] = useState(isOnline());
  const [apiStatus, setApiStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Check API status on mount
    checkAPI();

    // Listen for network changes
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkAPI = async () => {
    setChecking(true);
    const status = await checkAPIHealth();
    setApiStatus(status);
    setChecking(false);
  };

  // Don't show anything if everything is working
  if (online && apiStatus?.reachable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className={`rounded-lg shadow-lg p-4 border-2 ${
        !online 
          ? 'bg-red-50 border-red-500' 
          : !apiStatus?.reachable 
          ? 'bg-yellow-50 border-yellow-500' 
          : 'bg-green-50 border-green-500'
      }`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {!online ? (
              <WifiOff className="w-6 h-6 text-red-600" />
            ) : !apiStatus?.reachable ? (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold text-sm mb-1 ${
              !online ? 'text-red-800' : !apiStatus?.reachable ? 'text-yellow-800' : 'text-green-800'
            }`}>
              {!online ? 'No Internet Connection' : !apiStatus?.reachable ? 'Server Connection Issue' : 'Connected'}
            </h3>
            
            <p className={`text-xs ${
              !online ? 'text-red-700' : !apiStatus?.reachable ? 'text-yellow-700' : 'text-green-700'
            }`}>
              {!online 
                ? 'Please check your internet connection and try again.' 
                : apiStatus?.message || 'Checking server status...'}
            </p>

            {online && (
              <button
                onClick={checkAPI}
                disabled={checking}
                className={`mt-2 text-xs font-medium flex items-center space-x-1 ${
                  !apiStatus?.reachable ? 'text-yellow-700 hover:text-yellow-800' : 'text-green-700 hover:text-green-800'
                } disabled:opacity-50`}
              >
                <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
                <span>{checking ? 'Checking...' : 'Check Again'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
