import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, CheckCircle, Clock, FileText, Upload, X, Filter, BookOpen, PenTool, GraduationCap } from 'lucide-react';

const StudyPlan = () => {
  const [activeView, setActiveView] = useState('overview'); // overview, completed
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState(''); // task, assignment, ct
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
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
      type: 'task',
      title: 'Complete React Assignment',
      deadline: '2024-11-15',
      description: 'Build a responsive web application',
      links: 'https://github.com/example',
      completed: false,
      files: ['notes.pdf']
    },
    {
      id: 2,
      type: 'assignment',
      title: 'Database Design Project',
      deadline: '2024-11-20',
      questions: 'Design a normalized database for an e-commerce system',
      completed: false,
      files: ['requirements.pdf', 'slides.pptx']
    },
    {
      id: 3,
      type: 'ct',
      title: 'Data Structures CT-2',
      courseName: 'Data Structures',
      ctNumber: 'CT-2',
      deadline: '2024-11-18',
      time: '10:00 AM',
      syllabus: 'Trees, Graphs, Sorting Algorithms',
      completed: false
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
        type: 'task',
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
        type: 'assignment',
        title: assignmentForm.title,
        deadline: assignmentForm.deadline,
        questions: assignmentForm.questions,
        files: assignmentForm.files,
        completed: false
      };
    } else if (addType === 'ct') {
      newItem = {
        id: newId,
        type: 'ct',
        title: `${ctForm.courseName} ${ctForm.ctNumber}`,
        courseName: ctForm.courseName,
        ctNumber: ctForm.ctNumber,
        deadline: ctForm.date,
        time: ctForm.time,
        syllabus: ctForm.syllabus,
        completed: false
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

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (task.courseName && task.courseName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || task.type === filterType;
    const matchesView = activeView === 'overview' ? !task.completed : task.completed;
    
    return matchesSearch && matchesFilter && matchesView;
  });

  const getDeadlineColor = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 bg-red-50';
    if (diffDays <= 2) return 'text-orange-600 bg-orange-50';
    if (diffDays <= 7) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'task': return <BookOpen className="w-5 h-5" />;
      case 'assignment': return <PenTool className="w-5 h-5" />;
      case 'ct': return <GraduationCap className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Study Plan</h1>
          
          {/* Add Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add New
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks, assignments, or CTs..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="task">Tasks</option>
              <option value="assignment">Assignments</option>
              <option value="ct">CTs</option>
            </select>
            
            <button
              onClick={() => setActiveView(activeView === 'overview' ? 'completed' : 'overview')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeView === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {activeView === 'completed' ? 'Show Pending' : 'Completed Tasks'}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Visual (Simplified) */}
      {activeView === 'overview' && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Deadlines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const dateStr = date.toISOString().split('T')[0];
              const dayTasks = tasks.filter(task => 
                task.deadline === dateStr && !task.completed
              );
              
              return (
                <div key={i} className="border rounded p-2 h-24">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                  </div>
                  {dayTasks.map(task => (
                    <div key={task.id} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded mb-1 truncate">
                      {task.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(task.type)}
                <span className="text-sm font-medium text-gray-500 capitalize">
                  {task.type === 'ct' ? 'Class Test' : task.type}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeadlineColor(task.deadline)}`}>
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
            
            {task.type === 'task' && (
              <>
                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                {task.links && (
                  <a href={task.links} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 text-sm hover:underline block mb-2">
                    View Links
                  </a>
                )}
              </>
            )}
            
            {task.type === 'assignment' && (
              <p className="text-gray-600 text-sm mb-2">{task.questions}</p>
            )}
            
            {task.type === 'ct' && (
              <div className="text-sm space-y-1 mb-3">
                <p><span className="font-medium">Course:</span> {task.courseName}</p>
                <p><span className="font-medium">CT Number:</span> {task.ctNumber}</p>
                <p><span className="font-medium">Time:</span> {task.time}</p>
                <p><span className="font-medium">Syllabus:</span> {task.syllabus}</p>
              </div>
            )}

            {task.files && task.files.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Files:</p>
                {task.files.map((file, index) => (
                  <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                    {file}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => toggleComplete(task.id)}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                task.completed
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
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
            {activeView === 'completed' ? 'No completed tasks yet' : 'No items match your search criteria'}
          </div>
        </div>
      )}

      {renderAddModal()}
    </div>
  );
};

export default StudyPlan;