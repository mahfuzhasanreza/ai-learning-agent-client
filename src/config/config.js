// src/config/config.js

const config = {
    // API Configuration
    api: {
      baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
      timeout: 10000, // 10 seconds
      retries: 3
    },
    
    // Application Configuration
    app: {
      defaultStudentId: 123,
      defaultCourse: 'CSE1110',
      refreshInterval: 30000, // 30 seconds
      enableDebug: process.env.NODE_ENV === 'development'
    },
    
    // Chart Configuration
    chart: {
      colors: {
        primary: 'rgb(59, 130, 246)', // blue-500
        success: 'rgb(34, 197, 94)',  // green-500
        warning: 'rgb(245, 158, 11)',  // yellow-500
        danger: 'rgb(239, 68, 68)',    // red-500
      },
      defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'white',
              font: { size: 12 }
            }
          }
        }
      }
    }
  };
  
  export default config;