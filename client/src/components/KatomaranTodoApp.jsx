import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';
import { FiPlus, FiTrash2, FiEdit2, FiShare2, FiCheck, FiMic, FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { FaFire, FaTrophy, FaStar } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const KatomaranTodoApp = () => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharingTask, setSharingTask] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [activeTaskChat, setActiveTaskChat] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const recognitionRef = useRef(null);

  // Initialize with mock data
  useEffect(() => {
    if (!user) return;
    
    const demoTasks = [
      { id: 1, title: 'Complete hackathon project', status: 'in-progress', priority: 'high', dueDate: '2025-07-07', sharedWith: [], chat: [] },
      { id: 2, title: 'Prepare for interview', status: 'todo', priority: 'medium', dueDate: '2025-07-08', sharedWith: [], chat: [] },
      { id: 3, title: 'Deploy application', status: 'done', priority: 'high', dueDate: '2025-07-06', sharedWith: [], chat: [] },
    ];
    setTasks(demoTasks);
  }, [user]);

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewTask(transcript);
        toast.success('Voice input captured!');
      };
      
      recognitionRef.current.onerror = (event) => {
        toast.error('Voice input error: ' + event.error);
      };
    }
  }, []);

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    switch (filter) {
      case 'today': return task.dueDate === today;
      case 'overdue': return task.dueDate < today && task.status !== 'done';
      case 'high': return task.priority === 'high';
      case 'in-progress': return task.status === 'in-progress';
      case 'done': return task.status === 'done';
      default: return true;
    }
  });

  // Task CRUD operations
  const addTask = () => {
    if (!newTask.trim()) {
      toast.error('Task cannot be empty');
      return;
    }
    
    const task = {
      id: Date.now(),
      title: newTask,
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      sharedWith: [],
      chat: []
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setShowTaskForm(false);
    toast.success('Task added successfully!');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted!');
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditText(task.title);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask ? { ...task, title: editText } : task
    ));
    setEditingTask(null);
    toast.success('Task updated!');
  };

  const toggleStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        toast.success(`Task marked as ${newStatus}`);
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const shareTask = () => {
    if (!shareEmail.trim()) {
      toast.error('Please enter an email');
      return;
    }
    
    setTasks(tasks.map(task => 
      task.id === sharingTask 
        ? { ...task, sharedWith: [...task.sharedWith, shareEmail] } 
        : task
    ));
    
    setSharingTask(null);
    setShareEmail('');
    toast.success(`Task shared with ${shareEmail}`);
  };

  // Voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info('Listening... Speak now');
    }
  };

  // AI Task Suggestion
  const suggestNextTask = () => {
    const urgentTasks = tasks.filter(task => 
      task.priority === 'high' && task.status !== 'done'
    );
    
    if (urgentTasks.length > 0) return urgentTasks[0];
    
    const mediumTasks = tasks.filter(task => 
      task.priority === 'medium' && task.status !== 'done'
    );
    
    return mediumTasks.length > 0 ? mediumTasks[0] : null;
  };

  const nextTask = suggestNextTask();

  // Productivity data for charts
  const productivityData = {
    tasksCompleted: tasks.filter(t => t.status === 'done').length,
    completionRate: tasks.length ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0,
    streak: 5, // mock data
  };

  const statusChartData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [{
      data: [
        tasks.filter(t => t.status === 'todo').length,
        tasks.filter(t => t.status === 'in-progress').length,
        tasks.filter(t => t.status === 'done').length
      ],
      backgroundColor: ['#F87171', '#60A5FA', '#34D399']
    }]
  };

  const weeklyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Tasks Completed',
      data: [2, 3, 1, 4, 2, 1, 0], // mock data
      backgroundColor: '#4F46E5'
    }]
  };

  // Auth handlers
  const handleGoogleLogin = (credentialResponse) => {
    const mockUser = {
      name: 'Katomaran User',
      email: 'user@katomaran.com',
      profilePic: 'https://ui-avatars.com/api/?name=Katomaran+User',
      streak: 5,
      xp: 1200
    };
    setUser(mockUser);
    toast.success('Logged in successfully!');
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    toast.success('Logged out successfully!');
  };

  // Chat functions
  const sendChatMessage = () => {
    if (!chatMessage.trim() || !activeTaskChat) return;
    
    setTasks(tasks.map(task => 
      task.id === activeTaskChat
        ? { 
            ...task, 
            chat: [...task.chat, { 
              sender: user.name, 
              message: chatMessage,
              timestamp: new Date().toISOString()
            }]
          }
        : task
    ));
    
    setChatMessage('');
    toast.success('Message sent!');
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Katomaran Todo
          </h1>
          <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
            Manage your tasks efficiently with our powerful todo application
          </p>
          
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error('Google login failed')}
              theme={isDarkMode ? 'filled_black' : 'outline'}
              shape="pill"
            />
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </motion.div>
        <ToastContainer position="bottom-right" theme={isDarkMode ? 'dark' : 'light'} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800'}`}>
      {/* Header */}
      <header className={`p-4 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Katomaran Todo
          </motion.h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFire className="text-orange-500" />
              <span>Streak: {productivityData.streak} days</span>
            </div>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Productivity Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-8 p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h2 className="text-xl font-semibold mb-4">Productivity Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</h3>
              <p className="text-3xl font-bold">{productivityData.tasksCompleted}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
              <p className="text-3xl font-bold">{productivityData.completionRate}%</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</h3>
              <p className="text-3xl font-bold">{productivityData.streak} days</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Task Status</h3>
              <Doughnut data={statusChartData} />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Weekly Progress</h3>
              <Bar data={weeklyChartData} />
            </div>
          </div>
        </motion.section>

        {/* AI Task Suggestion */}
        {nextTask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mb-8 p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 border border-purple-500' : 'bg-white border border-purple-200'}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <FaStar className="text-purple-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Task Suggestion</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Based on your tasks, we recommend working on:</p>
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="font-medium">{nextTask.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {nextTask.priority === 'high' ? 'High priority' : 'Medium priority'} • Due {nextTask.dueDate}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Task Management */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mb-8 p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <option value="all">All Tasks</option>
                <option value="today">Due Today</option>
                <option value="overdue">Overdue</option>
                <option value="high">High Priority</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex items-center space-x-1 px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                <FiPlus size={18} />
                <span>Add Task</span>
              </motion.button>
            </div>
          </div>

          {/* Task Form */}
          <AnimatePresence>
            {showTaskForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                    className={`flex-1 px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  />
                  <button
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : isDarkMode ? 'bg-gray-600 text-blue-400' : 'bg-blue-100 text-blue-500'}`}
                  >
                    <FiMic size={20} />
                  </button>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowTaskForm(false)}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addTask}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white"
                  >
                    Add Task
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className={`p-8 text-center rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-gray-500 dark:text-gray-400">No tasks found. Add a new task to get started!</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border-l-4 ${
                    task.priority === 'high' ? 'border-red-500' : 
                    task.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleStatus(task.id)}
                        className={`p-1 rounded-full mt-1 ${task.status === 'done' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-400 dark:bg-gray-600 dark:text-gray-300'}`}
                      >
                        <FiCheck size={16} />
                      </button>
                      
                      <div className="flex-1">
                        {editingTask === task.id ? (
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className={`w-full px-2 py-1 mb-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} border-b ${isDarkMode ? 'border-gray-500' : 'border-gray-300'}`}
                            autoFocus
                          />
                        ) : (
                          <p className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                            {task.title}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>Due: {task.dueDate}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            task.status === 'done' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                          }`}>
                            {task.status === 'done' ? 'Completed' : 
                             task.status === 'in-progress' ? 'In Progress' : 'To Do'}
                          </span>
                        </div>
                        
                        {task.sharedWith.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Shared with: {task.sharedWith.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {editingTask === task.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded-full"
                          >
                            <FiCheck size={18} />
                          </button>
                          <button
                            onClick={() => setEditingTask(null)}
                            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(task)}
                            className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => setSharingTask(task.id)}
                            className="p-2 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-full"
                          >
                            <FiShare2 size={18} />
                          </button>
                          <button
                            onClick={() => setActiveTaskChat(activeTaskChat === task.id ? null : task.id)}
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Task Chat */}
                  <AnimatePresence>
                    {activeTaskChat === task.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}
                      >
                        <h4 className="text-sm font-medium mb-2">Task Discussion</h4>
                        
                        {task.chat.length > 0 ? (
                          <div className="space-y-2 mb-3">
                            {task.chat.map((msg, i) => (
                              <div key={i} className={`p-2 rounded-lg ${msg.sender === user.name ? 'bg-blue-500 text-white self-end' : isDarkMode ? 'bg-gray-500' : 'bg-gray-200'} max-w-xs`}>
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-xs opacity-70">{msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No messages yet. Start the conversation!</p>
                        )}
                        
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Type a message..."
                            className={`flex-1 px-3 py-2 rounded-md ${isDarkMode ? 'bg-gray-500' : 'bg-white'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-200'}`}
                          />
                          <button
                            onClick={sendChatMessage}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white"
                          >
                            Send
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
      </main>

      {/* Share Task Modal */}
      <AnimatePresence>
        {sharingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`p-6 rounded-xl shadow-lg w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Share Task</h3>
                <button 
                  onClick={() => setSharingTask(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="share-email" className="block text-sm font-medium mb-1">User Email</label>
                  <input
                    type="email"
                    id="share-email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSharingTask(null)}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={shareTask}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white"
                  >
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowTaskForm(!showTaskForm)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg ${showTaskForm ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white z-40`}
      >
        {showTaskForm ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <FiPlus size={24} />
        )}
      </motion.button>

      <ToastContainer position="bottom-right" theme={isDarkMode ? 'dark' : 'light'} />
    </div>
  );
};

export default KatomaranTodoApp;