// src/services/apiService.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
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

  // Create a new assessment
  static async createAssessment(assessmentData) {
    try {
      const response = await fetch(`${BASE_URL}/assessments`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(assessmentData)
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  // Get all assessments for a student
  static async getStudentAssessments(studentId) {
    try {
      const response = await fetch(`${BASE_URL}/assessments/student/${studentId}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching student assessments:', error);
      throw error;
    }
  }

  // Get assessments for a student in a specific course
  static async getStudentCourseAssessments(studentId, courseId) {
    try {
      const response = await fetch(`${BASE_URL}/assessments/student/${studentId}/course/${courseId}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching course assessments:', error);
      throw error;
    }
  }

  // Get student performance summary
  static async getStudentSummary(studentId) {
    try {
      const response = await fetch(`${BASE_URL}/summary/${studentId}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching student summary:', error);
      throw error;
    }
  }

  // Get performance trends for a student in a course
  static async getPerformanceTrends(studentId, courseId) {
    try {
      const response = await fetch(`${BASE_URL}/trends/${studentId}/course/${courseId}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching performance trends:', error);
      throw error;
    }
  }

  // Get course performance details
  static async getCoursePerformance(studentId, courseId) {
    try {
      const response = await fetch(`${BASE_URL}/${studentId}/${courseId}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching course performance:', error);
      throw error;
    }
  }

  // Test connection to API
  static async testConnection() {
    try {
      const response = await fetch(`${BASE_URL}/`);
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Create or continue a structured chat session
  static async structuredChat(query, threadId = null, agentName = null) {
    try {
      const requestBody = {
        query: query
      };

      // Only include thread_id if it exists (not the first message)
      if (threadId) {
        requestBody.thread_id = threadId;
      }

      // Only include agent_name if user has selected one
      if (agentName) {
        requestBody.agent_name = agentName;
      }

      const response = await fetch(`${BASE_URL}/api/v1/chats/structured`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in structured chat:', error);
      throw error;
    }
  }

  // Get chat history
  static async getChatHistory() {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/chats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }
}

export default ApiService;