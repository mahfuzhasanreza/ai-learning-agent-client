import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, CheckCircle, Clock, FileText, Upload, X, Filter, BookOpen, PenTool, GraduationCap, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const StudyPlan = () => {
  const [activeView, setActiveView] = useState('Active'); // Active, Completed
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState(''); // task, assignment, ct
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // For date filtering
  
  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    deadline: '',
    links: '',
    description: '',
    files: []
  });
  
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    deadline: '',
    questions: '',
    files: []
  });
  
  const [ctForm, setCTForm] = useState({
    courseName: '',
    ctNumber: '',
    date: '',
    time: '',
    syllabus: ''
  });

  // Data states
  const [tasks, setTasks] = useState([
    {
      id: 1,
      type: 'Task',
      title: 'Read Chapter 3',
      deadline: '2025-09-09',
      description: 'Focus on dynamic programming intro.',
      links: 'https://example.com/ch3',
      completed: false,
      files: []
    },
    {
      id: 2,
      type: 'Assignment',
      title: 'DSA Assignment 1',
      deadline: '2025-09-17',
      description: 'Implement stack & queue.',
      completed: false,
      files: ['Slides Week 2.pdf']
    },
    {
      id: 3,
      type: 'CT',
      title: 'CSE 2201 - CT-2',
      courseName: 'CSE 2201',
      ctNumber: 'CT-2',
      deadline: '2025-09-21',
      time: '10:30',
      syllabus: 'Ch 1-3, recursion basics',
      completed: false,
      files: []
    }
  ]);

  const resetForms = () => {
    setTaskForm({ title: '', deadline: '', links: '', description: '', files: [] });
    setAssignmentForm({ title: '', deadline: '', questions: '', files: [] });
    setCTForm({ courseName: '', ctNumber: '', date: '', time: '', syllabus: '' });
  };

  const handleAddItem = () => {
    let newItem;
    const newId = tasks.length + 1;
    
    if (addType === 'task') {
      newItem = {
        id: newId,
        type: 'Task',
        title: taskForm.title,
        deadline: taskForm.deadline,
        description: taskForm.description,
        links: taskForm.links,
        files: taskForm.files,
        completed: false
      };
    } else if (addType === 'assignment') {
      newItem = {
        id: newId,
        type: 'Assignment',
        title: assignmentForm.title,
        deadline: assignmentForm.deadline,
        questions: assignmentForm.questions,
        files: assignmentForm.files,
        completed: false
      };
    } else if (addType === 'ct') {
      newItem = {
        id: newId,
        type: 'CT',
        title: `${ctForm.courseName} - ${ctForm.ctNumber}`,
        courseName: ctForm.courseName,
        ctNumber: ctForm.ctNumber,
        deadline: ctForm.date,
        time: ctForm.time,
        syllabus: ctForm.syllabus,
        completed: false,
        files: []
      };
    }
    
    setTasks([...tasks, newItem]);
    setShowAddModal(false);
    resetForms();
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (task.courseName && task.courseName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'All' || task.type === filterType;
    const matchesView = activeView === 'Active' ? !task.completed : task.completed;
    const matchesDate = !selectedDate || task.deadline === selectedDate;
    
    return matchesSearch && matchesFilter && matchesView && matchesDate;
  });

  const getStatusBadge = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', class: 'bg-red-500 text-white' };
    if (diffDays <= 2) return { text: 'Pending', class: 'bg-yellow-600 text-white' };
    return { text: 'Pending', class: 'bg-gray-600 text-white' };
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day) => {
    const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(selectedDate === dateString ? null : dateString);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
  };

  const getMonthStats = () => {
    const currentMonthTasks = tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.getMonth() === currentMonth.getMonth() && 
             taskDate.getFullYear() === currentMonth.getFullYear();
    });
    
    return {
      total: currentMonthTasks.length,
      pending: currentMonthTasks.filter(task => !task.completed).length
    };
  };

  const getAllStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter(task => !task.completed).length
    };
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const calendar = [];

    // Add month navigation
    calendar.push(
      <div key="nav" className="flex items-center justify-between mb-4">
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-medium">{monthName}</h3>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );

    // Add day headers
    calendar.push(
      <div key="headers" className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs text-gray-500 font-medium p-1">
            {day}
          </div>
        ))}
      </div>
    );

    // Add calendar days
    const calendarDays = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-16"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTasks = tasks.filter(task => task.deadline === dateString);
      const isToday = new Date().toDateString() === new Date(dateString).toDateString();
      
      calendarDays.push(
        <div 
          key={day} 
          className={`h-16 border border-gray-100 p-1 text-xs cursor-pointer transition-colors hover:bg-blue-50 ${
            isToday ? 'bg-blue-50' : ''
          } ${selectedDate === dateString ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className={`font-medium ${isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : 'text-gray-900'}`}>
            {day}
          </div>
          {dayTasks.slice(0, 2).map((task, index) => (
            <div key={index} className="text-xs mt-1 p-1 bg-gray-100 rounded truncate">
              {task.type === 'CT' ? task.ctNumber : task.title.split(' ').slice(0, 2).join(' ')}
            </div>
          ))}
          {dayTasks.length > 2 && (
            <div className="text-xs text-gray-500 mt-1">+{dayTasks.length - 2} more</div>
          )}
        </div>
      );
    }

    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(
        <div key={`week-${i}`} className="grid grid-cols-7 gap-1">
          {calendarDays.slice(i, i + 7)}
        </div>
      );
    }

    calendar.push(...weeks);
    return calendar;
  };

  const handleFileUpload = (e, formType) => {
    const files = Array.from(e.target.files).map(file => file.name);
    if (formType === 'task') {
      setTaskForm({ ...taskForm, files: [...taskForm.files, ...files] });
    } else if (formType === 'assignment') {
      setAssignmentForm({ ...assignmentForm, files: [...assignmentForm.files, ...files] });
    }
  };

  const removeFile = (fileName, formType) => {
    if (formType === 'task') {
      setTaskForm({ ...taskForm, files: taskForm.files.filter(f => f !== fileName) });
    } else if (formType === 'assignment') {
      setAssignmentForm({ ...assignmentForm, files: assignmentForm.files.filter(f => f !== fileName) });
    }
  };

  const renderAddModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold capitalize">
              Add {addType} {addType === 'ct' ? 'Date' : ''}
            </h3>
            <button onClick={() => setShowAddModal(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {addType === 'task' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                className="w-full p-3 border rounded-lg"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                value={taskForm.deadline}
                onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
              />
              <input
                type="url"
                placeholder="Necessary links"
                className="w-full p-3 border rounded-lg"
                value={taskForm.links}
                onChange={(e) => setTaskForm({ ...taskForm, links: e.target.value })}
              />
              <textarea
                placeholder="Short description"
                className="w-full p-3 border rounded-lg h-24"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Upload Files</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'task')}
                  className="w-full p-2 border rounded-lg"
                />
                {taskForm.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 mt-1 rounded">
                    <span className="text-sm">{file}</span>
                    <button onClick={() => removeFile(file, 'task')}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {addType === 'assignment' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Assignment title"
                className="w-full p-3 border rounded-lg"
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                value={assignmentForm.deadline}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
              />
              <textarea
                placeholder="Assignment questions"
                className="w-full p-3 border rounded-lg h-24"
                value={assignmentForm.questions}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, questions: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Add Multiple Files (Class notes, Slides)</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'assignment')}
                  className="w-full p-2 border rounded-lg"
                />
                {assignmentForm.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 mt-1 rounded">
                    <span className="text-sm">{file}</span>
                    <button onClick={() => removeFile(file, 'assignment')}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {addType === 'ct' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Course name"
                className="w-full p-3 border rounded-lg"
                value={ctForm.courseName}
                onChange={(e) => setCTForm({ ...ctForm, courseName: e.target.value })}
              />
              <input
                type="text"
                placeholder="CT Number (e.g., CT-2)"
                className="w-full p-3 border rounded-lg"
                value={ctForm.ctNumber}
                onChange={(e) => setCTForm({ ...ctForm, ctNumber: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                value={ctForm.date}
                onChange={(e) => setCTForm({ ...ctForm, date: e.target.value })}
              />
              <input
                type="time"
                className="w-full p-3 border rounded-lg"
                value={ctForm.time}
                onChange={(e) => setCTForm({ ...ctForm, time: e.target.value })}
              />
              <textarea
                placeholder="CT Syllabus"
                className="w-full p-3 border rounded-lg h-24"
                value={ctForm.syllabus}
                onChange={(e) => setCTForm({ ...ctForm, syllabus: e.target.value })}
              />
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add {addType}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const monthStats = getMonthStats();
  const allStats = getAllStats();

  return (
    <div className="mx-auto p-64 pt-14 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Study Plan
          </h1>
          <p className="text-gray-600 text-sm">Track Tasks • Assignments • CTs</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title, course, date (YYYY-MM-DD)"
              className="pl-10 pr-4 py-2 border rounded-lg w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center bg-white rounded-lg border overflow-hidden">
            <button
              onClick={() => setActiveView('Active')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'Active'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveView('Completed')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'Completed'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Completed
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            
            {showAddDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => { setAddType('task'); setShowAddModal(true); setShowAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Add Task
                </button>
                <button
                  onClick={() => { setAddType('assignment'); setShowAddModal(true); setShowAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                >
                  <PenTool className="w-4 h-4" />
                  Add Assignment
                </button>
                <button
                  onClick={() => { setAddType('ct'); setShowAddModal(true); setShowAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Add CT's Date
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats and Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* This Month Stats */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-medium text-gray-900 mb-3">This Month</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium">
                {monthStats.total} items
              </span>
              <span className="text-sm text-gray-600">{monthStats.pending} pending</span>
            </div>
          </div>
        </div>

        {/* All Stats */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-medium text-gray-900 mb-3">All</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium">
                {allStats.total} total
              </span>
              <span className="text-sm text-gray-600">{allStats.pending} pending</span>
            </div>
          </div>
        </div>

        {/* Filter Type */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-medium text-gray-900 mb-3">Filter Type</h3>
          <div className="flex flex-wrap gap-2">
            {['All', 'Task', 'Assignment', 'CT'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  filterType === type
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 border'
                }`}
              >
                {type === 'Task' && <BookOpen className="w-4 h-4" />}
                {type === 'Assignment' && <PenTool className="w-4 h-4" />}
                {type === 'CT' && <GraduationCap className="w-4 h-4" />}
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Sidebar */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-center text-sm text-gray-600 mb-4">Click a date to filter</div>
          {renderCalendar()}
        </div>

        {/* Main Content - Card Layout */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedDate ? `Items for ${formatDate(selectedDate)}` : `${activeView} Items`}
            </h2>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear Date Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTasks.map(task => (
              <div key={task.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {task.type === 'Task' && <BookOpen className="w-5 h-5 text-blue-600" />}
                    {task.type === 'Assignment' && <PenTool className="w-5 h-5 text-green-600" />}
                    {task.type === 'CT' && <GraduationCap className="w-5 h-5 text-purple-600" />}
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {task.type === 'CT' ? 'Class Test' : task.type}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight">{task.title}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.deadline).class}`}>
                    {getStatusBadge(task.deadline).text}
                  </span>
                  {!task.completed && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(task.deadline)}
                  </div>
                  {task.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {task.time}
                    </div>
                  )}
                </div>

                {task.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                )}

                {task.syllabus && (
                  <p className="text-gray-600 text-sm mb-3">
                    <span className="font-medium">Syllabus:</span> {task.syllabus}
                  </p>
                )}

                {task.links && (
                  <a href={task.links} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 text-sm hover:underline block mb-3 truncate">
                    {task.links}
                  </a>
                )}

                {task.files && task.files.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Files:</p>
                    <div className="flex flex-wrap gap-1">
                      {task.files.slice(0, 2).map((file, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {file}
                        </span>
                      ))}
                      {task.files.length > 2 && (
                        <span className="text-xs text-gray-500">+{task.files.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                    task.completed
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {task.completed ? 'Completed' : 'Mark as Done'}
                </button>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">
                {selectedDate 
                  ? `No ${activeView.toLowerCase()} items found for ${formatDate(selectedDate)}`
                  : activeView === 'Completed' 
                    ? 'No completed tasks yet' 
                    : 'No items match your search criteria'
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {renderAddModal()}
    </div>
  );
};

export default StudyPlan;