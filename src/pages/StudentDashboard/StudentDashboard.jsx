import React, { useState, useEffect, useRef, useContext } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import * as Chart from 'chart.js';
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
        { name: "Functions", progress: 90 }
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

  console.log(editingCourses +"EDIIIIIIIIIIIIIIIIIIIII");

  return (
    <div className="bg-gray-900 text-white p-6 min-w-[1585px]">
      {/* Header */}

      <div className="flex items-center justify-between mb-8">


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


        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold ml-2">{studentData.name}</h1>

          {/* API Connection Status */}
          <div className="flex items-center space-x-2">
            {connectionLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
            ) : isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className="text-xs text-gray-400">
              {connectionLoading ? 'Connecting...' : isConnected ? 'API Connected' : 'API Offline'}
            </span>
          </div>
          <button
            onClick={refreshAllData}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* <div className="flex items-center space-x-6 gap-7">
          <div className="text-center flex justify-center items-center gap-4">
            <div className="text-sm text-gray-400">Completed Credits</div>
            <div className="text-xl font-bold">{studentData.completedCredits}</div>
          </div>
          <div className="text-center flex justify-center items-center gap-4">
            <div className="text-sm text-gray-400">CGPA</div>
            <div className="text-xl font-bold">{studentData.cgpa}</div>
          </div>
          {studentSummary && (
            <div className="text-center flex justify-center items-center gap-4">
              <div className="text-sm text-gray-400">Overall Average</div>
              <div className="text-xl font-bold">{studentSummary.overallAverage}%</div>
            </div>
          )}
          
        </div> */}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-4 p-4 bg-primary-color rounded-lg text-center">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          Loading data...
        </div>
      )}

      {/* Error Messages */}
      {(summaryError || courseError || trendsError || assessmentsError) && (
        <div className="mb-4 p-4 bg-red-600 rounded-lg">
          <strong>Errors:</strong>
          {summaryError && <div>Summary: {summaryError}</div>}
          {courseError && <div>Course: {courseError}</div>}
          {trendsError && <div>Trends: {trendsError}</div>}
          {assessmentsError && <div>Assessments: {assessmentsError}</div>}
        </div>
      )}

      <div className={`grid grid-cols-1 ${editingScores ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
        {/* Left Column */}
        {!editingScores && <div className="space-y-6">
          {/* Current Trimester */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className='mb-5'>
              <h2 className="text-xl font-semibold mb-4">Current Trimester</h2>
              <div className="text-gray-300">
                <div>{studentData.currentTrimester}</div>
                <div>{studentData.trimesterCredits} credits</div>
              </div>
            </div>

            <div className="mb-4">
              {/* <h2 className="text-xl font-semibold mb-7">Courses</h2> */}
              <button
                onClick={() => setShowAddAssessmentForm(!showAddAssessmentForm)}
                className="btn cursor-pointer border-1 border-gray-600 w-full rounded-lg p-2 text-lg font-bold hover:bg-gray-600"
              >
                + Add Courses
              </button>
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
            </div>
          </div>
        </div>}

        {/* Center Column - Course Details */}
        <div className="space-y-6">
          {/* Course Header */}
          <div className="bg-gray-800 rounded-t-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">
              {studentData.selectedCourse.title}
            </h2>
            <div className="text-gray-400 mb-4">
              ({studentData.selectedCourse.code})
            </div>
            <div className="text-gray-300 mb-6">
              {studentData.selectedCourse.instructor}<br />
              {studentData.selectedCourse.credits} credits
            </div>

    
            {editingScores ? 
            <></>            
            :
            (<div className="flex items-center justify-center">
              <div className="flex items-center justify-between w-full text-center">
                <div className="text-sm font-semibold mb-2">Course progress</div>
                <div>
                  <CircularProgress
                    percentage={coursePerformance ? Math.round(coursePerformance.average) : studentData.selectedCourse.progress}
                    size={120}
                    strokeWidth={8}
                  />
                </div>
              </div>
            </div>)

            }
          </div>

          {/* Scores */}
          <div className="bg-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {editingScores ? 'Recent Scores' : 'All Scores'}
              </h3>
              <button
                onClick={() => setEditingScores(prev => !prev)}
                aria-expanded={editingScores}
                aria-controls="scores-editor"
                className={`flex items-center space-x-2 px-3 py-1 rounded ${editingScores ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                title="Edit Scores"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">{editingScores ? 'Close' : 'Edit'}</span>
              </button>
            </div>
            
            {editingScores ? (
              <div id="scores-editor" className="space-y-4">
                {/* Display existing scores */}
                <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-center border-b border-gray-600 pb-2">
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

                <button
                  type="button"
                  onClick={() => setScoresEditForm(prev => ({ ...prev, addedCTs: [...prev.addedCTs, `CT ${prev.addedCTs.length + 1}`] }))}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded mt-4"
                >
                  Add Another CT
                </button>

                <button
                  type="button"
                  onClick={() => setScoresEditForm(prev => ({ ...prev, addedAssignments: [...prev.addedAssignments, `Assignment ${prev.addedAssignments.length + 1}`] }))}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded"
                >
                  Add Assignment/ project
                </button>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <div className="text-sm font-semibold mb-2 text-center">CT Count</div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min={0}
                        value={scoresEditForm.ctCount}
                        onChange={(e) => setScoresEditForm(prev => ({ ...prev, ctCount: parseInt(e.target.value || 0) }))}
                        className="flex-1 p-2 bg-gray-600 rounded text-white text-center"
                      />
                      <div className="flex items-center justify-center w-12 h-10 bg-gray-700 rounded">
                        <span className="text-sm">{scoresEditForm.ctCount}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold mb-2 text-center">Assignment Count</div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min={0}
                        value={scoresEditForm.assignmentCount}
                        onChange={(e) => setScoresEditForm(prev => ({ ...prev, assignmentCount: parseInt(e.target.value || 0) }))}
                        className="flex-1 p-2 bg-gray-600 rounded text-white text-center"
                      />
                      <div className="flex items-center justify-center w-12 h-10 bg-gray-700 rounded">
                        <span className="text-sm">{scoresEditForm.assignmentCount}</span>
                      </div>
                    </div>
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
          <div className="bg-gray-800 rounded-b-lg p-6">
            <h3 className="text-xl font-semibold mb-4">CT Methods</h3>
            <div className="w-full grid grid-cols-3 gap-3 gap-x-18">
              <div>Course</div>
              <div>Marks</div>
              <div>Best Count</div>

              <div className='text-sm text-gray-400'>SPL</div>
              <div className='text-sm text-gray-400'>{studentData.selectedCourse.ctMethods.spl.marks}</div>
              <div className='text-sm text-gray-400'>{studentData.selectedCourse.ctMethods.spl.bestCount}</div>
            </div>
          </div>
        </div>

        {/* Third Column - Topic Mastery */}
        {!editingScores && <div className="space-y-6">
          {/* Topic Mastery */}
          <div className="bg-gray-800 rounded-t-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Topic Mastery</h3>
              <div className="flex items-center">
                <CircularProgress
                  percentage={studentData.selectedCourse.topicMastery}
                  size={40}
                />
              </div>
            </div>

            <div className="space-y-4">
              {studentData.selectedCourse.topics.map((topic, index) => (
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
              <div className="flex items-center justify-between p-2">
                <span className="text-gray-400 text-sm">Topic Mastery</span>
                <button className="flex px-7 py-3 btn-bg-primary hover:bg-amber-700 rounded-lg gap-1 items-center">
                  <span className="text-sm">Quiz</span>
                  <Edit className="w-3 h-3" />
                </button>
              </div>
            </div>
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

           <div className="bg-gray-800 rounded-b-lg p-6 space-y-6">
          {/* Course Assessment */}
          <div className="bg-gray-800 rounded-t-lg">
            <h3 className="text-xl font-semibold mb-4">Course Assessment</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 text-md font-semibold text-center border-b border-gray-600 pb-2">
                <span>Assessment</span>
                <span>Marks</span>
                <span>Obtained</span>
              </div>

              {/* Display API assessment data if available */}
              {assessments && assessments.length > 0 ? (
                assessments.map((assessment, index) => (
                  <div key={index} className="grid grid-cols-3 text-center text-sm mt-2">
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
                  <div key={index} className="grid grid-cols-3 text-center text-sm mt-2">
                    <span>{assessment.type}</span>
                    <span className='text-gray-400'>{assessment.marks}</span>
                    <span className='text-gray-400'>{assessment.obtained}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-gray-800 rounded-b-lg pt-6">
            <div className="rounded-lg text-sm">
              {/* Display insights based on API data */}
              {coursePerformance && (
                <div className="mb-4">
                  <div className="text-lg font-semibold mb-2">Performance Summary</div>
                  <div className="space-y-1 text-gray-300">
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
                  <div className="text-lg font-semibold mb-2">
                    Area for Improvement
                  </div>
                  <div className="text-yellow-100">
                    Your weakest course is {studentSummary.weakestCourse}.
                    Focus on improving performance in this area.
                  </div>
                </div>
              )}

              <div className="mb-7 text-lg font-semibold">
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
        </div>

        </div>}
      </div>

      {/* Additional Data Section */}
      {studentSummary && (
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">All Courses Summary</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingCourses(prev => !prev)}
                aria-expanded={editingCourses}
                aria-controls="all-courses-editor"
                className={`flex items-center space-x-2 px-3 py-1 rounded ${editingCourses ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                title="Edit All Courses"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">{editingCourses ? 'Close' : 'Edit'}</span>
              </button>
            </div>
          </div>

          {editingCourses ? (
            <div id="all-courses-editor" className="bg-gray-700 rounded-md p-6">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setCourseEditForm(prev => ({ ...prev, addedCTs: [...prev.addedCTs, `CT ${prev.addedCTs.length + 1}`] }))}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded"
                >
                  Add Another CT
                </button>

                <button
                  type="button"
                  onClick={() => setCourseEditForm(prev => ({ ...prev, addedAssignments: [...prev.addedAssignments, `Assignment ${prev.addedAssignments.length + 1}`] }))}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded"
                >
                  Add Assignment/ project
                </button>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-2">
                    <div className="text-sm font-semibold mb-1">CT Count</div>
                    <input
                      type="number"
                      min={0}
                      value={courseEditForm.ctCount}
                      onChange={(e) => setCourseEditForm(prev => ({ ...prev, ctCount: parseInt(e.target.value || 0) }))}
                      className="w-full p-2 bg-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-sm">{courseEditForm.ctCount}</div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm font-semibold mb-1">Assignment Count</div>
                    <input
                      type="number"
                      min={0}
                      value={courseEditForm.assignmentCount}
                      onChange={(e) => setCourseEditForm(prev => ({ ...prev, assignmentCount: parseInt(e.target.value || 0) }))}
                      className="w-full p-2 bg-gray-600 rounded text-white"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-sm">{courseEditForm.assignmentCount}</div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      // for now just log and close
                      console.log('Saved course edits', courseEditForm);
                      setEditingCourses(false);
                    }}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 py-2 rounded text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCourses(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded text-white"
                  >
                    Cancel
                  </button>
                </div>

                {/* preview of added items */}
                {(courseEditForm.addedCTs.length > 0 || courseEditForm.addedAssignments.length > 0) && (
                  <div className="mt-4">
                    {courseEditForm.addedCTs.length > 0 && (
                      <div className="mb-2">
                        <div className="text-sm font-semibold mb-1">Added CTs</div>
                        <ul className="list-disc ml-5 text-sm">
                          {courseEditForm.addedCTs.map((ct, idx) => <li key={idx}>{ct}</li>)}
                        </ul>
                      </div>
                    )}
                    {courseEditForm.addedAssignments.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold mb-1">Added Assignments</div>
                        <ul className="list-disc ml-5 text-sm">
                          {courseEditForm.addedAssignments.map((a, idx) => <li key={idx}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentSummary.courses.map((course, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="font-semibold mb-2">{course.courseId}</div>
                  <div className="text-sm space-y-1">
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

      {/* Debug Section (Remove in production) */}
  {import.meta && import.meta.env && import.meta.env.DEV && (
        <div className="mt-8 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">API Data Debug</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-semibold mb-2">Summary Data:</h4>
              <pre className="bg-gray-700 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(studentSummary, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Course Performance:</h4>
              <pre className="bg-gray-700 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(coursePerformance, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Trends:</h4>
              <pre className="bg-gray-700 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(trends, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Assessments:</h4>
              <pre className="bg-gray-700 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(assessments, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;