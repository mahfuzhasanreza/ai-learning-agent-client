import React, { useState, useEffect, useRef } from 'react';
import * as Chart from 'chart.js';
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
  X
} from 'lucide-react';

const StudentDashboard = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

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
      assessments: [
        { type: "CT", marks: 20, obtained: 20 },
        { type: "Assignment", marks: 5, obtained: 5 },
        { type: "Attendance", marks: 5, obtained: 5 },
        { type: "MID", marks: 30, obtained: 30 },
        { type: "Final", marks: 40, obtained: 40 }
      ],
      scores: [
        { name: "CT1", score: 16, total: 20 },
        { name: "CT2", score: 16, total: 20 },
        { name: "MID", score: 30, total: 30 },
        { name: "Final", score: 40, total: 40 }
      ],
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

  const data = {
    labels: [
      'Loops',
      'Array',
      'Recursion'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [0.15, 0.25, 0.6],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  useEffect(() => {
    // Register Chart.js components
    Chart.Chart.register(
      Chart.ArcElement,
      Chart.Tooltip,
      Chart.Legend,
      Chart.PieController
    );

    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart.Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'white',
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  const CircularProgress = ({ percentage, size = 60, strokeWidth = 4, color = "blue" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    const colorClasses = {
      blue: "stroke-blue-500",
      green: "stroke-green-500",
      yellow: "stroke-yellow-500",
      red: "stroke-red-500"
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

  const ProgressBar = ({ percentage, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500"
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold ml-2">{studentData.name}</h1>
        </div>
        <div className="flex items-center space-x-6 gap-7">
          <div className="text-center flex justify-center items-center gap-4">
            <div className="text-sm text-gray-400">Completed Credits</div>
            <div className="text-xl font-bold">{studentData.completedCredits}</div>
          </div>
          <div className="text-center flex justify-center items-center gap-4">
            <div className="text-sm text-gray-400 ">CGPA</div>
            <div className="text-xl font-bold">{studentData.cgpa}</div>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Courses */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className='mb-5'>
              {/* Current Trimester */}

              <h2 className="text-xl font-semibold mb-4">Current Trimester</h2>
              <div className="text-gray-300">
                <div>{studentData.currentTrimester}</div>
                <div>{studentData.trimesterCredits} credits</div>
              </div>
            </div>


            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-7">Courses</h2>
              <button className="btn cursor-pointer border-1 border-gray-600 w-full rounded-lg p-2 text-lg font-bold hover:bg-gray-600">
                + Add Course
              </button>
            </div>

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
        </div>

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

            <div className="flex items-center justify-center">
              <div className="flex items-center justify-between w-full text-center">
                <div className="text-sm font-semibold mb-2">Course progress</div>
                <div>
                  <CircularProgress
                    percentage={studentData.selectedCourse.progress}
                    size={120}
                    strokeWidth={8}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="bg-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Scores</h3>
            <div className="space-y-3">
              {studentData.selectedCourse.scores.map((score, index) => (
                <div key={index} className="flex mb-1 justify-between items-center">
                  <span className="font-medium">{score.name}</span>
                  <span className="text-gray-300">
                    {score.score} out of {score.total}
                  </span>
                </div>
              ))}
            </div>
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

        <div className="space-y-6">
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
                  </div>
                  <ProgressBar percentage={topic.progress} />
                </div>
              ))}
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between p-2">
                <span className="text-gray-400 text-sm">Topic Mastery</span>
                <button className="flex px-7 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg gap-1 items-center">
                  <span className="text-sm">Quiz</span>
                  <Edit className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>



          {/* Detected Weakness */}
          <div className="bg-gray-800 rounded-b-lg p-6">

            

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Detected Weakness In</h3>
              <div className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                ?
              </div>
            </div>

            {/* Chart Section */}
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
                <div key={index} className="flex items-center justify-between  p-2 rounded">
                  <span className="text-sm">{topic}</span>
                  <X className="w-6 h-6 px-1 text-white bg-red-600 rounded-full cursor-pointer" />
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">


          {/* Course Assessment */}
          <div className="bg-gray-800 rounded-t-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Course Assessment</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 text-md font-semibold text-center border-b border-gray-600 pb-2">
                <span>Assessment</span>
                <span>Marks</span>
                <span>Obtained</span>
              </div>
              {studentData.selectedCourse.assessments.map((assessment, index) => (
                <div key={index} className="grid grid-cols-3 text-center text-sm mt-2">
                  <span>{assessment.type}</span>
                  <span className='text-gray-400'>{assessment.marks}</span>
                  <span className='text-gray-400'>{assessment.obtained}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Weakness */}
          <div className="bg-gray-800 rounded-lg p-6">





            <div className="mt-4 p-3 bg-gray-700 rounded-lg text-sm">
              <div className="mb-2">
                You have lost <span className="font-semibold">4 marks</span> on CT1 that
                consists loops. Max possibilities in CT (avg best) ÷ 3
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm">
                Ask SPL Agent for tailored plan
              </button>
              <div className="mt-2 text-center">
                <a href="#" className="text-blue-400 text-xs hover:underline">
                  Click here to get course resources
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;