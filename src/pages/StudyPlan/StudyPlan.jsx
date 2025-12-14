import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Search, CheckCircle, Clock, FileText, Upload, X, Filter, BookOpen, PenTool, GraduationCap, ChevronLeft, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import Navigation from '../../components/LandingPage/components/Navigation';
import FooterSection from '../../components/LandingPage/sections/FooterSection';
import { UserAuth } from '../../context/AuthContext';

const StudyPlan = () => {
  const { getToken, user } = UserAuth();
  const [activeView, setActiveView] = useState('Active'); // Active, Completed
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState(''); // task, assignment, ct
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // For date filtering
  const [selectedDateEvents, setSelectedDateEvents] = useState([]); // Events for selected date
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingDateEvents, setIsLoadingDateEvents] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    type: 'assignment'
  });

  // Data states
  const [tasks, setTasks] = useState([]);

  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = getToken();
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Use user.id to match the API student_id format
      const response = await fetch(`${baseUrl}/api/v1/events/${user.id}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API data to match our task structure
      const transformedTasks = data.map(event => ({
        id: event.id,
        type: getEventTypeLabel(event.type),
        title: event.title,
        deadline: event.event_date, // Maps to event_date from API
        time: event.event_time?.substring(0, 5), // Convert "11:00:00" to "11:00"
        description: event.description,
        completed: event.status === 'done',
        apiType: event.type // Store original API type
      }));
      
      setTasks(transformedTasks);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [user, getToken]);

  // Fetch events from API
  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  // Map API types to display labels
  const getEventTypeLabel = (apiType) => {
    const typeMap = {
      'ct': 'CT',
      'assignment': 'Assignment',
      'task': 'Task'
    };
    return typeMap[apiType] || 'Task';
  };

  // Map display types back to API types
  const getApiType = (displayType) => {
    const typeMap = {
      'task': 'task',
      'assignment': 'assignment',
      'ct': 'ct'
    };
    return typeMap[displayType.toLowerCase()] || 'assignment';
  };

  const resetForms = () => {
    setTaskForm({ 
      title: '', 
      description: '', 
      event_date: '', 
      event_time: '', 
      type: addType === 'ct' ? 'ct' : 'assignment' 
    });
  };

  const handleAddItem = async () => {
    if (!taskForm.title || !taskForm.event_date) {
      alert('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = getToken();
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Format time properly - add :00 for seconds if needed
      let formattedTime = taskForm.event_time;
      if (formattedTime && !formattedTime.includes(':00', 5)) {
        formattedTime = `${formattedTime}:00`;
      } else if (!formattedTime) {
        formattedTime = '00:00:00';
      }


      

      const payload = {
        student_id: user.id,
        title: taskForm.title,
        description: taskForm.description || '',
        type: getApiType(addType),
        event_date: taskForm.event_date,
        event_time: formattedTime
      };

      console.log('Sending payload:', payload); // Debug log

      const response = await fetch(`${baseUrl}/api/v1/events/create`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      
      // Refresh events list
      await fetchEvents();
      
      // Show success message
      setSuccessMessage('Event added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setShowAddModal(false);
      resetForms();
    } catch (err) {
      console.error('Error creating event:', err);
      setErrorMessage('Failed to create event. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.completed ? 'pending' : 'done';
    
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = getToken();
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/api/v1/events/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          title: task.title,
          description: task.description || '',
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));

      // If a date is selected, also update the selected date events
      if (selectedDate) {
        setSelectedDateEvents(selectedDateEvents.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        ));
      }

      // Automatically switch to the appropriate view
      if (newStatus === 'done') {
        setActiveView('Completed');
      } else {
        setActiveView('Active');
      }

      // Show success message
      setSuccessMessage(newStatus === 'done' ? 'Task marked as completed!' : 'Task marked as pending!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating task:', err);
      setErrorMessage('Failed to update task status.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const deleteTask = async (id) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = getToken();
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/api/v1/events/${taskToDelete}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      
      // If a date is selected, also update the selected date events
      if (selectedDate) {
        setSelectedDateEvents(selectedDateEvents.filter(task => task.id !== taskToDelete));
      }
      
      // Show success message
      setSuccessMessage('Event deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Close modal and reset
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setErrorMessage('Failed to delete task.');
      setTimeout(() => setErrorMessage(''), 3000);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      event_date: task.deadline,
      event_time: task.time || '',
      type: task.apiType
    });
    setShowEditModal(true);
  };

  const handleEditItem = async () => {
    if (!taskForm.title) {
      alert('Please enter a title');
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = getToken();
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/api/v1/events/${taskToEdit.id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description || '',
          status: taskToEdit.completed ? 'done' : 'pending'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh events list
      await fetchEvents();
      
      // If a date is selected, also refresh the date-specific events
      if (selectedDate) {
        await fetchEventsByDate(selectedDate);
      }
      
      // Show success message
      setSuccessMessage('Event updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setShowEditModal(false);
      setTaskToEdit(null);
      resetForms();
    } catch (err) {
      console.error('Error updating event:', err);
      setErrorMessage('Failed to update event. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setTaskToEdit(null);
    resetForms();
  };

  const filteredTasks = selectedDate ? selectedDateEvents.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'All' || task.type === filterType;
    const matchesView = activeView === 'Active' ? !task.completed : task.completed;
    
    return matchesSearch && matchesFilter && matchesView;
  }) : tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'All' || task.type === filterType;
    const matchesView = activeView === 'Active' ? !task.completed : task.completed;
    
    return matchesSearch && matchesFilter && matchesView;
  });

  const getStatusBadge = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', class: 'bg-red-500 text-white' };
    else if (diffDays <= 2) return { text: 'Pending', class: 'bg-yellow-600 text-white' };
    return { text: 'Pending', class: 'bg-gray-600 text-white' };
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const fetchEventsByDate = useCallback(async (dateString) => {
    setIsLoadingDateEvents(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const token = getToken();
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/api/v1/events/${user.id}/date/${dateString}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API data to match our task structure
      const transformedEvents = data.map(event => ({
        id: event.id,
        type: getEventTypeLabel(event.type),
        title: event.title,
        deadline: event.event_date,
        time: event.event_time?.substring(0, 5),
        description: event.description,
        completed: event.status === 'done',
        apiType: event.type
      }));
      
      setSelectedDateEvents(transformedEvents);
    } catch (err) {
      console.error('Error fetching events by date:', err);
      setSelectedDateEvents([]);
    } finally {
      setIsLoadingDateEvents(false);
    }
  }, [user, getToken]);

  const handleDateClick = (day) => {
    const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (selectedDate === dateString) {
      // Deselect date
      setSelectedDate(null);
      setSelectedDateEvents([]);
    } else {
      // Select new date and fetch events
      setSelectedDate(dateString);
      fetchEventsByDate(dateString);
    }
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
          className="p-1 hover:bg-[#2a2938] rounded text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-medium text-white">{monthName}</h3>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-1 hover:bg-[#2a2938] rounded text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );

    // Add day headers
    calendar.push(
      <div key="headers" className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs text-gray-400 font-medium p-1">
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
      const hasEvents = dayTasks.length > 0;
      
      calendarDays.push(
        <div 
          key={day} 
          className={`min-h-24 border border-gray-700 p-2 text-xs cursor-pointer transition-all hover:bg-orange-600/10 ${
            isToday ? 'bg-orange-600/10 border-orange-600' : ''
          } ${selectedDate === dateString ? 'ring-2 ring-orange-600 bg-orange-600/20' : ''} ${
            hasEvents ? 'hover:shadow-lg' : ''
          }`}
          onClick={() => handleDateClick(day)}
        >
          <div className={`font-medium mb-1 ${isToday ? 'bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : 'text-white'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayTasks.map((task, index) => (
              <div 
                key={index} 
                className={`text-xs px-2 py-1 rounded truncate ${
                  task.completed 
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                    : 'bg-orange-600/20 text-orange-300 border border-orange-600/30'
                }`}
                title={`${task.title} - ${task.time || 'No time'}`}
              >
                <div className="font-medium truncate">{task.title}</div>
                {task.time && <div className="text-[10px] opacity-75">{task.time}</div>}
              </div>
            ))}
          </div>
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

  const renderAddModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1e1d2e]/90 backdrop-blur-xl rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold capitalize text-white">
              Add {addType === 'ct' ? 'Class Test' : addType}
            </h3>
            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder={`${addType === 'ct' ? 'Class Test' : addType.charAt(0).toUpperCase() + addType.slice(1)} title`}
              className="w-full p-3 bg-[#13121D]/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
              <input
                type="date"
                className="w-full p-3 bg-[#13121D]/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 [color-scheme:dark]"
                value={taskForm.event_date}
                onChange={(e) => setTaskForm({ ...taskForm, event_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Time</label>
              <input
                type="time"
                className="w-full p-3 bg-[#13121D]/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 [color-scheme:dark]"
                value={taskForm.event_time}
                onChange={(e) => setTaskForm({ ...taskForm, event_time: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Description"
              className="w-full p-3 bg-[#13121D]/80 backdrop-blur-sm border border-gray-700 rounded-lg h-24 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            />
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-[#2a2938] text-white"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : `Add ${addType}`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!showEditModal || !taskToEdit) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1e1d2e]/90 backdrop-blur-xl rounded-lg p-6 w-full max-w-md border border-gray-700/50 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              Edit {taskToEdit.type === 'CT' ? 'Class Test' : taskToEdit.type}
            </h3>
            <button onClick={cancelEdit} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-3 bg-[#13121D]/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                placeholder="Description"
                className="w-full p-3 bg-[#13121D]/80 backdrop-blur-sm border border-gray-700 rounded-lg h-24 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={cancelEdit}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-[#2a2938] text-white"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleEditItem}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1e1d2e]/90 backdrop-blur-xl rounded-lg p-6 w-full max-w-md border border-gray-700/50 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Delete Event</h3>
              <p className="text-sm text-gray-400">This action cannot be undone</p>
            </div>
          </div>

          <p className="text-gray-300 mb-6">
            All data associated with this event will be permanently removed.
          </p>

          <div className="flex gap-3">
            <button
              onClick={cancelDelete}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-[#2a2938] text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const monthStats = getMonthStats();
  const allStats = getAllStats();

  return (
    
    <div className="border border-red-600">
       <div className="mx-auto p-15 pt-14 min-h-screen" style={{ backgroundColor: '#13121D' }}>
     
      {/* Header */}
      <div className="mb-5 mt-20 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {/* <Calendar className="w-6 h-6 text-orange-600" /> */}
            Study Plan
          </h1>
          <p className="text-gray-400 text-sm">Track your tasks</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title, course, date"
              className="pl-10 pr-4 py-2 bg-[#1e1d2e] border border-gray-700 rounded-lg w-80 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center bg-[#1e1d2e] rounded-lg border border-gray-700 overflow-hidden">
            <button
              onClick={() => setActiveView('Active')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'Active'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:bg-[#2a2938]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveView('Completed')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'Completed'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:bg-[#2a2938]'
              }`}
            >
              Completed
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            
            {showAddDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1e1d2e] border border-gray-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => { setAddType('task'); setShowAddModal(true); setShowAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-[#2a2938] flex items-center gap-2 text-white"
                >
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  Add Task
                </button>
                <button
                  onClick={() => { setAddType('assignment'); setShowAddModal(true); setShowAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-[#2a2938] flex items-center gap-2 text-white"
                >
                  <PenTool className="w-4 h-4 text-orange-600" />
                  Add Assignment
                </button>
                <button
                  onClick={() => { setAddType('ct'); setShowAddModal(true); setShowAddDropdown(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-[#2a2938] flex items-center gap-2 text-white"
                >
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                  Add Class Test
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats and Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
          {/* All Stats */}
        <div className="bg-[#1e1d2e] rounded-lg p-4 border border-gray-700">
          <h3 className="font-medium text-white mb-3">All</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
                {allStats.total} total
              </span>
              <span className="text-sm text-gray-400">{allStats.pending} pending</span>
            </div>
          </div>
        </div>
        {/* This Month Stats */}
        <div className="bg-[#1e1d2e] rounded-lg p-4 border border-gray-700">
          <h3 className="font-medium text-white mb-3">This Month</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">
                {monthStats.total} items
              </span>
              <span className="text-sm text-gray-400">{monthStats.pending} pending</span>
            </div>
          </div>
        </div>

      

        {/* Filter Type */}
        <div className="bg-[#1e1d2e] rounded-lg p-4 border border-gray-700">
          <h3 className="font-medium text-white mb-3">Filter Type</h3>
          <div className="flex flex-wrap gap-2">
            {['All', 'Task', 'Assignment', 'CT'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  filterType === type
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:bg-[#2a2938] border border-gray-700'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View - Left Half */}
        <div className="bg-[#1e1d2e] rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Calendar View
            </h2>
            <div className="text-sm text-gray-400">
              {selectedDate ? 'Click date again to show all items' : 'Click a date to filter'}
            </div>
          </div>
          {renderCalendar()}
        </div>

        {/* Main Content - Card Layout - Right Half */}
        <div className="space-y-4">
          <div className="bg-[#1e1d2e] rounded-lg p-6 border border-gray-700 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {selectedDate ? `Items for ${formatDate(selectedDate)}` : `${activeView} Items`}
              </h2>
              {selectedDate && (
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedDateEvents([]);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-600/20 text-orange-400 rounded-lg hover:bg-orange-600/30 border border-orange-600/30"
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {(isLoadingEvents || isLoadingDateEvents) ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  <p className="text-gray-400 mt-4">Loading events...</p>
                </div>
              ) : filteredTasks.map(task => (
              <div key={task.id} className="bg-[#1e1d2e] rounded-lg border border-gray-700 p-4 hover:shadow-lg hover:border-orange-600/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {task.type === 'Task' && <BookOpen className="w-5 h-5 text-orange-600" />}
                    {task.type === 'Assignment' && <PenTool className="w-5 h-5 text-orange-600" />}
                    {task.type === 'CT' && <GraduationCap className="w-5 h-5 text-orange-600" />}
                    <span className="text-sm font-medium text-gray-400 capitalize">
                      {task.type === 'CT' ? 'Class Test' : task.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1 text-gray-500 hover:text-orange-600"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-gray-500 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-white mb-2 text-lg leading-tight">{task.title}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.deadline).class}`}>
                    {getStatusBadge(task.deadline).text}
                  </span>
                
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
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
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
                )}

                {task.syllabus && (
                  <p className="text-gray-400 text-sm mb-3">
                    <span className="font-medium text-white">Syllabus:</span> {task.syllabus}
                  </p>
                )}

                {task.links && (
                  <a href={task.links} target="_blank" rel="noopener noreferrer" 
                     className="text-orange-600 text-sm hover:underline block mb-3 truncate">
                    {task.links}
                  </a>
                )}

                {task.files && task.files.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-white mb-1">Files:</p>
                    <div className="flex flex-wrap gap-1">
                      {task.files.slice(0, 2).map((file, index) => (
                        <span key={index} className="inline-block bg-[#2a2938] text-gray-300 px-2 py-1 rounded text-xs">
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
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/30'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {task.completed ? 'Completed' : 'Mark as Done'}
                </button>
              </div>
              ))}
            </div>

            {!isLoadingEvents && !isLoadingDateEvents && filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
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
      </div>

      {renderAddModal()}
      {renderEditModal()}
      {renderDeleteModal()}
      
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-green-500/50">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-red-500/50">
            <X className="w-5 h-5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}
      
    </div>
    </div>
    
 
  );
};

export default StudyPlan;