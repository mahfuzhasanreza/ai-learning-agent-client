// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/apiService';

// Custom hook for student performance data
export const useStudentPerformance = (studentId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const summary = await ApiService.getStudentSummary(studentId);
      setData(summary);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching student performance:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Custom hook for course performance
export const useCoursePerformance = (studentId, courseId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!studentId || !courseId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const performance = await ApiService.getCoursePerformance(studentId, courseId);
      setData(performance);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching course performance:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Custom hook for performance trends
export const usePerformanceTrends = (studentId, courseId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!studentId || !courseId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const trends = await ApiService.getPerformanceTrends(studentId, courseId);
      setData(trends || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching performance trends:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Custom hook for assessments with CRUD operations
export const useAssessments = (studentId, courseId = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      let assessments;
      if (courseId) {
        assessments = await ApiService.getStudentCourseAssessments(studentId, courseId);
      } else {
        assessments = await ApiService.getStudentAssessments(studentId);
      }
      
      setData(assessments || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add assessment function
  const addAssessment = useCallback(async (assessmentData) => {
    try {
      const newAssessment = await ApiService.createAssessment({
        student_id: studentId,
        ...assessmentData
      });
      
      // Refresh the data
      await fetchData();
      
      return newAssessment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [studentId, fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData, 
    addAssessment 
  };
};

// Generic API hook for any API call
export const useApiCall = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('API call error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute: fetchData };
};

// Hook to test API connection
export const useApiConnection = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true);
        const connected = await ApiService.testConnection();
        setIsConnected(connected);
      } catch (error) {
        setIsConnected(false);
        console.error('API connection test failed:', error);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return { isConnected, loading };
};