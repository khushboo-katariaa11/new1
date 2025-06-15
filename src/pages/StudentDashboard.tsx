import React, { useState } from 'react';
import { 
  BookOpen, Clock, Award, TrendingUp, Play, Calendar,
  BarChart3, Target, CheckCircle, Star, Download, Flame,
  MessageSquare, Video, FileText, Users, Bell, Settings,
  Search, Filter, Eye, Send, Upload, HelpCircle, Brain,
  Map, PenTool, ChevronRight, Lightbulb, Timer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { mockStudentStats, mockCertificates, mockStreaks } from '../utils/mockData';
import { CourseProgress, Activity } from '../types';
import StreakTracker from '../components/streak/StreakTracker';
import CertificateGenerator from '../components/certificate/CertificateGenerator';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [showLiveClasses, setShowLiveClasses] = useState(false);
  const [showLessonDetails, setShowLessonDetails] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [mindmapNodes, setMindmapNodes] = useState<any[]>([]);
  const { user } = useAuth();
  const { courses, enrollments, certificates, getEnrolledCourses } = useCourse();
  
  const stats = mockStudentStats;
  const userCertificates = certificates.filter(cert => cert.userId === user?.id);
  const userStreak = mockStreaks.find(s => s.userId === user?.id);
  
  // Get only enrolled courses for this user
  const enrolledCourses = user ? getEnrolledCourses(user.id) : [];

  const inProgressCourses = enrolledCourses.filter(course => {
    const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
    return enrollment && enrollment.progress < 100;
  });

  const completedCourses = enrolledCourses.filter(course => {
    const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
    return enrollment && enrollment.progress === 100;
  });

  // Mock live classes data
  const upcomingClasses = [
    {
      id: 'lc1',
      courseId: '1',
      courseName: 'Complete React Development Course',
      instructorName: 'Jane Smith',
      title: 'React Hooks Deep Dive',
      scheduledAt: '2024-01-26T14:00:00Z',
      duration: '90 minutes',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      isRecorded: true
    },
    {
      id: 'lc2',
      courseId: '2',
      courseName: 'Machine Learning with Python',
      instructorName: 'Dr. Michael Chen',
      title: 'Neural Networks Fundamentals',
      scheduledAt: '2024-01-27T16:00:00Z',
      duration: '120 minutes',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
      isRecorded: true
    }
  ];

  // Mock messages data
  const messages = [
    {
      id: 'm1',
      courseId: '1',
      courseName: 'Complete React Development Course',
      instructorName: 'Jane Smith',
      instructorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      lastMessage: 'Great question about useEffect! Let me explain...',
      timestamp: '2024-01-25T14:30:00Z',
      unreadCount: 2,
      messages: [
        {
          id: 'msg1',
          senderId: user?.id,
          senderName: user?.name,
          message: 'Hi! I\'m having trouble understanding how useEffect works with dependencies. Could you help?',
          timestamp: '2024-01-25T14:00:00Z',
          isInstructor: false
        },
        {
          id: 'msg2',
          senderId: '2',
          senderName: 'Jane Smith',
          message: 'Great question about useEffect! Let me explain...',
          timestamp: '2024-01-25T14:30:00Z',
          isInstructor: true
        }
      ]
    }
  ];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'quiz_completed':
        return <Target className="h-4 w-4 text-orange-500" />;
      case 'course_enrolled':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'certificate_earned':
        return <Award className="h-4 w-4 text-purple-500" />;
      case 'streak_maintained':
        return <Flame className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleCertificateDownload = () => {
    console.log('Certificate downloaded');
  };

  const handleCertificateShare = () => {
    console.log('Certificate shared');
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedInstructor) {
      console.log('Sending message:', messageText, 'to instructor:', selectedInstructor);
      setMessageText('');
      // In real app, this would send the message via API
    }
  };

  const handleJoinLiveClass = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const handleAskDoubt = (courseId: string) => {
    const course = enrolledCourses.find(c => c?.id === courseId);
    if (course) {
      setSelectedInstructor(course.instructor.id);
      setShowMessages(true);
    }
  };

  const handleLessonClick = (course: any, lesson: any) => {
    setSelectedCourse(course);
    setSelectedLesson(lesson);
    setShowLessonDetails(true);
  };

  const handleStartLesson = () => {
    if (selectedCourse && selectedLesson) {
      // Navigate to course player with specific lesson
      console.log('Starting lesson:', selectedLesson.title, 'in course:', selectedCourse.title);
      setShowLessonDetails(false);
    }
  };

  const handleSaveNotes = () => {
    console.log('Saving notes:', notes);
    alert('Notes saved successfully!');
  };

  const addMindmapNode = () => {
    const newNode = {
      id: Date.now(),
      text: 'New Concept',
      x: Math.random() * 300,
      y: Math.random() * 200,
      connections: []
    };
    setMindmapNodes([...mindmapNodes, newNode]);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'My Courses' },
    { id: 'live-classes', label: 'Live Classes' },
    { id: 'messages', label: 'Messages' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'streak', label: 'Learning Streak' },
    { id: 'activity', label: 'Activity' },
    { id: 'settings', label: 'Settings' }
  ];

  if (selectedCertificate) {
    const certificate = userCertificates.find(cert => cert.id === selectedCertificate);
    if (certificate) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </button>
            <CertificateGenerator
              certificate={certificate}
              onDownload={handleCertificateDownload}
              onShare={handleCertificateShare}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Track your learning progress.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowMessages(true)}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <MessageSquare className="h-6 w-6" />
              {messages.reduce((total, msg) => total + msg.unreadCount, 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {messages.reduce((total, msg) => total + msg.unreadCount, 0)}
                </span>
              )}
            </button>
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCertificates}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                <p className="text-3xl font-bold text-gray-900">{stats.streak}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Flame className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-3xl font-bold text-gray-900">{formatTime(stats.totalTimeSpent)}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Progress Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm font-bold text-gray-900">{stats.averageProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${stats.averageProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Live Classes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Live Classes</h3>
                  <div className="space-y-3">
                    {upcomingClasses.slice(0, 2).map((liveClass) => (
                      <div key={liveClass.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-blue-900">{liveClass.title}</h4>
                            <p className="text-sm text-blue-700">{liveClass.courseName}</p>
                            <p className="text-sm text-blue-600">
                              {new Date(liveClass.scheduledAt).toLocaleDateString()} at{' '}
                              {new Date(liveClass.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <button
                            onClick={() => handleJoinLiveClass(liveClass.meetingLink)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Video className="h-4 w-4" />
                            <span>Join Class</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Learning */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {inProgressCourses.slice(0, 2).map((course) => {
                      const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
                      return (
                        <div key={course?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <img
                              src={course?.thumbnail}
                              alt={course?.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">{course?.title}</h4>
                              <p className="text-sm text-gray-600 mb-3">{course?.instructor.name}</p>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex-1 mr-4">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${enrollment?.progress || 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1">
                                    {Math.round(enrollment?.progress || 0)}% complete
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm">
                                  <Play className="h-4 w-4" />
                                  <span>Continue</span>
                                </button>
                                <button 
                                  onClick={() => handleAskDoubt(course?.id || '')}
                                  className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium text-sm"
                                >
                                  <HelpCircle className="h-4 w-4" />
                                  <span>Ask Doubt</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {stats.recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.courseName}</p>
                        </div>
                        <div className="text-right">
                          {activity.points && (
                            <div className="text-xs font-medium text-blue-600">+{activity.points} XP</div>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-8">
                {/* In Progress */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    In Progress ({inProgressCourses.length})
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgressCourses.map((course) => {
                      const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
                      return (
                        <div key={course?.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <img
                            src={course?.thumbnail}
                            alt={course?.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{course?.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{course?.instructor.name}</p>
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Progress</span>
                                <span className="text-xs font-medium text-gray-900">
                                  {Math.round(enrollment?.progress || 0)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${enrollment?.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                Continue Learning
                              </button>
                              <div className="grid grid-cols-3 gap-2">
                                <button 
                                  onClick={() => handleAskDoubt(course?.id || '')}
                                  className="bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  <span>Chat</span>
                                </button>
                                <button className="bg-purple-50 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                                  <Video className="h-4 w-4" />
                                  <span>Live</span>
                                </button>
                                <button 
                                  onClick={() => handleLessonClick(course, course?.lessons[0])}
                                  className="bg-orange-50 text-orange-700 py-2 px-3 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>Details</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Completed */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Completed ({completedCourses.length})
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedCourses.map((course) => (
                      <div key={course?.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img
                            src={course?.thumbnail}
                            alt={course?.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{course?.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{course?.instructor.name}</p>
                          <div className="space-y-2">
                            <button 
                              onClick={() => {
                                const cert = userCertificates.find(c => c.courseId === course?.id);
                                if (cert) setSelectedCertificate(cert.id);
                              }}
                              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                            >
                              <Award className="h-4 w-4" />
                              <span>View Certificate</span>
                            </button>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm text-gray-600">Rate Course</span>
                              </div>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Review
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'live-classes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Live Classes</h3>
                </div>

                {/* Upcoming Classes */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Upcoming Classes</h4>
                  <div className="space-y-3">
                    {upcomingClasses.map((liveClass) => (
                      <div key={liveClass.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-blue-900">{liveClass.title}</h5>
                            <p className="text-sm text-blue-700">{liveClass.courseName}</p>
                            <p className="text-sm text-blue-600">
                              {new Date(liveClass.scheduledAt).toLocaleDateString()} at{' '}
                              {new Date(liveClass.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {liveClass.duration}
                            </p>
                            <p className="text-sm text-blue-600">Instructor: {liveClass.instructorName}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleJoinLiveClass(liveClass.meetingLink)}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
                            >
                              <Video className="h-4 w-4" />
                              <span>Join Class</span>
                            </button>
                            <button className="px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm">
                              Add to Calendar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past Classes */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Past Classes</h4>
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">Introduction to React Hooks</h5>
                          <p className="text-sm text-gray-600">Complete React Development Course</p>
                          <p className="text-sm text-gray-600">January 20, 2024 • 90 minutes</p>
                          <p className="text-sm text-gray-600">Recording available</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm flex items-center space-x-2">
                            <Play className="h-4 w-4" />
                            <span>Watch Recording</span>
                          </button>
                          <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search messages..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Message List */}
                  <div className="md:col-span-1 bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">Conversations</h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {messages.map((conversation) => (
                        <div 
                          key={conversation.id}
                          onClick={() => setSelectedInstructor(conversation.instructorName)}
                          className="p-4 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src={conversation.instructorAvatar}
                              alt={conversation.instructorName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{conversation.instructorName}</p>
                                {conversation.unreadCount > 0 && (
                                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{conversation.courseName}</p>
                              <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(conversation.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg">
                    {selectedInstructor ? (
                      <>
                        <div className="p-4 border-b border-gray-200">
                          <h4 className="font-medium text-gray-900">{selectedInstructor}</h4>
                          <p className="text-sm text-gray-500">Instructor</p>
                        </div>
                        <div className="p-4 h-64 overflow-y-auto">
                          <div className="space-y-4">
                            {messages.find(m => m.instructorName === selectedInstructor)?.messages.map((msg) => (
                              <div key={msg.id} className={`flex ${msg.isInstructor ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  msg.isInstructor 
                                    ? 'bg-gray-100 text-gray-900' 
                                    : 'bg-blue-600 text-white'
                                }`}>
                                  <p className="text-sm">{msg.message}</p>
                                  <p className={`text-xs mt-1 ${
                                    msg.isInstructor ? 'text-gray-500' : 'text-blue-100'
                                  }`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 border-t border-gray-200">
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              placeholder="Type your message..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button 
                              onClick={handleSendMessage}
                              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Select a conversation to start messaging</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Certificates ({userCertificates.length})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCertificates.map((certificate) => (
                    <div key={certificate.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Award className="h-8 w-8 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{certificate.courseName}</h4>
                        <p className="text-sm text-gray-600 mb-2">by {certificate.instructorName}</p>
                        <p className="text-xs text-gray-500 mb-4">
                          Completed on {new Date(certificate.completionDate).toLocaleDateString()}
                        </p>
                        {certificate.grade && (
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                            Grade: {certificate.grade}
                          </div>
                        )}
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedCertificate(certificate.id)}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            View Certificate
                          </button>
                          <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'streak' && userStreak && (
              <StreakTracker streak={userStreak} />
            )}

            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Activity</h3>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.description}</h4>
                        <p className="text-sm text-gray-600">{activity.courseName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.points && (
                        <div className="text-right">
                          <div className="text-sm font-bold text-blue-600">+{activity.points} XP</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Student Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Profile Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                          <input
                            type="text"
                            defaultValue={user?.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            defaultValue={user?.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Learning Preferences</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Email notifications for new lessons</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Reminder for live classes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Weekly progress reports</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Accessibility Settings</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Current Settings:</span>
                            <span className="text-sm font-medium">{user?.accessibilitySettings?.disabilityType || 'None'}</span>
                          </div>
                        </div>
                        <button className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Update Accessibility Settings
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Privacy Settings</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Show my progress to instructors</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Allow other students to see my certificates</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Details Modal */}
        {showLessonDetails && selectedLesson && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedLesson.title}</h3>
                  <p className="text-gray-600">{selectedCourse.title}</p>
                </div>
                <button
                  onClick={() => setShowLessonDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="flex-1 flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    {/* Video/Content Area */}
                    <div className="space-y-4">
                      <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                        <button 
                          onClick={handleStartLesson}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Play className="h-5 w-5" />
                          <span>Start Lesson</span>
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Lesson Description</h4>
                        <p className="text-gray-700 text-sm">{selectedLesson.description}</p>
                      </div>

                      {/* Schedule */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Study Schedule</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Duration:</span>
                            <span className="font-medium text-blue-900">{selectedLesson.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Estimated Study Time:</span>
                            <span className="font-medium text-blue-900">45 minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Difficulty:</span>
                            <span className="font-medium text-blue-900">Intermediate</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tools Area */}
                    <div className="space-y-4">
                      {/* Notes */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-3 flex items-center space-x-2">
                          <PenTool className="h-4 w-4" />
                          <span>Lesson Notes</span>
                        </h4>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Take notes while learning..."
                          className="w-full h-32 p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none text-sm"
                        />
                        <button 
                          onClick={handleSaveNotes}
                          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                        >
                          Save Notes
                        </button>
                      </div>

                      {/* Mind Map */}
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-medium text-purple-900 mb-3 flex items-center space-x-2">
                          <Brain className="h-4 w-4" />
                          <span>Mind Map</span>
                        </h4>
                        <div className="bg-white border border-purple-300 rounded-lg h-32 relative overflow-hidden">
                          {mindmapNodes.map((node) => (
                            <div
                              key={node.id}
                              className="absolute bg-purple-100 border border-purple-300 rounded-lg p-2 text-xs cursor-move"
                              style={{ left: node.x, top: node.y }}
                            >
                              {node.text}
                            </div>
                          ))}
                          <button
                            onClick={addMindmapNode}
                            className="absolute bottom-2 right-2 bg-purple-600 text-white p-1 rounded text-xs hover:bg-purple-700 transition-colors"
                          >
                            + Add Node
                          </button>
                        </div>
                      </div>

                      {/* Quiz Preview */}
                      {selectedLesson.quiz && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <h4 className="font-medium text-orange-900 mb-3 flex items-center space-x-2">
                            <HelpCircle className="h-4 w-4" />
                            <span>Quiz Available</span>
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-orange-700">Questions:</span>
                              <span className="font-medium text-orange-900">{selectedLesson.quiz.questions.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-orange-700">Passing Score:</span>
                              <span className="font-medium text-orange-900">{selectedLesson.quiz.passingScore}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-orange-700">Time Limit:</span>
                              <span className="font-medium text-orange-900">{selectedLesson.quiz.timeLimit} minutes</span>
                            </div>
                          </div>
                          <button className="mt-3 w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm">
                            Take Quiz After Lesson
                          </button>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <Lightbulb className="h-4 w-4" />
                          <span>Quick Actions</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>Ask Question</span>
                          </button>
                          <button className="bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>Resources</span>
                          </button>
                          <button className="bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1">
                            <Timer className="h-3 w-3" />
                            <span>Set Timer</span>
                          </button>
                          <button className="bg-orange-600 text-white py-2 px-3 rounded text-sm hover:bg-orange-700 transition-colors flex items-center justify-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>Bookmark</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Modal */}
        {showMessages && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                <button
                  onClick={() => setShowMessages(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 flex">
                {/* Message list and content would go here */}
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;