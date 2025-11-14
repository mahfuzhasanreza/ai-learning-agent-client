import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import * as Chart from 'chart.js';
import Navigation from "../../components/LandingPage/components/Navigation";
import ApiService from '../../services/apiService';
import {
  useStudentPerformance,
  useCoursePerformance,
  usePerformanceTrends,
  useAssessments,
  useApiConnection
} from '../../hooks/useApi';
import {
  User,
  Plus,
  BookOpen,
  Target,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Calendar,
  BarChart3,
  PieChart,
  Edit,
  X,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import Sidebar from '../Shared/Sidebar/Sidebar';
import { Context } from '../../context/Context';
import Quiz from '../../components/Quiz/Quiz';
import FooterSection from '../../components/LandingPage/sections/FooterSection';

const StudentDashboard = () => {

  const { isDark } = useContext(Context);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Configuration
  const STUDENT_ID = 123;
  const CURRENT_COURSE = "CSE1110";

  // API Connection Test
  const { isConnected, loading: connectionLoading } = useApiConnection();

  // API Hooks
  const {
    data: studentSummary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary
  } = useStudentPerformance(STUDENT_ID);

  const {
    data: coursePerformance,
    loading: courseLoading,
    error: courseError,
    refetch: refetchCourse
  } = useCoursePerformance(STUDENT_ID, CURRENT_COURSE);

  const {
    data: trends,
    loading: trendsLoading,
    error: trendsError,
    refetch: refetchTrends
  } = usePerformanceTrends(STUDENT_ID, CURRENT_COURSE);

  const {
    data: assessments,
    loading: assessmentsLoading,
    error: assessmentsError,
    addAssessment,
    refetch: refetchAssessments
  } = useAssessments(STUDENT_ID, CURRENT_COURSE);

  // Local state for forms and UI
  const [showAddAssessmentForm, setShowAddAssessmentForm] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    assessment_type: 'CT',
    score: '',
    max_marks: 100,
    feedback: ''
  });

  // State for available courses
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [selectedCourseToAdd, setSelectedCourseToAdd] = useState(null);
  const [addCourseForm, setAddCourseForm] = useState({
    trimester: '',
    section: '',
    faculty: ''
  });
  const [addingCourse, setAddingCourse] = useState(false);

  // State for trimester selection and enrolled courses
  const [selectedTrimester, setSelectedTrimester] = useState('Summer25');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingEnrolledCourses, setLoadingEnrolledCourses] = useState(false);
  const [enrolledCoursesError, setEnrolledCoursesError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Available trimesters
  const availableTrimesters = [
    { value: 'Spring25', label: 'Spring 25' },
    { value: 'Summer25', label: 'Summer 25' },
    { value: 'Fall25', label: 'Fall 25' },
    { value: 'Spring26', label: 'Spring 26' },
    { value: 'Summer26', label: 'Summer 26' },
    { value: 'Fall26', label: 'Fall 26' }
  ];

  // Static data (fallback when API is not available)
  const [studentData, setStudentData] = useState({
    name: "Sadik",
    completedCredits: 110,
    cgpa: 3.9,
    currentTrimester: "Summer 25",
    trimesterCredits: 12,
    courses: [
      {
        id: 1,
        code: "CSE 1110",
        credits: 3,
        difficulty: "LOW",
        progress: 69,
        instructor: "Dr. Ada Lovelace",
        color: "green"
      },
      {
        id: 2,
        code: "MATH 2020",
        credits: 3,
        difficulty: "MEDIUM",
        progress: 30,
        color: "yellow"
      },
      {
        id: 3,
        code: "PHY 1500",
        credits: 3,
        difficulty: "LOW",
        progress: 14,
        color: "green"
      },
      {
        id: 4,
        code: "ENG 1010",
        credits: 4.5,
        difficulty: "LOW",
        progress: 31,
        color: "yellow"
      }
    ],
    selectedCourse: {
      code: "CSE 1110",
      title: "Structured Programming Language",
      instructor: "Dr. Ada Lovelace",
      credits: 3,
      progress: 68,
      topicMastery: 69,
      topics: [
        { name: "Variables", progress: 85 },
        { name: "Loops", progress: 65 },
        { name: "Functions", progress: 90 },
        { name: "Arrays", progress: 78 },
        { name: "Pointers", progress: 82 },
        { name: "Structures", progress: 88 },
        { name: "Recursion", progress: 70 },
        { name: "File Handling", progress: 75 }
      ],
      weaknesses: [
        { topic: "Loops", severity: 0.15 },
        { topic: "Arrays", severity: 0.25 },
        { topic: "Recursion", severity: 0.6 }
      ],
      ctMethods: {
        spl: { marks: 20, bestCount: "3 out of 4" }
      }
    }
  });

  // Chart data
  const chartData = {
    labels: ['Loops', 'Array', 'Recursion'],
    datasets: [{
      label: 'Weakness Severity',
      data: [0.15, 0.25, 0.6],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  // Initialize chart
  useEffect(() => {
    Chart.Chart.register(
      Chart.ArcElement,
      Chart.Tooltip,
      Chart.Legend,
      Chart.PieController
    );

    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart.Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
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
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  // Handle form submission
  const handleAddAssessment = async (e) => {
    e.preventDefault();
    try {
      await addAssessment({
        course_id: CURRENT_COURSE,
        assessment_type: assessmentForm.assessment_type,
        score: parseFloat(assessmentForm.score),
        max_marks: parseFloat(assessmentForm.max_marks),
        feedback: assessmentForm.feedback || null
      });

      // Reset form
      setAssessmentForm({
        assessment_type: 'CT',
        score: '',
        max_marks: 100,
        feedback: ''
      });
      setShowAddAssessmentForm(false);

      // Refresh related data
      refetchCourse();
      refetchTrends();
      refetchSummary();

    } catch (error) {
      console.error('Failed to add assessment:', error);
      alert('Failed to add assessment. Please try again.');
    }
  };

  // Refresh all data
  const refreshAllData = async () => {
    try {
      await Promise.all([
        refetchSummary(),
        refetchCourse(),
        refetchTrends(),
        refetchAssessments()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Fetch available courses
  const fetchCourses = async () => {
    setLoadingCourses(true);
    setCoursesError(null);
    try {
      const courses = await ApiService.getCourses();
      setAvailableCourses(courses);
      setShowCoursesModal(true);
    } catch (error) {
      setCoursesError(error.message || 'Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch enrolled courses for selected trimester with retry logic
  const fetchEnrolledCourses = useCallback(async (trimester, retryCount = 0) => {
    setLoadingEnrolledCourses(true);
    setEnrolledCoursesError(null);
    try {
      // TODO: Replace with actual student_id from auth context
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `${baseUrl}/api/v1/student/${STUDENT_ID}/courses/${trimester}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEnrolledCourses(data);

      // Automatically select the first course
      if (data.length > 0) {
        setSelectedCourse(data[0]);
      } else {
        setSelectedCourse(null);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);

      // Retry logic for network errors
      if (retryCount < 2 && (error.name === 'AbortError' || error.message.includes('fetch'))) {
        console.log(`Retrying fetchEnrolledCourses... Attempt ${retryCount + 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return fetchEnrolledCourses(trimester, retryCount + 1);
      }

      setEnrolledCoursesError(error.message || 'Failed to fetch enrolled courses');
      setSelectedCourse(null);
    } finally {
      setLoadingEnrolledCourses(false);
    }
  }, []);

  // Fetch enrolled courses when trimester changes
  useEffect(() => {
    fetchEnrolledCourses(selectedTrimester);
  }, [selectedTrimester, fetchEnrolledCourses]);

  // Handle adding a student course
  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!selectedCourseToAdd) {
      alert('Please select a course first');
      return;
    }

    if (!addCourseForm.trimester || !addCourseForm.section || !addCourseForm.faculty) {
      alert('Please fill in all fields');
      return;
    }

    setAddingCourse(true);
    try {
      // TODO: Replace with actual student_id from auth context
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";

      await ApiService.addStudentCourse({
        student_id: STUDENT_ID,
        course_id: selectedCourseToAdd.id,
        trimester: addCourseForm.trimester,
        section: addCourseForm.section,
        faculty: addCourseForm.faculty
      });

      // Reset form and close modal
      setAddCourseForm({
        trimester: '',
        section: '',
        faculty: ''
      });
      setSelectedCourseToAdd(null);
      setShowCoursesModal(false);
      setCourseSearchQuery('');

      // Show success notification
      setShowAddSuccessNotification(true);
      setTimeout(() => {
        setShowAddSuccessNotification(false);
      }, 3000);

      // Refresh enrolled courses
      fetchEnrolledCourses(selectedTrimester);

    } catch (error) {
      console.error('Error adding course:', error);

      // Extract error message
      let errorMessage = 'Failed to add course. Please try again.';

      if (error.message) {
        // Check if it's the "already enrolled" error
        if (error.message.includes('already enrolled')) {
          errorMessage = 'You are already enrolled in this course for this trimester.';
        } else {
          errorMessage = error.message;
        }
      }

      // Show failure notification
      setAddFailureMessage(errorMessage);
      setShowAddFailureNotification(true);
      setTimeout(() => {
        setShowAddFailureNotification(false);
      }, 5000); // Show error for 5 seconds

    } finally {
      setAddingCourse(false);
    }
  };

  // Handle delete course confirmation
  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  // Confirm and delete course
  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    setDeletingCourse(true);
    try {
      // TODO: Replace with actual student_id from auth context
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/api/v1/performance/student-courses`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: STUDENT_ID,
          course_id: courseToDelete.course_id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Close confirmation modal
      setShowDeleteConfirm(false);
      setCourseToDelete(null);

      // Show success notification
      setShowSuccessNotification(true);

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);

      // Refresh the enrolled courses list (with delay to avoid race condition)
      setTimeout(() => {
        fetchEnrolledCourses(selectedTrimester);
      }, 300);

    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.message || 'Failed to delete course. Please try again.');
    } finally {
      setDeletingCourse(false);
    }
  };

  // Update CT Count
  const updateCTCount = async (count) => {
    if (!selectedCourse || count === null || count === undefined) return;

    setUpdatingCounts(true);
    try {
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/api/v1/performance/ct-count`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: STUDENT_ID,
          course_id: selectedCourse.course_id,
          best_count: parseInt(count)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setSelectedCourse({
        ...selectedCourse,
        ct_count: parseInt(count)
      });

      // Show success notification
      setCountUpdateMessage('CT count updated successfully');
      setShowCountUpdateSuccess(true);
      setTimeout(() => {
        setShowCountUpdateSuccess(false);
      }, 3000);

      // Refresh enrolled courses to get updated data (with delay to avoid race condition)
      setTimeout(() => {
        fetchEnrolledCourses(selectedTrimester);
      }, 300);

    } catch (error) {
      console.error('Error updating CT count:', error);
      setAddFailureMessage('Failed to update CT count. Please try again.');
      setShowAddFailureNotification(true);
      setTimeout(() => {
        setShowAddFailureNotification(false);
      }, 5000);
    } finally {
      setUpdatingCounts(false);
      setEditingCTCount(false);
    }
  };

  // Update Assignment Count
  const updateAssignmentCount = async (count) => {
    if (!selectedCourse || count === null || count === undefined) return;

    setUpdatingCounts(true);
    try {
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/api/v1/performance/assignment-count`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: STUDENT_ID,
          course_id: selectedCourse.course_id,
          best_count: parseInt(count)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setSelectedCourse({
        ...selectedCourse,
        assignment_count: parseInt(count)
      });

      // Show success notification
      setCountUpdateMessage('Assignment count updated successfully');
      setShowCountUpdateSuccess(true);
      setTimeout(() => {
        setShowCountUpdateSuccess(false);
      }, 3000);

      // Refresh enrolled courses to get updated data (with delay to avoid race condition)
      setTimeout(() => {
        fetchEnrolledCourses(selectedTrimester);
      }, 300);

    } catch (error) {
      console.error('Error updating assignment count:', error);
      setAddFailureMessage('Failed to update assignment count. Please try again.');
      setShowAddFailureNotification(true);
      setTimeout(() => {
        setShowAddFailureNotification(false);
      }, 5000);
    } finally {
      setUpdatingCounts(false);
      setEditingAssignmentCount(false);
    }
  };

  // Handle adding assessment
  const handleAddAssessmentSubmit = async () => {
    if (!selectedCourse) {
      setAddFailureMessage('Please select a course first');
      setShowAddFailureNotification(true);
      setTimeout(() => setShowAddFailureNotification(false), 5000);
      return;
    }

    // Validation
    if (!newAssessment.marks || !newAssessment.full_marks) {
      setAddFailureMessage('Please fill in all required fields');
      setShowAddFailureNotification(true);
      setTimeout(() => setShowAddFailureNotification(false), 5000);
      return;
    }

    if ((newAssessment.assessment_type === 'ct' || newAssessment.assessment_type === 'assignment') &&
      !(newAssessment.ct_no || newAssessment.assignment_no)) {
      setAddFailureMessage(`Please enter ${newAssessment.assessment_type === 'ct' ? 'CT' : 'Assignment'} number`);
      setShowAddFailureNotification(true);
      setTimeout(() => setShowAddFailureNotification(false), 5000);
      return;
    }

    setAddingAssessment(true);
    try {
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const requestBody = {
        student_id: STUDENT_ID,
        course_id: selectedCourse.course_id,
        assessment_type: newAssessment.assessment_type,
        marks: parseFloat(newAssessment.marks),
        full_marks: parseFloat(newAssessment.full_marks)
      };

      // Add ct_no or assignment_no if applicable
      if (newAssessment.assessment_type === 'ct') {
        requestBody.ct_no = parseInt(newAssessment.ct_no);
      } else if (newAssessment.assessment_type === 'assignment') {
        requestBody.assignment_no = parseInt(newAssessment.assignment_no);
      }

      const response = await fetch(`${baseUrl}/api/v1/performance/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Reset form
      setNewAssessment({
        assessment_type: 'ct',
        ct_no: '',
        assignment_no: '',
        marks: '',
        full_marks: ''
      });

      // Close modal
      setShowAddAssessmentModal(false);

      // Show success notification
      setCountUpdateMessage('Assessment added successfully');
      setShowCountUpdateSuccess(true);
      setTimeout(() => {
        setShowCountUpdateSuccess(false);
      }, 3000);

      // Only refresh assessments, not the course section
      if (selectedCourse?.course_id) {
        fetchAssessments(selectedCourse.course_id);
      }

    } catch (error) {
      console.error('Error adding assessment:', error);
      setAddFailureMessage(error.message || 'Failed to add assessment. Please try again.');
      setShowAddFailureNotification(true);
      setTimeout(() => {
        setShowAddFailureNotification(false);
      }, 5000);
    } finally {
      setAddingAssessment(false);
    }
  };

  // Handle edit assessment - open modal with pre-filled data
  const handleEditAssessment = (assessment) => {
    setAssessmentToUpdate(assessment);
    setUpdateAssessmentForm({
      assessment_type: assessment.assessment_type,
      ct_no: assessment.ct_no || '',
      assignment_no: assessment.assignment_no || '',
      marks: assessment.marks,
      full_marks: assessment.full_marks
    });
    setShowUpdateAssessmentModal(true);
  };

  // Handle update assessment submit
  const handleUpdateAssessmentSubmit = async () => {
    if (!assessmentToUpdate) return;

    // Validation
    if (!updateAssessmentForm.marks || !updateAssessmentForm.full_marks) {
      setAddFailureMessage('Please fill in all required fields');
      setShowAddFailureNotification(true);
      setTimeout(() => setShowAddFailureNotification(false), 5000);
      return;
    }

    if ((updateAssessmentForm.assessment_type === 'ct' || updateAssessmentForm.assessment_type === 'assignment') &&
      !(updateAssessmentForm.ct_no || updateAssessmentForm.assignment_no)) {
      setAddFailureMessage(`Please enter ${updateAssessmentForm.assessment_type === 'ct' ? 'CT' : 'Assignment'} number`);
      setShowAddFailureNotification(true);
      setTimeout(() => setShowAddFailureNotification(false), 5000);
      return;
    }

    setUpdatingAssessment(true);
    try {
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const requestBody = {
        student_id: STUDENT_ID,
        assessment_type: updateAssessmentForm.assessment_type,
        marks: parseFloat(updateAssessmentForm.marks),
        full_marks: parseFloat(updateAssessmentForm.full_marks)
      };

      // Add ct_no or assignment_no if applicable
      if (updateAssessmentForm.assessment_type === 'ct') {
        requestBody.ct_no = parseInt(updateAssessmentForm.ct_no);
      } else if (updateAssessmentForm.assessment_type === 'assignment') {
        requestBody.assignment_no = parseInt(updateAssessmentForm.assignment_no);
      }

      const response = await fetch(`${baseUrl}/api/v1/performance/assessments/${assessmentToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Close modal
      setShowUpdateAssessmentModal(false);
      setAssessmentToUpdate(null);

      // Show success notification
      setCountUpdateMessage('Assessment updated successfully');
      setShowCountUpdateSuccess(true);
      setTimeout(() => {
        setShowCountUpdateSuccess(false);
      }, 3000);

      // Refresh assessments
      if (selectedCourse?.course_id) {
        fetchAssessments(selectedCourse.course_id);
      }

    } catch (error) {
      console.error('Error updating assessment:', error);
      setAddFailureMessage(error.message || 'Failed to update assessment. Please try again.');
      setShowAddFailureNotification(true);
      setTimeout(() => {
        setShowAddFailureNotification(false);
      }, 5000);
    } finally {
      setUpdatingAssessment(false);
    }
  };

  // Handle delete assessment - open confirmation modal
  const handleDeleteAssessment = (assessment) => {
    setAssessmentToDelete(assessment);
    setShowDeleteAssessmentConfirm(true);
  };

  // Confirm and delete assessment
  const confirmDeleteAssessment = async () => {
    if (!assessmentToDelete) return;

    setDeletingAssessment(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const response = await fetch(`${baseUrl}/api/v1/performance/assessments/${assessmentToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Close confirmation modal
      setShowDeleteAssessmentConfirm(false);
      setAssessmentToDelete(null);

      // Show success notification
      setCountUpdateMessage('Assessment deleted successfully');
      setShowCountUpdateSuccess(true);
      setTimeout(() => {
        setShowCountUpdateSuccess(false);
      }, 3000);

      // Refresh assessments
      if (selectedCourse?.course_id) {
        fetchAssessments(selectedCourse.course_id);
      }

    } catch (error) {
      console.error('Error deleting assessment:', error);
      setAddFailureMessage(error.message || 'Failed to delete assessment. Please try again.');
      setShowAddFailureNotification(true);
      setTimeout(() => {
        setShowAddFailureNotification(false);
      }, 5000);
    } finally {
      setDeletingAssessment(false);
    }
  };

  // Fetch assessments for selected course with retry logic
  const fetchAssessments = useCallback(async (courseId, retryCount = 0) => {
    if (!courseId) return;

    setLoadingFetchedAssessments(true);
    setFetchedAssessmentsError(null);
    try {
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `${baseUrl}/api/v1/performance/assessments/student/${STUDENT_ID}/course/${courseId}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFetchedAssessments(data);

    } catch (error) {
      console.error('Error fetching assessments:', error);

      // Retry logic for network errors
      if (retryCount < 2 && (error.name === 'AbortError' || error.message.includes('fetch'))) {
        console.log(`Retrying fetchAssessments... Attempt ${retryCount + 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return fetchAssessments(courseId, retryCount + 1);
      }

      setFetchedAssessmentsError(error.message || 'Failed to fetch assessments');
    } finally {
      setLoadingFetchedAssessments(false);
    }
  }, []);

  // Fetch assessments when course changes
  useEffect(() => {
    if (selectedCourse?.course_id) {
      fetchAssessments(selectedCourse.course_id);
    } else {
      setFetchedAssessments([]);
    }
  }, [selectedCourse, fetchAssessments]);

  // Components
  const CircularProgress = ({ percentage, size = 60, strokeWidth = 4, color = "primary" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    const colorClasses = {
      blue: "stroke-blue-500",
      green: "stroke-green-500",
      yellow: "stroke-yellow-500",
      red: "stroke-red-500",
      primary: "stroke-[#FF4B00]",
    };

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            className={colorClasses[color]}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-white">{percentage}</span>
        </div>
      </div>
    );
  };

  const ProgressBar = ({ percentage, color = "primary" }) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      primary: "bg-[#FF4B00]"
    };

    return (
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  // Loading states
  const isLoading = summaryLoading || courseLoading || trendsLoading || assessmentsLoading;

  // Edit All Courses UI state
  const [editingCourses, setEditingCourses] = useState(false);
  const [courseEditForm, setCourseEditForm] = useState({
    ctCount: 2,
    assignmentCount: 2,
    addedCTs: [],
    addedAssignments: []
  });

  const [scoresEditForm, setScoresEditForm] = useState({
    ctCount: 2,
    assignmentCount: 2,
    addedCTs: [],
    addedAssignments: []
  });

  // Topic Mastery state
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [showAddTopicQuiz, setShowAddTopicQuiz] = useState(false);
  const [selectedQuizTopic, setSelectedQuizTopic] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);

  // Course deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Course addition success state
  const [showAddSuccessNotification, setShowAddSuccessNotification] = useState(false);

  // Course addition failure state
  const [showAddFailureNotification, setShowAddFailureNotification] = useState(false);
  const [addFailureMessage, setAddFailureMessage] = useState('');

  // CT and Assignment count update states
  const [editingCTCount, setEditingCTCount] = useState(false);
  const [editingAssignmentCount, setEditingAssignmentCount] = useState(false);
  const [tempCTCount, setTempCTCount] = useState(null);
  const [tempAssignmentCount, setTempAssignmentCount] = useState(null);
  const [updatingCounts, setUpdatingCounts] = useState(false);
  const [showCountUpdateSuccess, setShowCountUpdateSuccess] = useState(false);
  const [countUpdateMessage, setCountUpdateMessage] = useState('');

  // Add assessment modal states
  const [showAddAssessmentModal, setShowAddAssessmentModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    assessment_type: 'ct',
    ct_no: '',
    assignment_no: '',
    marks: '',
    full_marks: ''
  });
  const [addingAssessment, setAddingAssessment] = useState(false);

  // Fetched assessments from API
  const [fetchedAssessments, setFetchedAssessments] = useState([]);
  const [loadingFetchedAssessments, setLoadingFetchedAssessments] = useState(false);
  const [fetchedAssessmentsError, setFetchedAssessmentsError] = useState(null);

  // Update assessment modal states
  const [showUpdateAssessmentModal, setShowUpdateAssessmentModal] = useState(false);
  const [assessmentToUpdate, setAssessmentToUpdate] = useState(null);
  const [updateAssessmentForm, setUpdateAssessmentForm] = useState({
    assessment_type: '',
    ct_no: '',
    assignment_no: '',
    marks: '',
    full_marks: ''
  });
  const [updatingAssessment, setUpdatingAssessment] = useState(false);

  // Delete assessment modal states
  const [showDeleteAssessmentConfirm, setShowDeleteAssessmentConfirm] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);
  const [deletingAssessment, setDeletingAssessment] = useState(false);

  console.log(editingCourses + "EDIIIIIIIIIIIIIIIIIIIII");

  return (

    <div className="w-full flex flex-col min-h-screen">
      <div className="bg-gray-900 text-white p-3 sm:p-4 md:p-6 pb-20 w-full overflow-x-hidden">
        {/* Header */}

        <div className="mb-10 sm:mb-12 md:mb-20">
          <Navigation></Navigation>
        </div>

        <div className="flex items-center justify-between mb-6 sm:mb-8">


          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            sx={{
              color: `${isDark ? 'white' : 'text.primary'}`, // default color for links and separator
              '& .MuiBreadcrumbs-separator': {
                color: `${isDark ? 'white' : 'text.secondary'}`,
              },
            }}
          >
            {/* <Link underline="hover" color="inherit" href="/">MUI</Link> */}
            <Link underline="hover" color="inherit" href="/">Home</Link>
            <Typography sx={{ color: `${isDark ? 'white' : 'text.primary'}` }}>Performance Tracking</Typography>
          </Breadcrumbs>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mb-4 p-4 bg-primary-color rounded-lg text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading data...
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`}>
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current Trimester */}
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
              <div className='mb-4 sm:mb-5'>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Current Trimester</h2>

                {/* Trimester Dropdown */}
                <div className="mb-4">
                  <select
                    value={selectedTrimester}
                    onChange={(e) => setSelectedTrimester(e.target.value)}
                    className="w-full p-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF4B00] transition-colors text-sm sm:text-base"
                  >
                    {availableTrimesters.map((trimester) => (
                      <option key={trimester.value} value={trimester.value}>
                        {trimester.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                {/* <h2 className="text-xl font-semibold mb-7">Courses</h2> */}
                <button
                  onClick={fetchCourses}
                  disabled={loadingCourses}
                  className="btn cursor-pointer border-1 border-gray-600 w-full rounded-lg p-2 text-base sm:text-lg font-bold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingCourses ? 'Loading...' : '+ Add Courses'}
                </button>
                {coursesError && (
                  <p className="mt-2 text-sm text-red-500">⚠️ {coursesError}</p>
                )}
              </div>

              {/* Add Assessment Form */}
              {showAddAssessmentForm && (
                <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Add New Assessment</h3>
                  <form onSubmit={handleAddAssessment} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select
                        value={assessmentForm.assessment_type}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, assessment_type: e.target.value })}
                        className="w-full p-2 bg-gray-600 rounded"
                      >
                        <option value="CT">CT</option>
                        <option value="Assignment">Assignment</option>
                        <option value="MID">MID</option>
                        <option value="Final">Final</option>
                        <option value="Quiz">Quiz</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Score</label>
                      <input
                        type="number"
                        step="0.1"
                        value={assessmentForm.score}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, score: e.target.value })}
                        className="w-full p-2 bg-gray-600 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Marks</label>
                      <input
                        type="number"
                        step="0.1"
                        value={assessmentForm.max_marks}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, max_marks: e.target.value })}
                        className="w-full p-2 bg-gray-600 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Feedback (Optional)</label>
                      <textarea
                        value={assessmentForm.feedback}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, feedback: e.target.value })}
                        className="w-full p-2 bg-gray-600 rounded h-20"
                        placeholder="Enter feedback..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAssessmentForm(false)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {/* Loading state */}
                {loadingEnrolledCourses && (
                  <div className="text-center py-4">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FF4B00]" />
                    <p className="text-sm text-gray-400">Loading courses...</p>
                  </div>
                )}

                {/* Error state */}
                {enrolledCoursesError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                    ⚠️ {enrolledCoursesError}
                  </div>
                )}

                {/* Enrolled courses from API - Only show code and name */}
                {!loadingEnrolledCourses && !enrolledCoursesError && enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course) => (
                    <div
                      key={course.course_id}
                      className={`mb-4 w-full rounded-lg transition-all ${selectedCourse?.course_id === course.course_id
                        ? 'bg-[#FF4B00] text-white shadow-lg'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                        }`}
                    >
                      <div className="flex items-center justify-between p-3">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="flex-1 text-left"
                        >
                          <div className="font-semibold text-sm">{course.code}</div>
                          <div className="text-xs mt-1 opacity-90">{course.title}</div>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCourse(course);
                          }}
                          className={`ml-2 p-1.5 rounded hover:bg-red-600 transition-colors ${selectedCourse?.course_id === course.course_id
                            ? 'text-white hover:bg-red-700'
                            : 'text-gray-400 hover:text-white'
                            }`}
                          title="Delete Course"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback to static data when no enrolled courses
                  !loadingEnrolledCourses && !enrolledCoursesError && enrolledCourses.length === 0 && (
                    <>
                      {studentData.courses.map((course) => (
                        <div key={course.id} className="rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{course.code}</div>
                              <div className="text-sm text-gray-400">{course.credits} credits</div>
                              <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${course.difficulty === 'LOW'
                                ? 'bg-green-600 text-green-100'
                                : 'bg-yellow-600 text-yellow-100'
                                }`}>
                                {course.difficulty}
                              </div>
                            </div>
                            <CircularProgress
                              percentage={course.progress}
                              color={course.color}
                              size={50}
                            />
                          </div>
                          <hr className='my-3 text-gray-700' />
                        </div>
                      ))}
                    </>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Center Column - Course Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Course Header */}
            <div className="bg-gray-800 rounded-t-lg p-4 sm:p-6">
              {selectedCourse ? (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                    {selectedCourse.title}
                  </h2>
                  <div className="flex justify-between">
                    <div className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                      ({selectedCourse.code})
                    </div>
                    <div className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Credits: {selectedCourse.credits}</div>
                  </div>


                  <div className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base space-y-1">
                    <div><span className="font-semibold">Section:</span> {selectedCourse.section}</div>
                    <div><span className="font-semibold">Faculty:</span> {selectedCourse.faculty_name}</div>

                    {/* Editable CT Count */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">CT Count:</span>
                      {editingCTCount ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={tempCTCount !== null ? tempCTCount : selectedCourse.ct_count}
                            onChange={(e) => setTempCTCount(e.target.value)}
                            className="w-20 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-[#FF4B00]"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              updateCTCount(tempCTCount !== null ? tempCTCount : selectedCourse.ct_count);
                            }}
                            disabled={updatingCounts}
                            className="px-3 py-1 bg-[#FF4B00] hover:bg-[#E04300] text-white text-xs rounded transition-colors disabled:opacity-50"
                          >
                            {updatingCounts ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingCTCount(false);
                              setTempCTCount(null);
                            }}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{selectedCourse.ct_count}</span>
                          <button
                            onClick={() => {
                              setEditingCTCount(true);
                              setTempCTCount(selectedCourse.ct_count);
                            }}
                            className="text-[#FF4B00] hover:text-[#E04300] transition-colors"
                            title="Edit CT Count"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Editable Assignment Count */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Assignment Count:</span>
                      {editingAssignmentCount ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={tempAssignmentCount !== null ? tempAssignmentCount : selectedCourse.assignment_count}
                            onChange={(e) => setTempAssignmentCount(e.target.value)}
                            className="w-20 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-[#FF4B00]"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              updateAssignmentCount(tempAssignmentCount !== null ? tempAssignmentCount : selectedCourse.assignment_count);
                            }}
                            disabled={updatingCounts}
                            className="px-3 py-1 bg-[#FF4B00] hover:bg-[#E04300] text-white text-xs rounded transition-colors disabled:opacity-50"
                          >
                            {updatingCounts ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingAssignmentCount(false);
                              setTempAssignmentCount(null);
                            }}
                            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{selectedCourse.assignment_count}</span>
                          <button
                            onClick={() => {
                              setEditingAssignmentCount(true);
                              setTempAssignmentCount(selectedCourse.assignment_count);
                            }}
                            className="text-[#FF4B00] hover:text-[#E04300] transition-colors"
                            title="Edit Assignment Count"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                    {studentData.selectedCourse.title}
                  </h2>
                  <div className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                    ({studentData.selectedCourse.code})
                  </div>
                  <div className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                    {studentData.selectedCourse.instructor}<br />
                    {studentData.selectedCourse.credits} credits
                  </div>
                </>
              )}

              <div className="flex items-center justify-center">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full text-center gap-3 sm:gap-0">
                  <div className="text-sm font-semibold mb-0 sm:mb-2">Course progress</div>
                  <div>
                    <CircularProgress
                      percentage={coursePerformance ? Math.round(coursePerformance.average) : studentData.selectedCourse.progress}
                      size={100}
                      strokeWidth={8}
                    />
                  </div>
                </div>
              </div>


            </div>

            {/* Scores */}
            <div className="bg-gray-800 p-4 sm:p-6">
              <div className={`flex items-center justify-between mb-4`}>
                <h3 className="text-lg sm:text-xl font-semibold">
                  All Scores
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddAssessmentModal(true)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#FF4B00] hover:bg-[#E04300] text-white text-sm font-semibold transition-all transform hover:scale-105"
                    title="Add Assessment"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">Add</span>
                  </button>
                </div>
              </div>


              <div className="space-y-3">
                {/* Loading state */}
                {loadingFetchedAssessments && (
                  <div className="text-center py-4">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FF4B00]" />
                    <p className="text-sm text-gray-400">Loading assessments...</p>
                  </div>
                )}

                {/* Error state */}
                {fetchedAssessmentsError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                    ⚠️ {fetchedAssessmentsError}
                  </div>
                )}

                {/* Display fetched assessments from API */}
                {!loadingFetchedAssessments && !fetchedAssessmentsError && fetchedAssessments.length > 0 ? (
                  fetchedAssessments.map((assessment, index) => (
                    <div key={index} className="flex mb-2 justify-between items-center group bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-2 transition-all">
                      <span className="font-medium">
                        {assessment.assessment_type.toUpperCase()}
                        {assessment.ct_no ? ` ${assessment.ct_no}` : ''}
                        {assessment.assignment_no ? ` ${assessment.assignment_no}` : ''}
                      </span>
                      <div className="flex items-center gap-3">
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditAssessment(assessment)}
                            className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 hover:border-blue-500 transition-all"
                            title="Edit Assessment"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssessment(assessment)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 transition-all"
                            title="Delete Assessment"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                        <span className="text-gray-300 min-w-[80px] text-right">
                          {assessment.marks} out of {assessment.full_marks}
                        </span>
                      </div>
                    </div>
                  ))
                ) : trends && trends.length > 0 ? (
                  // Fallback to trends data
                  trends.map((trend, index) => (
                    <div key={index} className="flex mb-1 justify-between items-center">
                      <span className="font-medium">{trend.assessment_type}</span>
                      <span className="text-gray-300">
                        {trend.score}/{100}
                      </span>
                    </div>
                  ))
                ) : (
                  // Fallback to static data
                  !loadingFetchedAssessments && !fetchedAssessmentsError && (
                    <>
                      <div>
                        <p>No assessments available.</p>
                      </div>
                    </>
                  )
                )}
              </div>

            </div>


          </div>

          {/* Third Column - Topic Mastery */}
          <div className="space-y-4 sm:space-y-6">
            {/* Topic Mastery */}
            <div className="bg-gray-800 rounded-t-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Topic Mastery</h3>
                <div className="flex items-center">
                  {/* <CircularProgress
                  percentage={studentData.selectedCourse.topicMastery}
                  size={40}
                /> */}

                  <button
                    onClick={() => setShowAddTopicQuiz(!showAddTopicQuiz)}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
                    title="Add New Topic"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{showAddTopicQuiz ? 'Close' : 'Add Topic'}</span>
                  </button>

                </div>
              </div>

              {/* Quiz Section - Shown when Add Topic is clicked */}
              {showAddTopicQuiz && (
                <div className="bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Quiz Topic</label>
                    <select
                      value={selectedQuizTopic}
                      onChange={(e) => setSelectedQuizTopic(e.target.value)}
                      className="w-full p-2 bg-gray-600 rounded text-white mb-2"
                    >
                      <option value="">Choose a topic...</option>
                      {studentData.selectedCourse.topics.map((topic, index) => (
                        <option key={index} value={topic.name}>{topic.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedQuizTopic) {
                        setShowQuiz(true);
                      } else {
                        alert('Please select a topic first');
                      }
                    }}
                    className="w-full btn-bg-primary hover:bg-amber-700 py-2 rounded-lg text-sm"
                  >
                    Take Quiz
                  </button>
                </div>
              )}

              {/* Topic List - Hidden when Add Topic Quiz is active */}
              {!showAddTopicQuiz && (
                <>
                  <div className="space-y-4">
                    {(showAllTopics ? studentData.selectedCourse.topics : studentData.selectedCourse.topics.slice(0, 2)).map((topic, index) => (
                      <div key={index} className='mb-3'>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{topic.name}</span>
                          <span>{topic.progress}%</span>
                        </div>
                        <ProgressBar percentage={topic.progress} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-7">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2 p-2">

                      <button
                        onClick={() => setShowAllTopics(!showAllTopics)}
                        className="w-full sm:w-auto flex justify-center px-5 sm:px-7 py-3 btn-bg-primary hover:bg-amber-700 rounded-lg gap-1 items-center"
                      >
                        <span className="text-sm">{showAllTopics ? 'Show Less' : 'See All'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowAddTopicQuiz(true);
                        }}
                        className="w-full sm:w-auto flex justify-center px-5 sm:px-7 py-3 btn-bg-primary hover:bg-amber-700 rounded-lg gap-1 items-center"
                      >
                        <span className="text-sm">Quiz</span>
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!showAllTopics && <div className="bg-gray-800 rounded-b-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Course Assessment */}
              <div className="bg-gray-800 rounded-t-lg">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Course Assessment</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm sm:text-base font-semibold text-center border-b border-gray-600 pb-2">
                    <span>Assessment</span>
                    <span>Total Marks</span>
                    <span>Total Obtained</span>
                  </div>

                  {/* Display fetched assessments grouped by type */}
                  {!loadingFetchedAssessments && !fetchedAssessmentsError && fetchedAssessments.length > 0 ? (
                    (() => {
                      // Group assessments by type and calculate totals
                      const assessmentGroups = {};
                      let grandTotalMarks = 0;
                      let grandTotalObtained = 0;

                      fetchedAssessments.forEach(assessment => {
                        const type = assessment.assessment_type.toUpperCase();
                        if (!assessmentGroups[type]) {
                          assessmentGroups[type] = {
                            totalMarks: 0,
                            totalObtained: 0
                          };
                        }
                        assessmentGroups[type].totalMarks += parseFloat(assessment.full_marks || 0);
                        assessmentGroups[type].totalObtained += parseFloat(assessment.marks || 0);
                        grandTotalMarks += parseFloat(assessment.full_marks || 0);
                        grandTotalObtained += parseFloat(assessment.marks || 0);
                      });

                      return (
                        <>
                          {Object.entries(assessmentGroups).map(([type, totals], index) => (
                            <div key={index} className="grid grid-cols-3 text-center text-xs sm:text-sm mt-2">
                              <span>{type}</span>
                              <span className='text-gray-400'>{totals.totalMarks.toFixed(2)}</span>
                              <span className='text-gray-400'>{totals.totalObtained.toFixed(2)}</span>
                            </div>
                          ))}
                          {/* Grand Total Row */}
                          <div className="grid grid-cols-3 text-center text-xs sm:text-sm mt-3 pt-3 border-t border-gray-600 font-bold">
                            <span className="text-[#FF4B00]">TOTAL</span>
                            <span className='text-[#FF4B00]'>{grandTotalMarks.toFixed(2)}</span>
                            <span className='text-[#FF4B00]'>{grandTotalObtained.toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    // Fallback to static data
                    <>
                     
                    </>
                  )}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-gray-800 rounded-b-lg pt-4 sm:pt-6">
                <div className="rounded-lg text-sm">
                  {/* Display insights based on API data */}
                  {coursePerformance && (
                    <div className="mb-4">
                      <div className="text-base sm:text-lg font-semibold mb-2">Performance Summary</div>
                      <div className="space-y-1 text-gray-300 text-sm sm:text-base">
                        <div>Average Score: {coursePerformance.average}%</div>
                        <div>Highest Score: {coursePerformance.highest}%</div>
                        <div>Lowest Score: {coursePerformance.lowest}%</div>
                        <div>Total Assessments: {coursePerformance.count}</div>
                      </div>
                    </div>
                  )}

                  {/* Weakness insight based on weakest course from API */}
                  {studentSummary && studentSummary.weakestCourse && (
                    <div className="mb-4 p-3 bg-yellow-600 rounded-lg">
                      <div className="text-base sm:text-lg font-semibold mb-2">
                        Area for Improvement
                      </div>
                      <div className="text-yellow-100 text-sm sm:text-base">
                        Your weakest course is {studentSummary.weakestCourse}.
                        Focus on improving performance in this area.
                      </div>
                    </div>
                  )}

     

                  <button
                    className="w-full btn-bg-primary hover:bg-amber-700 py-2 rounded-lg text-sm mb-3"
                    onClick={() => {
                      console.log('Requesting tailored plan for', CURRENT_COURSE);
                    }}
                  >
                    Ask SPL Agent for tailored plan
                  </button>

                  <button
                    className="w-full btn-bg-primary hover:bg-amber-700 py-2 rounded-lg text-sm"
                    onClick={() => {
                      console.log('Fetching resources for', CURRENT_COURSE);
                    }}
                  >
                    Click here to get course resources
                  </button>
                </div>
              </div>
            </div>}

          </div>
        </div>

        {/* Additional Data Section */}
        {studentSummary && (
          <div className="mt-6 sm:mt-8 bg-gray-800 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">All Courses Summary</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingCourses(prev => !prev)}
                  aria-expanded={editingCourses}
                  aria-controls="all-courses-editor"
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded text-sm ${editingCourses ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                  title="Edit All Courses"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline text-sm">{editingCourses ? 'Close' : 'Edit'}</span>
                </button>
              </div>
            </div>

            {editingCourses ? (
              <div id="all-courses-editor" className="bg-gray-700 rounded-md p-3 sm:p-4 md:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <button
                    type="button"
                    onClick={() => setCourseEditForm(prev => ({ ...prev, addedCTs: [...prev.addedCTs, `CT ${prev.addedCTs.length + 1}`] }))}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded text-sm sm:text-base"
                  >
                    Add Another CT
                  </button>

                  <button
                    type="button"
                    onClick={() => setCourseEditForm(prev => ({ ...prev, addedAssignments: [...prev.addedAssignments, `Assignment ${prev.addedAssignments.length + 1}`] }))}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded text-sm sm:text-base"
                  >
                    Add Assignment/ project
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-start sm:items-center">
                    <div className="sm:col-span-2">
                      <div className="text-xs sm:text-sm font-semibold mb-1">CT Count</div>
                      <input
                        type="number"
                        min={0}
                        value={courseEditForm.ctCount}
                        onChange={(e) => setCourseEditForm(prev => ({ ...prev, ctCount: parseInt(e.target.value || 0) }))}
                        className="w-full p-2 bg-gray-600 rounded text-white text-sm sm:text-base"
                      />
                    </div>
                    <div className="flex items-center justify-start sm:justify-center">
                      <div className="text-sm sm:text-base">{courseEditForm.ctCount}</div>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="text-xs sm:text-sm font-semibold mb-1">Assignment Count</div>
                      <input
                        type="number"
                        min={0}
                        value={courseEditForm.assignmentCount}
                        onChange={(e) => setCourseEditForm(prev => ({ ...prev, assignmentCount: parseInt(e.target.value || 0) }))}
                        className="w-full p-2 bg-gray-600 rounded text-white text-sm sm:text-base"
                      />
                    </div>
                    <div className="flex items-center justify-start sm:justify-center">
                      <div className="text-sm sm:text-base">{courseEditForm.assignmentCount}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
                    <button
                      onClick={() => {
                        // for now just log and close
                        console.log('Saved course edits', courseEditForm);
                        setEditingCourses(false);
                      }}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 py-2 rounded text-white text-sm sm:text-base"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCourses(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded text-white text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* preview of added items */}
                  {(courseEditForm.addedCTs.length > 0 || courseEditForm.addedAssignments.length > 0) && (
                    <div className="mt-3 sm:mt-4">
                      {courseEditForm.addedCTs.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs sm:text-sm font-semibold mb-1">Added CTs</div>
                          <ul className="list-disc ml-4 sm:ml-5 text-xs sm:text-sm">
                            {courseEditForm.addedCTs.map((ct, idx) => <li key={idx}>{ct}</li>)}
                          </ul>
                        </div>
                      )}
                      {courseEditForm.addedAssignments.length > 0 && (
                        <div>
                          <div className="text-xs sm:text-sm font-semibold mb-1">Added Assignments</div>
                          <ul className="list-disc ml-4 sm:ml-5 text-xs sm:text-sm">
                            {courseEditForm.addedAssignments.map((a, idx) => <li key={idx}>{a}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {studentSummary.courses.map((course, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="font-semibold mb-2 text-sm sm:text-base">{course.courseId}</div>
                    <div className="text-xs sm:text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average:</span>
                        <span>{course.average || 'N/A'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Count:</span>
                        <span>{course.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Range:</span>
                        <span>{course.lowest}% - {course.highest}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz Modal */}
        {showQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <Quiz
                topic={selectedQuizTopic}
                onClose={() => {
                  setShowQuiz(false);
                  setShowAddTopicQuiz(false);
                  setSelectedQuizTopic('');
                }}
                onComplete={(results) => {
                  console.log('Quiz completed:', results);
                  // You can add logic here to save results to API or update state
                  alert(`Quiz completed! Score: ${results.score}/${results.total} (${results.percentage}%)`);
                }}
              />
            </div>
          </div>
        )}

        {/* Courses Modal */}
        {showCoursesModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-4 sm:p-5 md:p-6 border-b border-gray-700">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {selectedCourseToAdd ? 'Add Course Details' : 'Available Courses'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCoursesModal(false);
                      setCourseSearchQuery('');
                      setSelectedCourseToAdd(null);
                      setAddCourseForm({
                        trimester: '',
                        section: '',
                        faculty: ''
                      });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Search Bar - Only show when not in add form */}
                {!selectedCourseToAdd && (
                  <div className="relative">
                    <input
                      type="text"
                      value={courseSearchQuery}
                      onChange={(e) => setCourseSearchQuery(e.target.value)}
                      placeholder="Search courses by code or title..."
                      className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 bg-gray-700 text-white text-sm sm:text-base rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF4B00] transition-colors"
                    />
                    <svg
                      className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6 overflow-y-auto flex-1">
                {selectedCourseToAdd ? (
                  /* Add Course Form */
                  <form onSubmit={handleAddCourse} className="space-y-3 sm:space-y-4">
                    {/* Selected Course Info */}
                    <div className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-600">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">
                        {selectedCourseToAdd.code}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm mb-2">
                        {selectedCourseToAdd.title}
                      </p>
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {selectedCourseToAdd.credit} Credits
                      </span>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                          Trimester <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={addCourseForm.trimester}
                          onChange={(e) => setAddCourseForm({ ...addCourseForm, trimester: e.target.value })}
                          placeholder="e.g., 263"
                          required
                          className="w-full p-2.5 sm:p-3 bg-gray-700 text-white text-sm sm:text-base rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF4B00] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                          Section <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={addCourseForm.section}
                          onChange={(e) => setAddCourseForm({ ...addCourseForm, section: e.target.value })}
                          placeholder="e.g., A"
                          required
                          className="w-full p-2.5 sm:p-3 bg-gray-700 text-white text-sm sm:text-base rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF4B00] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">
                          Faculty <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={addCourseForm.faculty}
                          onChange={(e) => setAddCourseForm({ ...addCourseForm, faculty: e.target.value })}
                          placeholder="e.g., Dr. Mahfuz"
                          required
                          className="w-full p-2.5 sm:p-3 bg-gray-700 text-white text-sm sm:text-base rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF4B00] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourseToAdd(null);
                          setAddCourseForm({
                            trimester: '',
                            section: '',
                            faculty: ''
                          });
                        }}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={addingCourse}
                        className="flex-1 bg-[#FF4B00] hover:bg-[#E04300] text-white py-2.5 sm:py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {addingCourse ? 'Adding...' : 'Add Course'}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Course List */
                  (() => {
                    const filteredCourses = availableCourses.filter(course =>
                      course.code.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                      course.title.toLowerCase().includes(courseSearchQuery.toLowerCase())
                    );

                    if (filteredCourses.length > 0) {
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          {filteredCourses.map((course) => (
                            <div
                              key={course.id}
                              className="bg-gray-700 rounded-lg p-3 sm:p-4 hover:bg-gray-600 transition-colors border border-gray-600"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                                    {course.code}
                                  </h3>
                                  <p className="text-gray-300 text-xs sm:text-sm mb-2">
                                    {course.title}
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full ml-2 whitespace-nowrap">
                                  {course.credit} Credits
                                </span>
                              </div>

                              <div className="text-xs text-gray-400 space-y-1 mb-2 sm:mb-3">
                                <div>Created: {new Date(course.created_at).toLocaleDateString()}</div>
                                {course.updated_at !== course.created_at && (
                                  <div>Updated: {new Date(course.updated_at).toLocaleDateString()}</div>
                                )}
                              </div>

                              <div className="pt-2 sm:pt-3 border-t border-gray-600">
                                <button
                                  onClick={() => setSelectedCourseToAdd(course)}
                                  className="w-full bg-[#FF4B00] hover:bg-[#E04300] text-white py-2 rounded transition-colors text-xs sm:text-sm font-medium"
                                >
                                  Select Course
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    } else if (courseSearchQuery && filteredCourses.length === 0) {
                      return (
                        <div className="text-center text-gray-400 py-6 sm:py-8">
                          <svg
                            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <p className="text-base sm:text-lg font-semibold mb-1">No courses found</p>
                          <p className="text-xs sm:text-sm">Try searching with different keywords</p>
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-center text-gray-400 py-6 sm:py-8">
                          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                          <p className="text-sm sm:text-base">No courses available</p>
                        </div>
                      );
                    }
                  })()
                )}
              </div>

              {/* Footer - Only show when not in add form */}
              {!selectedCourseToAdd && (
                <div className="p-3 sm:p-4 border-t border-gray-700 bg-gray-750 flex justify-between items-center">
                  <p className="text-xs sm:text-sm text-gray-400">
                    {(() => {
                      const filteredCount = availableCourses.filter(course =>
                        course.code.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                        course.title.toLowerCase().includes(courseSearchQuery.toLowerCase())
                      ).length;
                      return courseSearchQuery
                        ? `Showing ${filteredCount} of ${availableCourses.length} courses`
                        : `Total ${availableCourses.length} courses`;
                    })()}
                  </p>
                  <button
                    onClick={() => {
                      setShowCoursesModal(false);
                      setCourseSearchQuery('');
                    }}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded transition-colors text-xs sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Assessment Modal */}
        {showAddAssessmentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full border border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Add Assessment</h3>
                  <button
                    onClick={() => {
                      setShowAddAssessmentModal(false);
                      setNewAssessment({
                        assessment_type: 'ct',
                        ct_no: '',
                        assignment_no: '',
                        marks: '',
                        full_marks: ''
                      });
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Assessment Type */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Assessment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newAssessment.assessment_type}
                      onChange={(e) => setNewAssessment({ ...newAssessment, assessment_type: e.target.value })}
                      className="w-full p-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF4B00] transition-colors"
                    >
                      <option value="ct">CT</option>
                      <option value="assignment">Assignment</option>
                      <option value="mid">Mid</option>
                      <option value="final">Final</option>
                    </select>
                  </div>

                  {/* CT Number or Assignment Number */}
                  {(newAssessment.assessment_type === 'ct' || newAssessment.assessment_type === 'assignment') && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        {newAssessment.assessment_type === 'ct' ? 'CT Number' : 'Assignment Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newAssessment.assessment_type === 'ct' ? newAssessment.ct_no : newAssessment.assignment_no}
                        onChange={(e) => {
                          if (newAssessment.assessment_type === 'ct') {
                            setNewAssessment({ ...newAssessment, ct_no: e.target.value });
                          } else {
                            setNewAssessment({ ...newAssessment, assignment_no: e.target.value });
                          }
                        }}
                        placeholder={`Enter ${newAssessment.assessment_type === 'ct' ? 'CT' : 'Assignment'} number`}
                        className="w-full p-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF4B00] transition-colors"
                      />
                    </div>
                  )}

                  {/* Marks Obtained */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Marks Obtained <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newAssessment.marks}
                      onChange={(e) => setNewAssessment({ ...newAssessment, marks: e.target.value })}
                      placeholder="Enter marks obtained"
                      className="w-full p-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF4B00] transition-colors"
                    />
                  </div>

                  {/* Full Marks */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Full Marks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newAssessment.full_marks}
                      onChange={(e) => setNewAssessment({ ...newAssessment, full_marks: e.target.value })}
                      placeholder="Enter full marks"
                      className="w-full p-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-[#FF4B00] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddAssessmentModal(false);
                      setNewAssessment({
                        assessment_type: 'ct',
                        ct_no: '',
                        assignment_no: '',
                        marks: '',
                        full_marks: ''
                      });
                    }}
                    disabled={addingAssessment}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAssessmentSubmit}
                    disabled={addingAssessment}
                    className="flex-1 bg-gradient-to-r from-[#FF4B00] to-[#E04300] hover:from-[#E04300] hover:to-[#C03800] text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {addingAssessment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Assessment'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Assessment Modal */}
        {showUpdateAssessmentModal && assessmentToUpdate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full border border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Update Assessment</h3>
                  <button
                    onClick={() => {
                      setShowUpdateAssessmentModal(false);
                      setAssessmentToUpdate(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Assessment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assessment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={updateAssessmentForm.assessment_type}
                      onChange={(e) => {
                        setUpdateAssessmentForm({
                          ...updateAssessmentForm,
                          assessment_type: e.target.value,
                          ct_no: e.target.value === 'ct' ? updateAssessmentForm.ct_no : '',
                          assignment_no: e.target.value === 'assignment' ? updateAssessmentForm.assignment_no : ''
                        });
                      }}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#FF4B00] focus:ring-1 focus:ring-[#FF4B00]"
                    >
                      <option value="ct">CT</option>
                      <option value="assignment">Assignment</option>
                      <option value="mid">Mid</option>
                      <option value="final">Final</option>
                    </select>
                  </div>

                  {/* CT/Assignment Number */}
                  {(updateAssessmentForm.assessment_type === 'ct' || updateAssessmentForm.assessment_type === 'assignment') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {updateAssessmentForm.assessment_type === 'ct' ? 'CT Number' : 'Assignment Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={updateAssessmentForm.assessment_type === 'ct' ? updateAssessmentForm.ct_no : updateAssessmentForm.assignment_no}
                        onChange={(e) => {
                          if (updateAssessmentForm.assessment_type === 'ct') {
                            setUpdateAssessmentForm({ ...updateAssessmentForm, ct_no: e.target.value });
                          } else {
                            setUpdateAssessmentForm({ ...updateAssessmentForm, assignment_no: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#FF4B00] focus:ring-1 focus:ring-[#FF4B00]"
                        placeholder={`Enter ${updateAssessmentForm.assessment_type === 'ct' ? 'CT' : 'Assignment'} number`}
                      />
                    </div>
                  )}

                  {/* Marks Obtained */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Marks Obtained <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={updateAssessmentForm.marks}
                      onChange={(e) => setUpdateAssessmentForm({ ...updateAssessmentForm, marks: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#FF4B00] focus:ring-1 focus:ring-[#FF4B00]"
                      placeholder="Enter marks obtained"
                    />
                  </div>

                  {/* Full Marks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Marks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={updateAssessmentForm.full_marks}
                      onChange={(e) => setUpdateAssessmentForm({ ...updateAssessmentForm, full_marks: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#FF4B00] focus:ring-1 focus:ring-[#FF4B00]"
                      placeholder="Enter full marks"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowUpdateAssessmentModal(false);
                      setAssessmentToUpdate(null);
                    }}
                    disabled={updatingAssessment}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateAssessmentSubmit}
                    disabled={updatingAssessment}
                    className="flex-1 bg-gradient-to-r from-[#FF4B00] to-[#E04300] hover:from-[#E04300] hover:to-[#C03800] text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updatingAssessment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Assessment'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Assessment Confirmation Modal */}
        {showDeleteAssessmentConfirm && assessmentToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-2">
                  Delete Assessment
                </h3>

                <p className="text-gray-300 text-center mb-4">
                  Are you sure you want to delete <span className="font-semibold text-white">
                    {assessmentToDelete.assessment_type.toUpperCase()}
                    {assessmentToDelete.ct_no ? ` ${assessmentToDelete.ct_no}` : ''}
                    {assessmentToDelete.assignment_no ? ` ${assessmentToDelete.assignment_no}` : ''}
                  </span>?
                </p>

                <p className="text-sm text-gray-400 text-center mb-6">
                  This action cannot be undone. The assessment record will be permanently removed.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteAssessmentConfirm(false);
                      setAssessmentToDelete(null);
                    }}
                    disabled={deletingAssessment}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteAssessment}
                    disabled={deletingAssessment}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingAssessment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && courseToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-2">
                  Delete Course
                </h3>

                <p className="text-gray-300 text-center mb-4">
                  Are you sure you want to delete <span className="font-semibold text-white">{courseToDelete.code}</span>?
                </p>

                <p className="text-sm text-gray-400 text-center mb-6">
                  This action cannot be undone. All associated data will be permanently removed.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setCourseToDelete(null);
                    }}
                    disabled={deletingCourse}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteCourse}
                    disabled={deletingCourse}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingCourse ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {showSuccessNotification && (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm animate-bounce-in">
              <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Course Deleted Successfully</p>
                <p className="text-sm text-green-100">The course has been removed.</p>
              </div>
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="ml-auto flex-shrink-0 hover:bg-green-700 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Course Addition Success Notification */}
        {showAddSuccessNotification && (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm animate-bounce-in">
              <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Course Added Successfully</p>
                <p className="text-sm text-green-100">The course has been enrolled.</p>
              </div>
              <button
                onClick={() => setShowAddSuccessNotification(false)}
                className="ml-auto flex-shrink-0 hover:bg-green-700 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Course Addition Failure Notification */}
        {showAddFailureNotification && (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm animate-bounce-in">
              <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Failed to Add Course</p>
                <p className="text-sm text-red-100">{addFailureMessage}</p>
              </div>
              <button
                onClick={() => setShowAddFailureNotification(false)}
                className="ml-auto flex-shrink-0 hover:bg-red-700 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Count Update Success Notification */}
        {showCountUpdateSuccess && (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm animate-bounce-in">
              <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Update Successful</p>
                <p className="text-sm text-green-100">{countUpdateMessage}</p>
              </div>
              <button
                onClick={() => setShowCountUpdateSuccess(false)}
                className="ml-auto flex-shrink-0 hover:bg-green-700 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className=''>
        <FooterSection></FooterSection>
      </div>
    </div>

  );
};

export default StudentDashboard;