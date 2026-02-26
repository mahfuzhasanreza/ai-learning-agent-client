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

  // Send a message in an existing chat thread
  static async sendChatMessage(message, threadId, metadata = {}) {
    try {
      const requestBody = {
        message: message,
        thread_id: threadId,
        metadata: metadata
      };

      const response = await fetch(`${BASE_URL}/chat/message`, {
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
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  // Create a new chat thread
  static async createChatThread(title = "New Conversation", featureType = "agentic_chat", agentName = "general_agent") {
    try {
      const response = await fetch(`${BASE_URL}/chat/threads`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          title: title,
          feature_type: featureType,
          agent_name: agentName
        })
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating chat thread:', error);
      throw error;
    }
  }

  // Get chat history
  static async getChatHistory(limit = 50, offset = 0) {
    try {
      const response = await fetch(`${BASE_URL}/chat/threads?limit=${limit}&offset=${offset}`, {
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

  // Get chat messages by thread_id
  static async getChatByThreadId(threadId) {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/chats/${threadId}`, {
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
      console.error('Error fetching chat by thread ID:', error);
      throw error;
    }
  }

  // Get available agents list
  static async getAgents() {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/agents/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('=== AGENTS API RESPONSE ===');
      console.log('Full Response:', data);
      console.log('===========================');
      return data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  // Get all available courses
  static async getCourses() {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/performance/courses`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('=== COURSES API RESPONSE ===');
      console.log('Full Response:', JSON.stringify(data, null, 2));
      console.log('Total Courses:', data.length);
      console.log('===========================');
      return data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Add student course
  static async addStudentCourse(courseData) {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/performance/student-courses`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(courseData)
      });
      
      if (!response.ok) {
        this.handleAuthError(response);
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('=== ADD STUDENT COURSE API RESPONSE ===');
      console.log('Full Response:', JSON.stringify(data, null, 2));
      console.log('Student ID:', courseData.student_id);
      console.log('Course ID:', courseData.course_id);
      console.log('Trimester:', courseData.trimester);
      console.log('Section:', courseData.section);
      console.log('Faculty:', courseData.faculty);
      console.log('===========================');
      return data;
    } catch (error) {
      console.error('Error adding student course:', error);
      throw error;
    }
  }
}

export default ApiService;