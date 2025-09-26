// src/services/apiService.js

const BASE_URL = 'http://localhost:8000'; // Change this to your FastAPI server URL

class ApiService {
  // Create a new assessment
  static async createAssessment(assessmentData) {
    try {
      const response = await fetch(`${BASE_URL}/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });
      
      if (!response.ok) {
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
      const response = await fetch(`${BASE_URL}/assessments/student/${studentId}`);
      
      if (!response.ok) {
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
      const response = await fetch(`${BASE_URL}/assessments/student/${studentId}/course/${courseId}`);
      
      if (!response.ok) {
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
      const response = await fetch(`${BASE_URL}/summary/${studentId}`);
      
      if (!response.ok) {
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
      const response = await fetch(`${BASE_URL}/trends/${studentId}/course/${courseId}`);
      
      if (!response.ok) {
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
      const response = await fetch(`${BASE_URL}/${studentId}/${courseId}`);
      
      if (!response.ok) {
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
}

export default ApiService;