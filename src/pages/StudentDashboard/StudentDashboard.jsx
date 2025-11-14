import React, { useState, useEffect, useRef, useContext } from 'react';
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

  // Fetch enrolled courses for selected trimester
  const fetchEnrolledCourses = async (trimester) => {
    setLoadingEnrolledCourses(true);
    setEnrolledCoursesError(null);
    try {
      // TODO: Replace with actual student_id from auth context
      const STUDENT_ID = "f046dc51-56d2-4443-b829-0be7688745ae";
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      
      const response = await fetch(`${baseUrl}/api/v1/student/${STUDENT_ID}/courses/${trimester}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      setEnrolledCoursesError(error.message || 'Failed to fetch enrolled courses');
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoadingEnrolledCourses(false);
    }
  };

  // Fetch enrolled courses when trimester changes
  useEffect(() => {
    fetchEnrolledCourses(selectedTrimester);
  }, [selectedTrimester]);

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

      alert('Course added successfully!');
      
      // Optionally refresh data
      // refetchSummary();
      
    } catch (error) {
      console.error('Error adding course:', error);
      alert(error.message || 'Failed to add course. Please try again.');
    } finally {
      setAddingCourse(false);
    }
  };

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

  // Edit Scores UI state
  const [editingScores, setEditingScores] = useState(false);
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

  console.log(editingCourses +"EDIIIIIIIIIIIIIIIIIIIII");

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

      <div className={`grid grid-cols-1 ${editingScores ? 'lg:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6`}>
        {/* Left Column */}
        {!editingScores && <div className="space-y-4 sm:space-y-6">
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

              {/* Enrolled courses from API */}
              {!loadingEnrolledCourses && !enrolledCoursesError && enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <div key={course.course_id} className="rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{course.code}</div>
                        <div className="text-sm text-gray-400">{course.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Section: {course.section} | Faculty: {course.faculty_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          CT: {course.ct_count} | Assignments: {course.assignment_count}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">{course.credits} credits</div>
                      </div>
                      {/* <CircularProgress
                        percentage={Math.floor(Math.random() * 100)} // Replace with actual progress when available
                        color="primary"
                        size={50}
                      /> */}
                    </div>
                    <hr className='my-3 text-gray-700' />
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
        </div>}

        {/* Center Column - Course Details */}
        <div className="space-y-4 sm:space-y-6">
          {/* Course Header */}
          <div className="bg-gray-800 rounded-t-lg p-4 sm:p-6">
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

    
            {editingScores ? 
            <></>            
            :
            (<div className="flex items-center justify-center">
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
            </div>)

            }
          </div>

          {/* Scores */}
          <div className="bg-gray-800 p-4 sm:p-6">
            <div className={`flex items-center justify-between mb-4`}>
              <h3 className="text-lg sm:text-xl font-semibold">
                {editingScores ? 'Recent Scores' : 'All Scores'}
              </h3>
              <button
                onClick={() => setEditingScores(prev => !prev)}
                aria-expanded={editingScores}
                aria-controls="scores-editor"
                className={`flex items-center space-x-2 px-3 py-1 rounded text-sm ${editingScores ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                title="Edit Scores"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{editingScores ? 'Close' : 'Edit'}</span>
              </button>
            </div>
            
            {editingScores ? (
              <div id="scores-editor" className="space-y-4">
                {/* Display existing scores */}
                <div className="mb-4 grid grid-cols-3 gap-4 text-sm font-semibold text-center border-b border-gray-600 pb-2">
                  <span>Assessment</span>
                  <span>Obtain</span>
                  <span>Marks</span>
                </div>
                {[
                  { name: "CT1", obtain: 16, marks: 20 },
                  { name: "CT1", obtain: 16, marks: 20 },
                  { name: "CT1", obtain: 16, marks: 16 },
                  { name: "Mid", obtain: 16, marks: 16 },
                  { name: "Final", obtain: 16, marks: 16 }
                ].map((score, index) => (
                  <div key={index} className="grid grid-cols-3 text-center text-sm mt-2">
                    <span>{score.name}</span>
                    <span className="text-gray-300">{score.obtain}</span>
                    <span className="text-gray-300">{score.marks}</span>
                  </div>
                ))}

                {/* Add Another CT Section */}
                <div className="bg-gray-700 rounded-lg p-4 mt-10 mb-8">
                  <h4 className="text-md font-semibold mb-3">Add Another CT</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">CT No</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter CT number"
                        className="w-full p-2 bg-gray-600 rounded text-white"
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mark Obtained</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Enter marks"
                        className="w-full p-2 bg-gray-600 rounded text-white"
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>
        
                </div>

                {/* Add Another Assignment/Project Section */}
                <div className="bg-gray-700 rounded-lg p-4 mt-4">
                  <h4 className="text-md font-semibold mb-3">Add Another Assignment or Project</h4>
                  <div className="space-y-3">
                    <div className='mb-3'>
                      <label className="block text-sm font-medium mb-1">Assignment or Project</label>
                      <select
                        className="w-full p-2 bg-gray-600 rounded text-white"
                        onChange={(e) => {
                          const isAssignment = e.target.value === 'assignment';
                          // You can store this state if needed
                        }}
                      >
                        <option value="assignment">Assignment</option>
                        <option value="project">Project</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Assignment Number</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="Enter number"
                          className="w-full p-2 bg-gray-600 rounded text-white"
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Mark Obtained</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Enter marks"
                          className="w-full p-2 bg-gray-600 rounded text-white"
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
          
                </div>

                {/* CT and Assignment Count Section */}
                <div className="grid grid-cols-2 gap-4 items-center mt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">CT Count</label>
                    <input
                      type="number"
                      min="0"
                      value={scoresEditForm.ctCount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value || 0);
                        if (value >= 0) {
                          setScoresEditForm(prev => ({ ...prev, ctCount: value }));
                        }
                      }}
                      className="w-20 p-2 bg-gray-600 rounded text-white text-center"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '.') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">Assignment Count</label>
                    <input
                      type="number"
                      min="0"
                      value={scoresEditForm.assignmentCount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value || 0);
                        if (value >= 0) {
                          setScoresEditForm(prev => ({ ...prev, assignmentCount: value }));
                        }
                      }}
                      className="w-20 p-2 bg-gray-600 rounded text-white text-center"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '.') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    console.log('Saved scores edits', scoresEditForm);
                    setEditingScores(false);
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 py-2 rounded text-white mt-4"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {trends && trends.length > 0 ? (
                  trends.slice(-5).map((trend, index) => (
                    <div key={index} className="flex mb-1 justify-between items-center">
                      <span className="font-medium">{trend.assessment_type}</span>
                      <span className="text-gray-300">
                        {trend.score}/{100}
                      </span>
                    </div>
                  ))
                ) : (
                  // Fallback to static data
                  [
                    { name: "CT1", score: 16, total: 20 },
                    { name: "CT2", score: 16, total: 20 },
                    { name: "MID", score: 30, total: 30 },
                    { name: "Final", score: 40, total: 40 }
                  ].map((score, index) => (
                    <div key={index} className="flex mb-1 justify-between items-center">
                      <span className="font-medium">{score.name}</span>
                      <span className="text-gray-300">
                        {score.score} out of {score.total}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* CT Methods */}
          {!editingScores && 
          <div className="bg-gray-800 rounded-b-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">CT Methods</h3>
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 text-sm sm:text-base">
              <div>Course</div>
              <div>Marks</div>
              <div>Best Count</div>

              <div className='text-xs sm:text-sm text-gray-400'>SPL</div>
              <div className='text-xs sm:text-sm text-gray-400'>{studentData.selectedCourse.ctMethods.spl.marks}</div>
              <div className='text-xs sm:text-sm text-gray-400'>{studentData.selectedCourse.ctMethods.spl.bestCount}</div>
            </div>
          </div>}
        </div>

        {/* Third Column - Topic Mastery */}
        {!editingScores && <div className="space-y-4 sm:space-y-6">
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

          {/* Detected Weakness */}
          {/* <div className="bg-gray-800 rounded-b-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Detected Weakness In</h3>
              <div className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                ?
              </div>
            </div>


            <div className="bg-gray-800 rounded-lg p-6">
              <div className="h-36 w-full">
                <canvas ref={chartRef} />
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {studentData.selectedCourse.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={`text-sm`}>
                    {weakness.topic}
                  </span>
                  <span className="text-sm">{weakness.severity}</span>
                </div>
              ))}
            </div>

            <button className="btn cursor-pointer border-1 border-gray-600 w-full rounded-lg p-2 text-lg font-bold hover:bg-gray-600 mb-7">
              + Add Weakness
            </button>

            <div className="space-y-2">
              {['Loops', 'Arrays', 'Recursion'].map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded">
                  <span className="text-sm">{topic}</span>
                  <X className="w-6 h-6 px-1 text-white bg-red-600 rounded-full cursor-pointer" />
                </div>
              ))}
            </div>
          </div> */}

           {!showAllTopics && <div className="bg-gray-800 rounded-b-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Course Assessment */}
          <div className="bg-gray-800 rounded-t-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Course Assessment</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm sm:text-base font-semibold text-center border-b border-gray-600 pb-2">
                <span>Assessment</span>
                <span>Marks</span>
                <span>Obtained</span>
              </div>

              {/* Display API assessment data if available */}
              {assessments && assessments.length > 0 ? (
                assessments.map((assessment, index) => (
                  <div key={index} className="grid grid-cols-3 text-center text-xs sm:text-sm mt-2">
                    <span>{assessment.assessment_type}</span>
                    <span className='text-gray-400'>{assessment.max_marks || 100}</span>
                    <span className='text-gray-400'>{assessment.score}</span>
                  </div>
                ))
              ) : (
                // Fallback to static data
                [
                  { type: "CT", marks: 20, obtained: 20 },
                  { type: "Assignment", marks: 5, obtained: 5 },
                  { type: "Attendance", marks: 5, obtained: 5 },
                  { type: "MID", marks: 30, obtained: 30 },
                  { type: "Final", marks: 40, obtained: 40 }
                ].map((assessment, index) => (
                  <div key={index} className="grid grid-cols-3 text-center text-xs sm:text-sm mt-2">
                    <span>{assessment.type}</span>
                    <span className='text-gray-400'>{assessment.marks}</span>
                    <span className='text-gray-400'>{assessment.obtained}</span>
                  </div>
                ))
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

              <div className="mb-5 sm:mb-7 text-base sm:text-lg font-semibold">
                You have lost 4 marks on CT1 that consists loops.
                Max possibilities in CT (avg best) ÷ 3
              </div>

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

        </div>}
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
    </div>
    <div className=''>
      <FooterSection></FooterSection>
    </div>
    </div>
    
  );
};

export default StudentDashboard;